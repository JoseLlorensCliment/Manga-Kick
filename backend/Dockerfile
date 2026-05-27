FROM node:20-alpine

WORKDIR /app

# Copy dependency files first for efficient caching
COPY package*.json ./
RUN npm install --omit=dev

# Copy the rest of the application files
COPY . .

# Expose backend port
EXPOSE 5000

ENV PORT=5000

# Start server
CMD ["node", "server.js"]
