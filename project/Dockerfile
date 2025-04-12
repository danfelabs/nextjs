# Step 1: Use the official Node.js image as the base image
FROM node:22-alpine

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json for dependencies
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the entire Next.js project into the container
COPY . .

# Step 6: Build the Next.js app
RUN npm run build

# Step 7: Expose port 3000 for the Next.js app
EXPOSE 3000

# Step 8: Start the Next.js app in production mode
CMD ["npm", "start"]
