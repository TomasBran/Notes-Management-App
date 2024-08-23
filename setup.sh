#!/bin/bash

# This script sets up and runs the application

echo "Setting up the environment..."

# Configure backend
echo "Configuring the backend..."
cd backend
npm install

# Configure frontend
echo "Configuring the frontend..."
cd ../frontend
npm install

# Go back to the root of the project
cd ..

echo "Running the backend..."
# Run the backend in the background
cd backend
nest start &

echo "Running the frontend..."
# Run the frontend in the background
cd ../frontend
npm start &

echo "The application is running. Access it at http://localhost:3000 for the frontend and http://localhost:3001 for the backend."
