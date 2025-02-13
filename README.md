## Run locally

SETUP PROJECT

```bash
  1. npm install //install all workspace dependencies
  2. npm run run-all-local-installs //install all local dependencies on each app and package
  3. npm run build //build all apps and packages
  4. npm run run-local-db //pull and run a local postgres through docker
  (test credentials should be added to .env DATABASE_URL)
  5. npm run prisma-generate //generate a prisma client
  6. npm run prisma-migrate //push tables in db
  7. npm run prisma-seed //seed placeholder data
```

RUN API

```bash
  npm run api //builds and starts nest js server with --watch
```

RUN CMS

```bash
  npm run cms //start next js server
```
