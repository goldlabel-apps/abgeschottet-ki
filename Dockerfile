# Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies first for caching
COPY next.js/package*.json ./next.js/
RUN cd next.js && npm install

# Copy the Next.js source
COPY next.js ./next.js

# Expose the custom port
EXPOSE 1975

# Run Next.js dev server
WORKDIR /app/next.js
CMD ["npm", "run", "dev"]
