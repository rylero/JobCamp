FROM node:22-bookworm-slim AS build
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN apt-get update -y
RUN apt-get install -y openssl

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package.json .
COPY pnpm-lock.yaml .
COPY tsconfig.json .
COPY svelte.config.js .
COPY vite.config.ts .

# Install dependencies
RUN pnpm install

# Copy the rest of the app files
COPY . .

# Generate Prisma Client (ensure this runs after npm install)
RUN npx prisma generate

# Build the SvelteKit app
RUN pnpm run build

# Expose the port for Cloud Run
ENV PORT 34040
EXPOSE 34040

# Set the command to run the app
CMD npx prisma db push; pnpm run start
