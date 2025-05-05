FROM node:20.16.0-alpine

WORKDIR /app/

# Copy package files for dependencies
COPY package*.json ./

# Install ALL dependencies including dev dependencies
RUN npm install && \
    # Create logs directory
    mkdir -p /app/logs

# Copy application code
COPY . ./

# Generate prisma client
RUN npx prisma generate

RUN npm run build

# Set environment variables
ENV NODE_ENV=development

# Use nodemon or ts-node-dev for hot reloading during development
CMD ["npm", "run", "dev"]