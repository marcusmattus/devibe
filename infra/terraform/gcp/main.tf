terraform {
  required_version = ">= 1.5"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.gcp_project_id
  region  = var.gcp_region
}

variable "gcp_project_id" {
  type = string
}

variable "gcp_region" {
  default = "us-central1"
}

variable "app_name" {
  default = "vibecursor-app"
}

variable "environment" {
  default = "production"
}

# Cloud Run with auto-scaling (100k+ users)
resource "google_cloud_run_v2_service" "api" {
  name     = "${var.app_name}-api"
  location = var.gcp_region

  template {
    scaling {
      min_instance_count = 2
      max_instance_count = 100
    }

    containers {
      image = "gcr.io/${var.gcp_project_id}/${var.app_name}-api:latest"

      resources {
        limits = {
          cpu    = "2"
          memory = "1Gi"
        }
      }

      env {
        name  = "DATABASE_URL"
        value = "postgresql://${google_sql_user.main.name}:${var.db_password}@/${google_sql_database.main.name}?host=/cloudsql/${google_sql_database_instance.main.connection_name}"
      }

      env {
        name  = "GCS_BUCKET"
        value = google_storage_bucket.assets.name
      }
    }

    vpc_access {
      connector = google_vpc_access_connector.main.id
      egress    = "PRIVATE_RANGES_ONLY"
    }
  }

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }
}

# Cloud SQL PostgreSQL with HA
resource "google_sql_database_instance" "main" {
  name             = "${var.app_name}-db"
  database_version = "POSTGRES_15"
  region           = var.gcp_region

  settings {
    tier              = "db-custom-2-8192"
    availability_type = "REGIONAL"
    disk_autoresize   = true
    disk_size         = 100

    backup_configuration {
      enabled                        = true
      point_in_time_recovery_enabled = true
      start_time                     = "03:00"
    }

    ip_configuration {
      ipv4_enabled    = false
      private_network = google_compute_network.main.id
    }

    insights_config {
      query_insights_enabled = true
    }
  }

  deletion_protection = true
}

resource "google_sql_database" "main" {
  name     = "vibecursor"
  instance = google_sql_database_instance.main.name
}

resource "google_sql_user" "main" {
  name     = "admin"
  instance = google_sql_database_instance.main.name
  password = var.db_password
}

variable "db_password" {
  type      = string
  sensitive = true
}

# GCS storage with lifecycle rules
resource "google_storage_bucket" "assets" {
  name          = "${var.gcp_project_id}-${var.app_name}-assets"
  location      = var.gcp_region
  force_destroy = false

  versioning {
    enabled = true
  }

  lifecycle_rule {
    condition {
      age = 90
    }
    action {
      type          = "SetStorageClass"
      storage_class = "NEARLINE"
    }
  }

  lifecycle_rule {
    condition {
      age = 365
    }
    action {
      type          = "SetStorageClass"
      storage_class = "COLDLINE"
    }
  }
}

# CDN via Cloud CDN + Load Balancer
resource "google_compute_backend_bucket" "cdn" {
  name        = "${var.app_name}-cdn-backend"
  bucket_name = google_storage_bucket.assets.name
  enable_cdn  = true
}

# VPC Network
resource "google_compute_network" "main" {
  name                    = "${var.app_name}-vpc"
  auto_create_subnetworks = false
}

resource "google_vpc_access_connector" "main" {
  name          = "${var.app_name}-connector"
  region        = var.gcp_region
  network       = google_compute_network.main.name
  ip_cidr_range = "10.8.0.0/28"
  min_instances = 2
  max_instances = 10
}

# Stackdriver monitoring alerts
resource "google_monitoring_alert_policy" "error_rate" {
  display_name = "${var.app_name} Error Rate"
  combiner     = "OR"

  conditions {
    display_name = "Cloud Run error rate"

    condition_threshold {
      filter          = "resource.type = \"cloud_run_revision\" AND metric.type = \"run.googleapis.com/request_count\" AND metric.label.response_code_class = \"5xx\""
      duration        = "300s"
      comparison      = "COMPARISON_GT"
      threshold_value = 10

      aggregations {
        alignment_period   = "60s"
        per_series_aligner = "ALIGN_RATE"
      }
    }
  }

  notification_channels = []
}

output "cloud_run_url" {
  value = google_cloud_run_v2_service.api.uri
}

output "database_connection" {
  value = google_sql_database_instance.main.connection_name
}

output "storage_bucket" {
  value = google_storage_bucket.assets.name
}
