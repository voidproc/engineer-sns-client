FROM node:14-slim
WORKDIR /app
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin
ENV HOST 0.0.0.0
