provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "CodeSkill"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}
