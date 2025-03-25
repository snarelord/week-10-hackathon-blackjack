# Blackjack 

A blackjack game built during Week 10 (DevOps Week) at School of Code. This project demonstrates containerization with Docker and error monitoring with Sentry, while implementing a blackjack game with both single-player functionality and in-progress multiplayer capabilities. 

## Project Context

This project was developed as part of the School of Code bootcamp during Week 10, which focused on DevOps practices. The primary goals were to:

- Implement a working application (blackjack game)
- Containerize the application using Docker
- Set up error monitoring with Sentry

## Features

- **Single-player Mode**:
  - Play against the computer dealer
  - Complete implementation with standard blackjack rules
    
- **Online Multiplayer** (In Progress):
  - WebSockets implementation for real-time gameplay
  - Room creation and joining functionality
  - This feature is currently under development
    
- **DevOps Implementation**:
  - Docker containerization for consistent deployment
  - Sentry integration for error tracking and monitoring
  - CI/CD setup for automated testing and deployment
    
- **Game Mechanics**:
  - Standard blackjack rules
  - Hit, stand actions
  - Score tracking
  - Win/loss detection
    
- **Modern UI**:
  - Responsive design works on desktop and mobile
  - Clean, intuitive interface

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API routes
- **Real-time Communication**: Socket.io (in progress)
- **DevOps Tools**:
  - Docker for containerization
  - Sentry for error monitoring
  - GitHub Actions for CI/CD

## Docker Implementation

The application is containerized using Docker, allowing for consistent deployment across different environments. The Docker setup includes:

- Multi-stage builds for optimized image size
- Environment variable configuration
- Production-ready Nginx configuration for serving the application

To run the application using Docker:

```bash
# Build the Docker image
docker build -t blackjack-game .

# Run the container
docker run -p 3001:3001 blackjack-game
