# mongodb.tf

# Configure the MongoDB Atlas provider with our API keys
provider "mongodbatlas" {
  public_key  = var.atlas_public_key
  private_key = var.atlas_private_key
}

# Generate a strong, random password for our database user
resource "random_password" "db_user_password" {
  length  = 16
  special = true
}

# Create a new Project within our MongoDB Atlas Organization
resource "mongodbatlas_project" "mvp_project" {
  name   = "HealthDataMVP"
  org_id = var.atlas_org_id
}

# Replace the serverless instance with a free cluster
resource "mongodbatlas_cluster" "mvp_cluster" {
  project_id = mongodbatlas_project.mvp_project.id
  name       = "mvp-free-cluster"
  
  # Free tier configuration
  provider_name               = "TENANT"
  backing_provider_name       = "AWS"
  provider_region_name        = "US_EAST_1"
  provider_instance_size_name = "M0"
}

# Create a database user for our application
resource "mongodbatlas_database_user" "mvp_user" {
  project_id = mongodbatlas_project.mvp_project.id
  username   = "app_user"
  password   = random_password.db_user_password.result
  auth_database_name = "admin"

  roles {
    role_name     = "readWriteAnyDatabase"
    database_name = "admin"
  }

  depends_on = [mongodbatlas_cluster.mvp_cluster]
}

# Allow network connections to the database
resource "mongodbatlas_project_ip_access_list" "allow_all" {
  project_id = mongodbatlas_project.mvp_project.id
  cidr_block = "0.0.0.0/0"
  comment    = "Allow access from anywhere for MVP development"
}

# Create a proper MongoDB secret with all required fields
resource "aws_secretsmanager_secret" "mongodb_connection" {
  name = "app/mongodb/connection"
}

resource "aws_secretsmanager_secret_version" "mongodb_connection_version" {
  secret_id = aws_secretsmanager_secret.mongodb_connection.id
  
  # Wait for cluster to be fully created before accessing connection strings
  secret_string = jsonencode({
    username = mongodbatlas_database_user.mvp_user.username
    password = random_password.db_user_password.result
    host     = replace(mongodbatlas_cluster.mvp_cluster.connection_strings[0].standard_srv, "mongodb+srv://", "")
    database = "health_data_db"
  })

  depends_on = [
    mongodbatlas_cluster.mvp_cluster,
    mongodbatlas_database_user.mvp_user
  ]
}

# Output the connection details
output "mongodb_connection_details" {
  value = {
    username = mongodbatlas_database_user.mvp_user.username
    host     = replace(mongodbatlas_cluster.mvp_cluster.connection_strings[0].standard_srv, "mongodb+srv://", "")
    database = "health_data_db"
  }
  description = "MongoDB connection details (excluding password)"
  depends_on = [mongodbatlas_cluster.mvp_cluster]
}

output "mongodb_secret_arn" {
  value       = aws_secretsmanager_secret.mongodb_connection.arn
  description = "ARN of the MongoDB connection secret in AWS Secrets Manager"
}