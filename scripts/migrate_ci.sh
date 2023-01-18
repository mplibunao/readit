#!/bin/bash

# Get project ID, region, and job name from environment variables
PROJECT_ID="$1"
REGION="$2"
JOB_NAME="$3"

# Check if gcloud command is installed
which gcloud &>/dev/null
if [ $? -ne 0 ]; then
  echo "gcloud command not found, please install gcloud sdk and run the script again"
  exit 1
fi

# Check if project ID is provided and if it's valid
if [ -z "$PROJECT_ID" ] || ! [[ "$PROJECT_ID" =~ ^[a-z0-9-]+$ ]]; then
  echo "Please provide a valid project ID"
  echo "Usage: $0 <project_id> <region> <job_name> [up|down|redo|latest]"
  exit 1
fi

# Check if job name is provided and if it's valid
if [ -z "$JOB_NAME" ] || ! [[ "$JOB_NAME" =~ ^[a-z0-9-]+$ ]]; then
  echo "Please provide a valid job name"
  echo "Usage: $0 <project_id> <region> <job_name> [up|down|redo|latest]"
  exit 1
fi

# Set default command
COMMAND=""

# Use provided command if provided
if [ ! -z "$4" ]; then
  case $4 in 
    "up")
      COMMAND="node dist/index.js up"
      ;;
    "down")
      COMMAND="node dist/index.js down"
      ;;
    "redo")
      COMMAND="node dist/index.js redo"
      ;;
    "latest")
      COMMAND="node dist/index.js latest"
      ;;
    *)
      echo "Invalid command, please choose one of the following commands: up, down, redo, latest"
			echo "Usage: $0 <project_id> <region> <job_name> [up|down|redo|latest]"
      exit 1
  esac
fi

# Check if job exist 
gcloud beta run jobs describe "$JOB_NAME" --project="$PROJECT_ID" --region="$REGION" &> /dev/null
if [ $? -ne 0 ]; then
    echo "Job $JOB_NAME does not exist, please create it first before running the script again"
    exit 1
fi

gcloud beta run jobs update "$JOB_NAME" \
  --project="$PROJECT_ID" \
  --region="$REGION" \
  --command="$COMMAND" \

gcloud beta run jobs execute "$JOB_NAME" \
  --project="$PROJECT_ID" \
  --region="$REGION" \
  --wait
