# ---- Base Node image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Build Next.js
RUN npm run build

# Expose the port your Next app uses
EXPOSE 1975

# Run the Next.js server
CMD ["npm", "run", "start"]
