# Use an official Node.js image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Build the Next.js app
RUN npm run build

# Expose port 3000 (default for Next.js)
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]





