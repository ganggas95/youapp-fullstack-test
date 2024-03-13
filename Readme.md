## Fullstack Test Assessment

## Backend Side

### Setup Environment

Before running the backend side, you need to install dependencies and setup the environment.

Please populate the `.env` file with your database credentials and another environment variable for development and production environtment and for testing populate the `env.test` file.

### Installation

```bash
$ cd backend
$ yarn install
```

### Running Using Docker

```bash
$ cd backend
$ docker compose build
$ docker compose up
```

### Running Tests

#### Running Unit-test

```bash
$ cd backend
$ yarn test:watch
```

#### Running Unit-test with coverage

```bash
$ cd backend
$ yarn test:cov
```

#### Running e2e / integration test

```bash
$ cd backend
$ yarn test:e2e:watch
```

## Frontend Side

### Setup Environment

Before running the frontend side, you need to install dependencies and setup the environment.

Please populate the `.env` file with your environment variable based on backend environment.

### Installation

```bash
$ cd frontend
$ yarn install
```

### Running for development
Before running the frontend side, you need to build the project first.

```bash
$ cd frontend
$ yarn build
$ yarn dev
```

### Build for production

```bash
$ cd frontend
$ NODE_ENV=production && yarn build
```

## Credit
This project is based on the [Next.js](https://nextjs.org/) framework at Front-end and the [Nest.js](https://nestjs.com/) framework at Backend. Developed by [Subhan Nizar](https://github.com/ganggas95) for Fullstack Developer Test Assessment project at **YouApp**.