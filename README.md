# Task Manager Test Project

This project is a simple task manager application built with Astro, Svelte, Tailwind CSS, Prisma and SQLite.

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/) (v6 or later)

## Getting Started

Follow these steps to set up and run the project locally:

### 1. Clone the repository

```sh
git clone https://github.com/nickprudnik/task-manager-test.git
cd task-manager-test
```

### 2. Install dependencies

```sh
npm install
```

### 3. Set up the database

Run the following command to create and migrate the SQLite database:

```sh
npx prisma migrate dev --name init
```

### 4. Generate Prisma Client

Generate the Prisma Client to interact with the database:

```sh
npx prisma generate
```

### 5. Run prisma studio in your terminal.

```sh
npx prisma studio
```

### 6. Run the application

Start the application using the following command:

```sh
npm run dev
```

### 7. Open the application

Open your browser and navigate to http://localhost:4321 to see the application running.