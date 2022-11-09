plugin "google" {
    enabled = true
    version = "0.21.0"
    source  = "github.com/terraform-linters/tflint-ruleset-google"
}

plugin "terraform" {
    enabled = true
    preset = "recommended"
}
