# Configure the AWS provider to use the specified region
provider "aws" {
  region = var.aws_region
}

# S3 bucket for Terraform state
resource "aws_s3_bucket" "tfstate" {
  bucket = "health-data-mvp-tfstate-bucket-${random_id.bucket_suffix.hex}"

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket_versioning" "tfstate_versioning" {
  bucket = aws_s3_bucket.tfstate.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "random_id" "bucket_suffix" {
  byte_length = 8
}

# Database password secret (legacy - you can remove this later)
resource "aws_secretsmanager_secret" "db_password" {
  name = "app/mongodb/password"
}

resource "aws_secretsmanager_secret_version" "db_password_version" {
  secret_id     = aws_secretsmanager_secret.db_password.id
  secret_string = random_password.db_user_password.result
}