
locals {
  #org_id          = data.terraform_remote_state.bootstrap.outputs.common_config.org_id
  #parent_folder   = data.terraform_remote_state.bootstrap.outputs.common_config.parent_folder
  parent = data.terraform_remote_state.bootstrap.outputs.common_config.parent_id
  #billing_account = data.terraform_remote_state.bootstrap.outputs.common_config.billing_account
  #default_region  = data.terraform_remote_state.bootstrap.outputs.common_config.default_region
  #project_prefix  = data.terraform_remote_state.bootstrap.outputs.common_config.project_prefix
  folder_prefix = data.terraform_remote_state.bootstrap.outputs.common_config.folder_prefix
}

resource "google_folder" "project" {
  display_name = "${locals.folder_prefix}-${var.project_name}"
  parent       = local.parent
}

data "terraform_remote_state" "bootstrap" {
  backend = "gcs"

  config = {
    bucket = var.remote_state_bucket
    prefix = "terraform/bootstrap/state"
  }
}

data "terraform_remote_state" "org" {
  backend = "gcs"

  config = {
    bucket = var.remote_state_bucket
    prefix = "terraform/org/state"
  }
}
