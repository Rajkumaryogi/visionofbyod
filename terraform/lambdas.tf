# Create the ZIP files first

# MongoDB Utils Layer
# terraform/lambdas.tf

# MongoDB Utils Layer
resource "aws_lambda_layer_version" "mongodb_utils" {
  filename            = "${path.module}/../layers/mongodb-utils.zip"
  layer_name          = "mongodb-utils"
  compatible_runtimes = ["nodejs18.x"]
  
  # Use fixed dummy hash - will be updated on next apply after building
  source_code_hash = "dummy-initial-hash-12345"
}

# Lambda function for fetching observations
resource "aws_lambda_function" "fetch_observations" {
  filename         = "${path.module}/../functions/observations/fetch-observations-api.zip"
  function_name    = "fetch-observations-api"
  role             = aws_iam_role.lambda_exec.arn
  handler          = "index.handler"
  runtime          = "nodejs18.x"
  timeout          = 30
  layers           = [aws_lambda_layer_version.mongodb_utils.arn]

  environment {
    variables = {
      MONGODB_SECRET_ARN = aws_secretsmanager_secret.mongodb_connection.arn
      NODE_ENV           = "production"
    }
  }

  # Use fixed dummy hash - will be updated on next apply after building
  source_code_hash = "dummy-initial-hash-12345"
}

# Add other Lambda functions here (cognito-post-confirmation, cognito-pre-token-trigger, etc.)
# They should follow the same pattern as fetch_observations