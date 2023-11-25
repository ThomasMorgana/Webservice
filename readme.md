# Webservice

This project contains a simple Express API, allowing for the creation of an account and manipulation of garages and cars.

## Environment Variables

To make this project work, you will need to add environment variables in a .env file at the root of the project. You will find an example in the source files containing the references to be specified.

## API Reference

A Swagger document describing the various routes is accessible at the endpoint /api-docs after launching the project.

## Installation and local

The project is encapsulated in a docker-compose, allowing you to start both the API and the associated databases and monitoring tool.

You can launch the entire project with the command docker compose up.

If you only want to launch the API, here are the main NPM commands:

Install dependencies with npm:

```bash
  npm install
```

Launch BDD seeding with:

```bash
  npm run seed
```

Start the server:

```bash
  npm run start
```

Build the project:

```bash
  npm run build
```

Build and launch the project:

```bash
  npm run dev
```

## Deployment

This project is deployed on GCP. The CI/CD is configured with hooks on the GCP side. They will build, upload and deploy a new version after each a tag containing the keyword "release".

## Project Dependencies

- [@prisma/client](https://ghub.io/@prisma/client): Prisma Client is an auto-generated, type-safe and modern JavaScript/TypeScript ORM for Node.js that&#39;s tailored to your data. Supports PostgreSQL, CockroachDB, MySQL, MariaDB, SQL Server, SQLite &amp; MongoDB databases.
- [@types/bcryptjs](https://ghub.io/@types/bcryptjs): TypeScript definitions for bcryptjs
- [@types/pino](https://ghub.io/@types/pino): Stub TypeScript definitions entry for pino, which provides its own types definitions
- [bcryptjs](https://ghub.io/bcryptjs): Optimized bcrypt in plain JavaScript with zero dependencies. Compatible to &#39;bcrypt&#39;.
- [body-parser](https://ghub.io/body-parser): Node.js body parsing middleware
- [cors](https://ghub.io/cors): Node.js CORS middleware
- [dotenv](https://ghub.io/dotenv): Loads environment variables from .env file
- [express](https://ghub.io/express): Fast, unopinionated, minimalist web framework
- [express-pino-logger](https://ghub.io/express-pino-logger): An express middleware to log with pino
- [express-rate-limit](https://ghub.io/express-rate-limit): Basic IP rate-limiting middleware for Express. Use to limit repeated requests to public APIs and/or endpoints such as password reset.
- [http-status-code](https://ghub.io/http-status-code): Easy access to HTTP Status Codes
- [http-status-codes](https://ghub.io/http-status-codes): Constants enumerating the HTTP status codes. Based on the Java Apache HttpStatus API.
- [jsonwebtoken](https://ghub.io/jsonwebtoken): JSON Web Token implementation (symmetric and asymmetric)
- [pino](https://ghub.io/pino): super fast, all natural json logger
- [prom-client](https://ghub.io/prom-client): Client for prometheus
- [stripe](https://ghub.io/stripe): Stripe API wrapper

## Dev Dependencies

- [@commitlint/cli](https://ghub.io/@commitlint/cli): Lint your commit messages
- [@commitlint/config-conventional](https://ghub.io/@commitlint/config-conventional): Shareable commitlint config enforcing conventional commits
- [@faker-js/faker](https://ghub.io/@faker-js/faker): Generate massive amounts of fake contextual data
- [@types/cors](https://ghub.io/@types/cors): TypeScript definitions for cors
- [@types/express](https://ghub.io/@types/express): TypeScript definitions for Express
- [@types/express-pino-logger](https://ghub.io/@types/express-pino-logger): TypeScript definitions for express-pino-logger
- [@types/jest](https://ghub.io/@types/jest): TypeScript definitions for jest
- [@types/jsonwebtoken](https://ghub.io/@types/jsonwebtoken): TypeScript definitions for jsonwebtoken
- [@types/node](https://ghub.io/@types/node): TypeScript definitions for Node.js
- [@types/supertest](https://ghub.io/@types/supertest): TypeScript definitions for supertest
- [@typescript-eslint/eslint-plugin](https://ghub.io/@typescript-eslint/eslint-plugin): TypeScript plugin for ESLint
- [@typescript-eslint/parser](https://ghub.io/@typescript-eslint/parser): An ESLint custom parser which leverages TypeScript ESTree
- [eslint](https://ghub.io/eslint): An AST-based pattern checker for JavaScript.
- [eslint-config-prettier](https://ghub.io/eslint-config-prettier): Turns off all rules that are unnecessary or might conflict with Prettier.
- [eslint-plugin-jest](https://ghub.io/eslint-plugin-jest): ESLint rules for Jest
- [eslint-plugin-prettier](https://ghub.io/eslint-plugin-prettier): Runs prettier as an eslint rule
- [husky](https://ghub.io/husky): Modern native Git hooks made easy
- [jest](https://ghub.io/jest): Delightful JavaScript Testing.
- [nodemon](https://ghub.io/nodemon): Simple monitor script for use during development of a Node.js app.
- [pino-pretty](https://ghub.io/pino-pretty): Prettifier for Pino log lines
- [prettier](https://ghub.io/prettier): Prettier is an opinionated code formatter
- [prisma](https://ghub.io/prisma): Prisma is an open-source database toolkit. It includes a JavaScript/TypeScript ORM for Node.js, migrations and a modern GUI to view and edit the data in your database. You can use Prisma in new projects or add it to an existing one.
- [ts-jest](https://ghub.io/ts-jest): A Jest transformer with source map support that lets you use Jest to test projects written in TypeScript
- [ts-node](https://ghub.io/ts-node): TypeScript execution environment and REPL for node.js, with source map support
- [typescript](https://ghub.io/typescript): TypeScript is a language for application scale JavaScript development
- [validate-branch-name](https://ghub.io/validate-branch-name): Git branch name validator

## Support

Si vous avez des questions, thomas@codebuds.com.
