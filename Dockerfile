FROM node:current-alpine3.14

WORKDIR /usr/src/faucet-bot

# Move source files to docker image
COPY . .

# Install dependencies
RUN yarn && yarn build

# Run
ENTRYPOINT yarn start