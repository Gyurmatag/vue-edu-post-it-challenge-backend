# Use the official Node.js 16 image.
# https://hub.docker.com/_/node
FROM node:16-alpine

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./

# Install production dependencies.
RUN npm install --production

# Copy local code to the container image.
COPY . .

# Bind the Express server to port 3000.
EXPOSE 3000

# Run the web service on container startup.
CMD [ "node", "server.js" ]
