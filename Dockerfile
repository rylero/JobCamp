# Use the Node.js image to run the SvelteKit app
FROM node:22

# Install the Cloud SQL Auth Proxy
ADD https://storage.googleapis.com/cloud-sql-connectors/cloud-sql-proxy/v2.14.0/cloud-sql-proxy.linux.amd64 /cloud_sql_proxy
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
CMD /cloud_sql_proxy deep-voyage-436902-b3:us-central1:svelte-test --port 3306 --private-ip & npm run start
