# Use the official Ubuntu 18.04 LTS as the base image
FROM ubuntu:18.04

# Install necessary dependencies
RUN apt-get update && \
    apt-get install -y curl

# Install Node.js version 12.x.x
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -y nodejs

# Set the working directory in the container
WORKDIR /app

# Copy your files to the working directory
COPY . /app

# Run any necessary build commands or start your application
# For example, if you have a JavaScript file named 'index.js', you can run it like this:
CMD ["node", "index.js"]