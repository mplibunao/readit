# Note: You might need to change projects

# Update
gcloud beta run jobs update readit-pg-manager \
	--command="node dist/index.js up" \
	--execute-now \
	--wait

# Execute job
gcloud beta run jobs execute readit-pg-manager \
	--command="node dist/index.js up" \
	--wait
