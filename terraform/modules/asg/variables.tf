variable "name_prefix" { type = string }
variable "private_app_subnet_ids" { type = list(string) }
variable "target_group_arn" { type = string }
variable "app_security_group_id" { type = string }
variable "instance_type" { type = string }
variable "min_size" { type = number }
variable "max_size" { type = number }
variable "desired_capacity" { type = number }
variable "ami_id" { type = string }
variable "iam_instance_profile_name" { type = string }

