terraform {
  required_version = "~> 1.10.3"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.49.0"
    }
  }
  backend "s3" {
    bucket         = "twitter-clone-infrastructure"
    region         = "us-east-1"
    key            = "eks/terraform.tfstate"
    dynamodb_table = "terraform-state-locking"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region
}
