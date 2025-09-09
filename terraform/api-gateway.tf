# API Gateway
resource "aws_api_gateway_rest_api" "health_api" {
  name        = "health-data-api"
  description = "API for Health Data MVP"
}

resource "aws_api_gateway_resource" "observations" {
  rest_api_id = aws_api_gateway_rest_api.health_api.id
  parent_id   = aws_api_gateway_rest_api.health_api.root_resource_id
  path_part   = "observations"
}

resource "aws_api_gateway_method" "get_observations" {
  rest_api_id   = aws_api_gateway_rest_api.health_api.id
  resource_id   = aws_api_gateway_resource.observations.id
  http_method   = "GET"
  authorization = "NONE" # Change to COGNITO_USER_POOLS later
  # authorizer_id = aws_api_gateway_authorizer.cognito.id
}

resource "aws_api_gateway_integration" "get_observations_integration" {
  rest_api_id = aws_api_gateway_rest_api.health_api.id
  resource_id = aws_api_gateway_resource.observations.id
  http_method = aws_api_gateway_method.get_observations.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.fetch_observations.invoke_arn
}

# Cognito Authorizer (commented out for now)
# resource "aws_api_gateway_authorizer" "cognito" {
#   name          = "cognito-authorizer"
#   rest_api_id   = aws_api_gateway_rest_api.health_api.id
#   type          = "COGNITO_USER_POOLS"
#   provider_arns = [aws_cognito_user_pool.app_users.arn]
# }