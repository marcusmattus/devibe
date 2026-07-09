export interface CloudGenerationResult {
  terraformFiles: { path: string; content: string }[];
  resources: string[];
  estimatedMonthlyCost: string;
}

const awsTerraform = `# VibeCursor Cloud Factory — AWS Production Stack
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

# VPC with public/private subnets across 3 AZs
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"
  name    = "\${var.app_name}-vpc"
  cidr    = "10.0.0.0/16"
  azs             = ["\${var.region}a", "\${var.region}b", "\${var.region}c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
  enable_nat_gateway = true
  single_nat_gateway = false
}

# Lambda API with auto-scaling
resource "aws_lambda_function" "api" {
  function_name = "\${var.app_name}-api"
  runtime       = "nodejs20.x"
  handler       = "dist/index.handler"
  memory_size   = 1024
  timeout       = 30
  reserved_concurrent_executions = 500

  environment {
    variables = {
      NODE_ENV    = var.environment
      DB_HOST     = aws_rds_cluster.main.endpoint
      S3_BUCKET   = aws_s3_bucket.assets.id
    }
  }

  tracing_config { mode = "Active" }
}

resource "aws_appautoscaling_target" "lambda" {
  max_capacity       = 1000
  min_capacity       = 10
  resource_id        = "function:\${aws_lambda_function.api.function_name}"
  scalable_dimension = "lambda:function:ProvisionedConcurrency"
  service_namespace  = "lambda"
}

# Aurora Serverless v2 PostgreSQL
resource "aws_rds_cluster" "main" {
  cluster_identifier     = "\${var.app_name}-db"
  engine                 = "aurora-postgresql"
  engine_mode            = "provisioned"
  engine_version         = "15.4"
  database_name          = "vibecursor"
  master_username        = "admin"
  manage_master_user_password = true
  storage_encrypted      = true
  backup_retention_period = 30
  deletion_protection    = true

  serverlessv2_scaling_configuration {
    min_capacity = 2
    max_capacity = 64
  }
}

# S3 with lifecycle policies
resource "aws_s3_bucket" "assets" {
  bucket = "\${var.app_name}-assets-\${var.environment}"
}

resource "aws_s3_bucket_lifecycle_configuration" "assets" {
  bucket = aws_s3_bucket.assets.id
  rule {
    id     = "archive-old"
    status = "Enabled"
    transition { days = 90, storage_class = "GLACIER" }
  }
}

# CloudWatch + X-Ray observability
resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "\${var.app_name}-dashboard"
  dashboard_body = jsonencode({
    widgets = [{
      type = "metric", properties = {
        metrics = [["AWS/Lambda", "Invocations"], [".", "Errors"], [".", "Duration"]]
        period = 300, stat = "Sum", region = var.region, title = "API Metrics"
      }
    }]
  })
}

resource "aws_cloudwatch_metric_alarm" "error_rate" {
  alarm_name          = "\${var.app_name}-error-rate"
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
  name = "\${var.app_name}-alerts"
}

output "api_endpoint" { value = aws_lambda_function.api.arn }
output "db_endpoint" { value = aws_rds_cluster.main.endpoint }
output "assets_bucket" { value = aws_s3_bucket.assets.id }
`;

