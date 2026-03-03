FROM node:20-alpine

WORKDIR /app

# Install dependencies first for better layer caching
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the client and server
RUN npm run build

# Set the Node environment to production
ENV NODE_ENV=production
ENV PORT=3050

# Expose the port the app runs on
EXPOSE 3050

# Start the application
CMD ["npm", "run", "start"]
