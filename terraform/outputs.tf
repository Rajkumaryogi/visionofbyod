# outputs.tf
output "database_connection_string" {
  value       = mongodbatlas_cluster.mvp_cluster.connection_strings[0].standard_srv
  description = "MongoDB connection string"
  sensitive   = true
}

output "database_username" {
  value       = mongodbatlas_database_user.mvp_user.username
  description = "Database username"
}

output "database_password_secret_arn" {
  value       = aws_secretsmanager_secret.db_password.arn
  description = "AWS Secrets Manager ARN for database password"
}

output "cognito_user_pool_id" {
  value       = aws_cognito_user_pool.app_users.id
  description = "Cognito User Pool ID"
}

output "project_id" {
  value       = mongodbatlas_project.mvp_project.id
  description = "MongoDB Atlas Project ID"
}