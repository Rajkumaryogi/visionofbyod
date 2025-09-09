# versions.tf

terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    mongodbatlas = {
      source  = "mongodb/mongodbatlas"
      version = "~> 1.16"  # This allows newer versions that support nested blocks
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
  }
}