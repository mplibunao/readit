variable "project_name" {
  description = "Name of the project/app. Will be used for both the folder and project name"
  type        = string
}

variable "remote_state_bucket" {
  description = "Backend bucket to load Terraform Remote State Data from previous steps."
  type        = string
}
