#!/bin/bash

# Define the image name
IMAGE_NAME=digicomoffer
CONTAINER_NAME=digicomoffer

# Stop and remove any running container with the same name
docker ps -q -f name=$CONTAINER_NAME | xargs -I {} docker stop {}
docker ps -a -q -f name=$CONTAINER_NAME | xargs -I {} docker rm {}

# Remove old image if it exists
docker images -q $IMAGE_NAME | xargs -I {} docker rmi -f {}

# Build the Docker image
docker build -t $IMAGE_NAME .

# Run the Docker container in port 3000
docker run -d -p 3000:3000 --name $CONTAINER_NAME $IMAGE_NAME
