variable "aws_region" {
  description = "AWS region to deploy infrastructure"
  type        = string
  default     = "ap-south-1"
}

variable "environment" {
  description = "Environment name (e.g., dev, production)"
  type        = string
  default     = "dev"
}
