# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=22.5.1

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine as base

# Set working directory for all build stages.
WORKDIR /usr/src/app


################################################################################
# Create a stage for installing production dependecies.
FROM base as development

# Copy the rest of the source files into the image.
COPY . .

# Use production node environment by default.
ENV NODE_ENV development

# Copy package.json so that package manager commands can be used.
COPY package.json .

RUN npm ci

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD npm run dev
