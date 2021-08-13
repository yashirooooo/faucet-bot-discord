FROM node:current-alpine3.14

# Create splorer-service directory
WORKDIR /usr/src/splorer-service

# Move source files to docker image
COPY . .

# Install dependencies
RUN yarn && yarn build

# Run
ENTRYPOINT yarn start