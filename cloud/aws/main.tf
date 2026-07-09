# VibeCursor Cloud Factory — AWS Production Stack
# Auto-scaling, observability, and cost-optimized for 100k+ users

terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
  }
  backend "s3" {
    bucket         = "vibecursor-tf-state"
    key            = "production/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "vibecursor-tf-locks"
    encrypt        = true
  }
}

provider "aws" { region = var.region }

variable "region" { default = "us-east-1" }
variable "environment" { default = "production" }
variable "app_name" { default = "vibecursor-app" }

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"
  name    = "${var.app_name}-vpc"
  cidr    = "10.0.0.0/16"
  azs             = ["${var.region}a", "${var.region}b", "${var.region}c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
  enable_nat_gateway = true
  single_nat_gateway = false
}

resource "aws_lambda_function" "api" {
  function_name = "${var.app_name}-api"
  runtime       = "nodejs20.x"
  handler       = "dist/index.handler"
  memory_size   = 1024
  timeout       = 30
  reserved_concurrent_executions = 500

  environment {
    variables = {
      NODE_ENV  = var.environment
      DB_HOST   = aws_rds_cluster.main.endpoint
      S3_BUCKET = aws_s3_bucket.assets.id
    }
  }

  tracing_config { mode = "Active" }
}

resource "aws_appautoscaling_target" "lambda" {
  max_capacity       = 1000
  min_capacity       = 10
  resource_id        = "function:${aws_lambda_function.api.function_name}"
  scalable_dimension = "lambda:function:ProvisionedConcurrency"
  service_namespace  = "lambda"
}

resource "aws_rds_cluster" "main" {
  cluster_identifier          = "${var.app_name}-db"
  engine                      = "aurora-postgresql"
  engine_mode                 = "provisioned"
  engine_version              = "15.4"
  database_name               = "vibecursor"
  master_username             = "admin"
  manage_master_user_password = true
  storage_encrypted           = true
  backup_retention_period     = 30
  deletion_protection         = true

  serverlessv2_scaling_configuration {
    min_capacity = 2
    max_capacity = 64
  }
}

resource "aws_s3_bucket" "assets" {
  bucket = "${var.app_name}-assets-${var.environment}"
}

resource "aws_s3_bucket_lifecycle_configuration" "assets" {
  bucket = aws_s3_bucket.assets.id
  rule {
    id     = "archive-old"
    status = "Enabled"
    transition {
      days          = 90
      storage_class = "GLACIER"
    }
  }
}

resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "${var.app_name}-dashboard"
  dashboard_body = jsonencode({
    widgets = [{
      type = "metric"
      properties = {
        metrics = [["AWS/Lambda", "Invocations"], [".", "Errors"], [".", "Duration"]]
        period  = 300
        stat    = "Sum"
        region  = var.region
        title   = "API Metrics"
      }
    }]
  })
}

resource "aws_cloudwatch_metric_alarm" "error_rate" {
  alarm_name          = "${var.app_name}-error-rate"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = 300
  statistic           = "Sum"
  threshold           = 10
  alarm_actions       = [aws_sns_topic.alerts.arn]
}

resource "aws_sns_topic" "alerts" {
  name = "${var.app_name}-alerts"
}

output "api_endpoint" { value = aws_lambda_function.api.arn }
output "db_endpoint" { value = aws_rds_cluster.main.endpoint }
output "assets_bucket" { value = aws_s3_bucket.assets.id }
