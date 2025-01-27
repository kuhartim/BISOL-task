# Use a stable Node.js LTS version
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml* ./

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Build the app
RUN pnpm run build

# Expose the port
EXPOSE 4000

# Command to run the app
CMD ["pnpm", "start"]