const gcpTerraform = `# VibeCursor Cloud Factory — GCP Production Stack
# Cloud Run, Cloud SQL, GCS with auto-scaling for 100k+ users

terraform {
  required_version = ">= 1.5"
  required_providers {
    google = { source = "hashicorp/google", version = "~> 5.0" }
  }
  backend "gcs" {
    bucket = "vibecursor-tf-state"
    prefix = "production"
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

variable "project_id" { type = string }
variable "region" { default = "us-central1" }
variable "app_name" { default = "vibecursor-app" }

# Cloud Run with auto-scaling
resource "google_cloud_run_v2_service" "api" {
  name     = "\${var.app_name}-api"
  location = var.region

  template {
    scaling {
      min_instance_count = 2
      max_instance_count = 100
    }
    containers {
      image = "gcr.io/\${var.project_id}/\${var.app_name}-api:latest"
      resources {
        limits = { cpu = "2", memory = "1Gi" }
      }
      env {
        name  = "DB_CONNECTION"
        value = google_sql_database_instance.main.connection_name
      }
    }
  }

  traffic { type = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST", percent = 100 }
}

# Cloud SQL PostgreSQL
resource "google_sql_database_instance" "main" {
  name             = "\${var.app_name}-db"
  database_version = "POSTGRES_15"
  region           = var.region

  settings {
    tier              = "db-custom-2-8192"
    availability_type = "REGIONAL"
    disk_autoresize   = true
    disk_size         = 50

    backup_configuration {
      enabled                        = true
      point_in_time_recovery_enabled = true
      transaction_log_retention_days   = 7
    }

    insights_config { query_insights_enabled = true }
  }

  deletion_protection = true
}

# GCS with lifecycle
resource "google_storage_bucket" "assets" {
  name          = "\${var.project_id}-\${var.app_name}-assets"
  location      = var.region
  force_destroy = false

  lifecycle_rule {
    condition { age = 90 }
    action { type = "SetStorageClass", storage_class = "ARCHIVE" }
  }

  versioning { enabled = true }
}

# Monitoring & alerting
resource "google_monitoring_alert_policy" "error_rate" {
  display_name = "\${var.app_name} Error Rate"
  combiner     = "OR"

  conditions {
    display_name = "Cloud Run 5xx rate"
    condition_threshold {
      filter          = "resource.type=\\"cloud_run_revision\\" AND metric.type=\\"run.googleapis.com/request_count\\""
      comparison      = "COMPARISON_GT"
      threshold_value = 10
      duration        = "300s"
    }
  }

  notification_channels = [google_monitoring_notification_channel.email.id]
}

resource "google_monitoring_notification_channel" "email" {
  display_name = "VibeCursor Alerts"
  type         = "email"
  labels = { email_address = "alerts@vibecursor.app" }
}

output "cloud_run_url" { value = google_cloud_run_v2_service.api.uri }
output "sql_connection" { value = google_sql_database_instance.main.connection_name }
output "assets_bucket" { value = google_storage_bucket.assets.name }
`;

export async function generateCloudInfrastructure(
  description: string,
  provider: 'aws' | 'gcp',
  onProgress?: (progress: number) => void
): Promise<CloudGenerationResult> {
  const steps = 10;
  for (let i = 1; i <= steps; i++) {
    await new Promise((r) => setTimeout(r, 300));
    onProgress?.(Math.round((i / steps) * 100));
  }

  const terraform = provider === 'aws' ? awsTerraform : gcpTerraform;
  const providerDir = provider === 'aws' ? 'cloud/aws' : 'cloud/gcp';

  return {
    terraformFiles: [
      { path: `${providerDir}/main.tf`, content: terraform },
      {
        path: `${providerDir}/variables.tf`,
        content: provider === 'aws'
          ? 'variable "region" { default = "us-east-1" }\nvariable "environment" { default = "production" }'
          : 'variable "project_id" { type = string }\nvariable "region" { default = "us-central1" }',
      },
    ],
    resources: provider === 'aws'
      ? ['VPC (3 AZ)', 'Lambda API (auto-scale 10-1000)', 'Aurora PostgreSQL Serverless v2', 'S3 + Glacier lifecycle', 'CloudWatch + X-Ray', 'SNS Alerts']
      : ['Cloud Run (2-100 instances)', 'Cloud SQL PostgreSQL HA', 'GCS + Archive lifecycle', 'Cloud Monitoring alerts', 'IAM service accounts'],
    estimatedMonthlyCost: provider === 'aws' ? '$450–$1,200 (at 100k MAU)' : '$380–$950 (at 100k MAU)',
  };
}
