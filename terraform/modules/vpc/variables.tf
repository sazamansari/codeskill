variable "name_prefix" {
  description = "Prefix for resources"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
}

variable "azs" {
  description = "List of Availability Zones"
  type        = list(string)
}

variable "public_subnets" {
  description = "List of public subnet CIDR blocks"
  type        = list(string)
}

variable "private_app_subnets" {
  description = "List of private application subnet CIDR blocks"
  type        = list(string)
}

variable "private_db_subnets" {
  description = "List of private database subnet CIDR blocks"
  type        = list(string)
}
