FROM mcr.microsoft.com/devcontainers/javascript-node:24-bookworm

# Install additional system dependencies

RUN apt-get update && apt-get install -y git curl && rm -rf /var/lib/apt/lists/*

# Set the working directory

WORKDIR /workspace

# Copy package files first to improve Docker layer caching

COPY package.json package-lock.json ./

# Install dependencies

RUN npm ci

# Copy the rest of the project

COPY . .
