variable "aws_region" {
  type    = string
  default = "us-east-1"
}
variable "vpc_cidr" {
  type    = string
  default = "10.0.0.0/16"
}
variable "azs" {
  type    = list(string)
  default = ["us-east-1a", "us-east-1b"]
}
variable "public_subnets" {
  type    = list(string)
  default = ["10.0.1.0/24", "10.0.2.0/24"]
}
variable "private_app_subnets" {
  type    = list(string)
  default = ["10.0.10.0/24", "10.0.11.0/24"]
}
variable "private_db_subnets" {
  type    = list(string)
  default = ["10.0.20.0/24", "10.0.21.0/24"]
}
variable "ami_id" {
  type    = string
  default = "ami-03c3da4cfa8e8943a" # Valid Amazon Linux 2023 AMI in us-east-1
}
variable "db_name" {
  type    = string
  default = "codeskill"
}
variable "db_username" {
  type    = string
  default = "postgres"
}
variable "db_password" {
  type      = string
  sensitive = true
}
