# Urukundo Foundation Web Frontend

This is the frontend application for the Urukundo Foundation charity platform, built with [Next.js](https://nextjs.org).

## Getting Started

### Development

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load fonts.

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# API Configuration
NEXT_PUBLIC_API_URL=https://urukundo-production.up.railway.app/api
BACKEND_URL=https://urukundo-production.up.railway.app

# Application Settings
NODE_ENV=production
PORT=3000
```

## Docker Deployment

### Using Docker Compose

The easiest way to run the application is with Docker Compose:

```bash
# Build and start the container
docker-compose up -d

# Stop the container
docker-compose down
```

### Using Docker Directly

```bash
# Build the Docker image
docker build -t urukundo-frontend .

# Run the container
docker run -d -p 3000:3000 --name urukundo-app \
  -e NEXT_PUBLIC_API_URL=https://urukundo-production.up.railway.app/api \
  -e BACKEND_URL=https://urukundo-production.up.railway.app \
  urukundo-frontend
```

### Environment Variables in Docker

When running with Docker, you can pass environment variables:

```bash
docker run -d -p 3000:3000 \
  -e NODE_ENV=production \
  -e NEXT_PUBLIC_API_URL=http://your-backend-api.com/api \
  -e BACKEND_URL=http://your-backend-api.com \
  --name urukundo-app \
  urukundo-frontend
```

## GitHub Actions CI/CD Pipeline

This project includes a GitHub Actions workflow that:
1. Builds the Docker image when code is pushed to the main or prod branch
2. Pushes the image to GitHub Container Registry (ghcr.io)
3. Tags the image appropriately

To use this pipeline:
1. Ensure your repository has the `GITHUB_TOKEN` secret available
2. Push to the main or prod branch to trigger a build

## Container Management

### Check if container is running

```bash
docker ps
```

### View container logs

```bash
docker logs urukundo-app

# Follow logs in real-time
docker logs -f urukundo-app
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.