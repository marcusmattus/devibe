terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

variable "aws_region" {
  default = "us-east-1"
}

variable "app_name" {
  default = "devibe-app"
}

variable "environment" {
  default = "production"
}

# VPC with public/private subnets
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "${var.app_name}-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["${var.aws_region}a", "${var.aws_region}b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = false
  enable_dns_hostnames = true
}

# RDS PostgreSQL with read replica
resource "aws_db_instance" "primary" {
  identifier           = "${var.app_name}-db"
  engine               = "postgres"
  engine_version       = "15"
  instance_class       = "db.r6g.large"
  allocated_storage    = 100
  max_allocated_storage = 1000
  storage_encrypted    = true

  db_name  = "devibe"
  username = "admin"
  password = var.db_password

  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name

  backup_retention_period = 7
  multi_az               = true
  deletion_protection    = true

  tags = {
    Environment = var.environment
    App         = var.app_name
  }
}

resource "aws_db_instance" "replica" {
  identifier          = "${var.app_name}-db-replica"
  replicate_source_db = aws_db_instance.primary.identifier
  instance_class      = "db.r6g.large"
  publicly_accessible = false

  tags = {
    Environment = var.environment
    Role        = "read-replica"
  }
}

variable "db_password" {
  type      = string
  sensitive = true
}

resource "aws_db_subnet_group" "main" {
  name       = "${var.app_name}-db-subnet"
  subnet_ids = module.vpc.private_subnets
}

resource "aws_security_group" "rds" {
  name   = "${var.app_name}-rds-sg"
  vpc_id = module.vpc.vpc_id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = [module.vpc.vpc_cidr_block]
  }
}

# S3 bucket for assets
resource "aws_s3_bucket" "assets" {
  bucket = "${var.app_name}-assets-${var.environment}"
}

resource "aws_s3_bucket_versioning" "assets" {
  bucket = aws_s3_bucket.assets.id
  versioning_configuration {
    status = "Enabled"
  }
}

# CloudFront CDN
resource "aws_cloudfront_distribution" "cdn" {
  enabled = true

  origin {
    domain_name = aws_s3_bucket.assets.bucket_regional_domain_name
    origin_id   = "S3-${aws_s3_bucket.assets.id}"
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-${aws_s3_bucket.assets.id}"
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies { forward = "none" }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

# Lambda API with auto-scaling
resource "aws_lambda_function" "api" {
  function_name = "${var.app_name}-api"
  role          = aws_iam_role.lambda.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  timeout       = 30
  memory_size   = 512

  filename = "lambda.zip"

  environment {
    variables = {
      DATABASE_URL = aws_db_instance.primary.endpoint
      S3_BUCKET    = aws_s3_bucket.assets.bucket
      ENVIRONMENT  = var.environment
    }
  }

  vpc_config {
    subnet_ids         = module.vpc.private_subnets
    security_group_ids = [aws_security_group.lambda.id]
  }
}

resource "aws_appautoscaling_target" "lambda" {
  max_capacity       = 100
  min_capacity       = 2
  resource_id        = "function:${aws_lambda_function.api.function_name}"
  scalable_dimension = "lambda:function:ProvisionedConcurrency"
  service_namespace  = "lambda"
}

resource "aws_iam_role" "lambda" {
  name = "${var.app_name}-lambda-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

resource "aws_security_group" "lambda" {
  name   = "${var.app_name}-lambda-sg"
  vpc_id = module.vpc.vpc_id
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# CloudWatch monitoring & alarms
resource "aws_cloudwatch_metric_alarm" "lambda_errors" {
  alarm_name          = "${var.app_name}-lambda-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = 300
  statistic           = "Sum"
  threshold           = 10
  alarm_description   = "Lambda error rate alarm for production bug fixing"

  dimensions = {
    FunctionName = aws_lambda_function.api.function_name
  }
}

output "api_endpoint" {
  value = aws_lambda_function.api.arn
}

output "database_endpoint" {
  value = aws_db_instance.primary.endpoint
}

output "cdn_domain" {
  value = aws_cloudfront_distribution.cdn.domain_name
}
