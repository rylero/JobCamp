# Use the Node.js image to run the SvelteKit app
FROM node:22

# Install the Cloud SQL Auth Proxy
ADD https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64 /cloud_sql_proxy
RUN chmod +x /cloud_sql_proxy

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app files
COPY . .

# Generate Prisma Client (ensure this runs after npm install)
RUN npx prisma generate

# Build the SvelteKit app
RUN npm run build

# Expose the port for Cloud Run
EXPOSE 8080

# Set the command to run the app
#CMD ["node", "build/index.js"]
CMD /cloud_sql_proxy --private-ip -instances=deep-voyage-436902-b3:us-central1:svelte-test=tcp:3306 & npm run start
