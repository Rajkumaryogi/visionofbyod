# variables.tf

variable "aws_region" {
  description = "The AWS region to deploy resources in."
  type        = string
  default     = "us-east-1"
}

variable "atlas_org_id" {
  description = "The MongoDB Atlas Organization ID."
  type        = string
}

variable "atlas_public_key" {
  description = "The MongoDB Atlas Public API Key."
  type        = string
  sensitive   = true
}

variable "atlas_private_key" {
  description = "The MongoDB Atlas Private API Key."
  type        = string
  sensitive   = true
}