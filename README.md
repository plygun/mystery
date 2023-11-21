# Mystery project :)

## Quick overview
This project contains 2 services: `api` (Symfony 4.4) and `ui` (React/Next.js) all-in-one.

`docker` directory contains scripts to create a containerized environment.

`service` directory contains the source code of the services.

## Setup environment and run the application

### Prerequisites 

Copy the `.env.local.example` to `.env.local` file in `service/api/` directory and fill all sensitive variables.
Copy .env -> .env.local inside `service/ui` directory.
If you need some specific setting to be changed e.g. app, database ports then copy `.env.example` file to `.env` 
in the root directory, where `docker-compose.yml` file is located.

### Run or build the API application
Use the following command in order to start dev server (nginx + php-fpm + mysql + mailcatcher)

```docker-compose up -d api```

For production builds use following command:

```docker-compose -f docker-compose.prod.yml build```

## Debugging emails with MailCatcher
`MAILER_DSN` variable is already set in `service/api/.env` file.

Send emails and then check them by this URL:
```http://localhost:1080```

## Mystery UI

Run `docker-compose up -d ui` and this will bring up all dependent services including `api`.

Open [http://localhost:3000/login](http://localhost:3000/login) with your browser to see the result.
