# Notes Management Application

## Overview

This project is a web application designed for managing notes. It includes features for creating, editing, deleting, archiving, and tagging notes. Both the frontend and backend components are developed using modern web technologies. The frontend is built with React, and the backend is powered by NestJS.

## Features

Here are some of the things you can do with this application:

1. **Add New Notes**: Create new notes using the button located at the bottom right of the interface.
2. **Delete Notes**: Permanently remove any note from the system.
3. **Edit Notes**: Modify the text and/or title of any note.
4. **Archive/Unarchive Notes**: Archive notes to keep them out of sight or unarchive them to bring them back to the active list.
5. **Tag Notes**: Assign one or more tags to any note for better organization.
6. **Delete Tags**: Remove any tag from the system.
7. **Filter Notes**: Filter notes based on their archived/unarchived status.
8. **Filter by Tags**: Filter notes according to their assigned tags.
9. **Log Out**: End your session when finished. Note that sessions last for 1 hour.

## Prerequisites

Ensure you have the following installed on your machine:

- **Node.js**: Version 18.x or later
- **npm**: Version 8.x or later (comes with Node.js)
- **NestJS CLI**: Version 10.x or later (for running the backend)

## Installation

### Clone the Repository

First, clone the repository:

\`\`\`bash
git clone https://github.com/ensolvers-github-challenges/Bran-7a0416.git
cd Bran-7a0416
\`\`\`

### Fast setup

#### 1 Command line

Navigate to root directory:

\`\`\`bash
./setup.sh
\`\`\`

### Normal Setup

#### Backend

1. Navigate to the \`backend\` directory:

   \`\`\`bash
   cd backend
   \`\`\`

2. Install the backend dependencies:

   \`\`\`bash
   npm install
   \`\`\`

#### Frontend

1. Navigate to the \`frontend\` directory:

   \`\`\`bash
   cd ../frontend
   \`\`\`

2. Install the frontend dependencies:

   \`\`\`bash
   npm install
   \`\`\`

## Running the Application

### Start the Backend

1. Navigate to the \`backend\` directory:

   \`\`\`bash
   cd backend
   \`\`\`

2. Start the backend server:

   \`\`\`bash
   nest start
   \`\`\`

### Start the Frontend

1. Navigate to the \`frontend\` directory:

   \`\`\`bash
   cd ../frontend
   \`\`\`

2. Start the frontend server:

   \`\`\`bash
   npm start
   \`\`\`

## Access the Application

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend**: [http://localhost:3001](http://localhost:3001)

## Stopping the Servers

To stop the servers, use the following commands in separate terminal windows:

### Stop the Backend

\`\`\`bash
pkill -f 'nest start'
\`\`\`

### Stop the Frontend

\`\`\`bash
pkill -f 'npm start'
\`\`\`

## Tools and Versions

- **Node.js**: 18.x
- **npm**: 8.x
- **NestJS**: 10.x
- **React**: 18.x

EOL
