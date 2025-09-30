# Urukundo Foundation Frontend - Docker Image

This repository contains the Docker image for the Urukundo Foundation charity platform frontend application.

## 🚀 Quick Start

### Prerequisites

- Docker installed on your system
- Port 3000 available (or specify a different port)

### Running the Application

#### Option 1: Load from saved image file

If you received the Docker image as a tar file:

```bash
# Load the image from file
docker load -i urukundo-frontend-updated.tar

# Run the container
docker run -d -p 3000:3000 --name urukundo-app urukundo-frontend-updated
```

#### Option 2: If you have the image already

```bash
# Run the container
docker run -d -p 3000:3000 --name urukundo-app urukundo-frontend-updated
```

### Access the Application

Once running, open your web browser and navigate to:

```bash

http://localhost:3000
```

## 📋 Container Management

### Check if container is running

```bash
docker ps
```

### Stop the container

```bash
docker stop urukundo-app
```

### Start an existing container

```bash
docker start urukundo-app
```

### Remove the container

```bash
docker rm urukundo-app
```

### View container logs

```bash
docker logs urukundo-app
```

### View real-time logs

```bash
docker logs -f urukundo-app
```

## 🔧 Configuration Options

### Custom Port

If port 3000 is already in use, you can run on a different port:

```bash

docker run -d -p 8080:3000 --name urukundo-app urukundo-frontend-updated
```

Then access via `https://urukundo-production.up.railway.app`

### Environment Variables

You can pass environment variables to the container:

```bash
docker run -d -p 3000:3000 \
  -e NODE_ENV=production \
  -e API_URL=http://your-backend-api.com \
  --name urukundo-app \
  urukundo-frontend-updated
```

### Volume Mounting (Optional)

To persist data or override configuration:

```bash
docker run -d -p 3000:3000 \
  -v /path/to/your/config:/app/config \
  --name urukundo-app \
  urukundo-frontend-updated
```

## 🏗️ Building from Source

If you want to build the image yourself:

```bash
# Clone the repository
git clone https://github.com/EchoSols/Urukundo-Foundation-fro.git
cd Urukundo-Foundation-fro/frontend

# Build the Docker image
docker build -t urukundo-frontend-updated .

# Run the container
docker run -d -p 3000:3000 --name urukundo-app urukundo-frontend-updated
```

## 🌐 Application Features

### User Dashboard

- **Clean Interface**: No mock data - displays real user data
- **Donation Tracking**: View your donation history and impact
- **Event Management**: Browse upcoming charity events
- **Video Gallery**: Watch impact stories and updates
- **Real-time Updates**: Live donation statistics

### Key Pages

- **Homepage** (`/`): Main landing page with foundation information
- **Dashboard** (`/dashboard`): User dashboard with personalized data
- **Donations** (`/donation`): Make donations to various causes
- **Events** (`/events`): Browse and register for events
- **Login/Signup** (`/login`, `/signup`): User authentication

## 🔐 Authentication

The application includes user authentication:

- Sign up for new accounts
- Login with existing credentials
- Protected routes for authenticated users
- Secure session management

## 📱 Responsive Design

The application is fully responsive and works on:

- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes

## 🛠️ Troubleshooting

### Container won't start

```bash
# Check Docker is running
docker --version

# Check if port is available
netstat -an | findstr :3000
```

### Application not accessible

1. Verify container is running: `docker ps`
2. Check port mapping is correct
3. Ensure firewall isn't blocking port 3000
4. Try accessing via `http://127.0.0.1:3000`

### Performance issues

```bash
# Check container resource usage
docker stats urukundo-app

# Restart the container
docker restart urukundo-app
```

### View detailed logs

```bash
# Get last 100 log lines
docker logs --tail 100 urukundo-app

# Follow logs in real-time
docker logs -f urukundo-app
```

## 📦 Image Details

- **Base Image**: Node.js 20 Alpine
- **Application**: Next.js 15.5.0
- **Port**: 3000 (internal)
- **User**: Non-root user (nextjs:1001)
- **Architecture**: Multi-stage build for optimized size

## 🔄 Updates

To update to a newer version:

1. Stop and remove the current container:

   ```bash
   docker stop urukundo-app
   docker rm urukundo-app
   ```

2. Remove the old image (optional):

   ```bash
   docker rmi urukundo-frontend-updated
   ```

3. Load the new image and run:
   ```bash
   docker load -i new-urukundo-frontend.tar
   docker run -d -p 3000:3000 --name urukundo-app urukundo-frontend-updated
   ```

## 🆘 Support

For issues or questions:

1. Check the troubleshooting section above
2. View container logs for error details
3. Ensure all prerequisites are met
4. Contact the development team with specific error messages

## 📝 Notes

- The application has been optimized to remove mock data and display real information
- All font loading issues have been resolved for reliable Docker builds
- The image uses system fonts with good fallbacks for consistent appearance
- Production-ready with optimized builds and security configurations

---

**Urukundo Foundation** - Share Love, Save Lives ❤️
