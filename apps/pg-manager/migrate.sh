#!/bin/bash

STAGING_PROJECT_ID="prj-s-readit-a2b9"
PRODUCTION_PROJECT_ID="prj-p-readit-5ae4"
REGION="asia-southeast1"
JOB="readit-pg-manager"

# Check if gcloud command is installed
which gcloud &>/dev/null
if [ $? -ne 0 ]; then
  echo "gcloud command not found, please install gcloud sdk and run the script again"
  exit 1
fi

# Get environment from command line arguments
ENV=$1

# Check if environment is provided and if it's valid
if [ -z "$ENV" ] || [ "$ENV" != "staging" ] && [ "$ENV" != "production" ]; then
  echo "Please provide a valid environment (staging or production)"
  echo "Correct Usage: ./migrate.sh [ENV] [COMMAND]"
  exit 1
fi

# Set default command
COMMAND=""

# Use provided command if provided
if [ ! -z "$2" ]; then
  COMMAND=$2
fi

# Set project and region based on environment
if [ "$ENV" = "staging" ]; then
  PROJECT_ID=$STAGING_PROJECT_ID
else
  PROJECT_ID=$PRODUCTION_PROJECT_ID
fi

# Check if job exist 
gcloud beta run jobs describe $JOB --project=$PROJECT_ID --region=$REGION &> /dev/null
if [ $? -ne 0 ]; then
    echo "Job $JOB does not exist, please create it first before running the script again"
    exit 1
fi

gcloud beta run jobs update $JOB \
  --project=$PROJECT_ID \
  --region=$REGION \
	--command="$COMMAND" \

gcloud beta run jobs execute $JOB \
  --project="$PROJECT_ID" \
  --region=$REGION \
	--wait

