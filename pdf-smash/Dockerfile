FROM node:20-alpine

# Install tesseract binary (for OCR) and any needed libs
RUN apk add --no-cache tesseract-ocr

WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Expose port for the service
EXPOSE 5000

# Start the service
CMD ["node", "index.js"]
