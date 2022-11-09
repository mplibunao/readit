terraform {
  backend "gcs" {
    bucket = "bucket-b-tfstate-3822"
    prefix = "terraform/projects/readit/project_folder"
  }
}
