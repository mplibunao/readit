
locals {
  parent        = data.terraform_remote_state.bootstrap.outputs.common_config.parent_id
  folder_prefix = data.terraform_remote_state.bootstrap.outputs.common_config.folder_prefix
}

resource "google_folder" "project" {
  display_name = "${local.folder_prefix}-${var.project_name}"
  parent       = local.parent
}

data "terraform_remote_state" "bootstrap" {
  backend = "gcs"

  config = {
    bucket = var.remote_state_bucket
    prefix = "terraform/bootstrap/state"
  }
}
