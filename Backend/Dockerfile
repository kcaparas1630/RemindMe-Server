FROM node:20.16.0

WORKDIR /app/

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm install

# Create logs directory with correct permissions
RUN mkdir -p /app/logs

# Copy the rest of the application
COPY . ./

# Generate prisma schema
RUN npx prisma generate 

# Build the application
RUN npm run build


# Set up user and permissions
RUN groupadd -r backendgroup && \
    useradd -r -g backendgroup -m backenduser && \
    chown -R backenduser:backendgroup /app && \
    chmod 755 /app && \
    chmod 755 /app/logs

LABEL maintainer="Kent Caparas<kentcaparas12@gmail.com>"
LABEL description="Docker image to run Task command line backend"
LABEL version="1.0"

USER backenduser

CMD ["npm", "run", "serve", "--no-update-notifier", "--max-old-space-size=50"]
