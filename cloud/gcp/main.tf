# VibeCursor Cloud Factory — GCP Production Stack
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

resource "google_cloud_run_v2_service" "api" {
  name     = "${var.app_name}-api"
  location = var.region

  template {
    scaling {
      min_instance_count = 2
      max_instance_count = 100
    }
    containers {
      image = "gcr.io/${var.project_id}/${var.app_name}-api:latest"
      resources {
        limits = { cpu = "2", memory = "1Gi" }
      }
      env {
        name  = "DB_CONNECTION"
        value = google_sql_database_instance.main.connection_name
      }
    }
  }

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }
}

resource "google_sql_database_instance" "main" {
  name             = "${var.app_name}-db"
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
      transaction_log_retention_days = 7
    }

    insights_config {
      query_insights_enabled = true
    }
  }

  deletion_protection = true
}

resource "google_storage_bucket" "assets" {
  name          = "${var.project_id}-${var.app_name}-assets"
  location      = var.region
  force_destroy = false

  lifecycle_rule {
    condition { age = 90 }
    action {
      type          = "SetStorageClass"
      storage_class = "ARCHIVE"
    }
  }

  versioning { enabled = true }
}

resource "google_monitoring_notification_channel" "email" {
  display_name = "VibeCursor Alerts"
  type         = "email"
  labels = { email_address = "alerts@vibecursor.app" }
}

resource "google_monitoring_alert_policy" "error_rate" {
  display_name = "${var.app_name} Error Rate"
  combiner     = "OR"

  conditions {
    display_name = "Cloud Run 5xx rate"
    condition_threshold {
      filter          = "resource.type=\"cloud_run_revision\" AND metric.type=\"run.googleapis.com/request_count\""
      comparison      = "COMPARISON_GT"
      threshold_value = 10
      duration        = "300s"
    }
  }

  notification_channels = [google_monitoring_notification_channel.email.id]
}

output "cloud_run_url" { value = google_cloud_run_v2_service.api.uri }
output "sql_connection" { value = google_sql_database_instance.main.connection_name }
output "assets_bucket" { value = google_storage_bucket.assets.name }
