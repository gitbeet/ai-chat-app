# Notes

## Backend

### Initial setup

    - npm init -y - create package.json file
    - npm i express, cors, dotenv , stream-chat , openai - install initial deps
    - npm i -D tsx @types/node @types/express @types/cors - install initial dev deps
    - npx tsx --init - initialize typescript, create a config file
    - modify ts.config for our needs
    - package.json custom scripts (noEmit , --watch ...)

### Server.ts

    - initial express setup (parsers listen , port)
    - /register-user route (create or register user with stream-chat)
    - /chat route

### Setup neon/drizzle

    - npm i drizzle-orm @neondatabase/serverless
    - npm i -D drizzle-kit
    - initialize drizzle with neon (config/database.ts)
    - create the schemas and get select and insert types (db/schema.ts)
    - drizzle.config.ts
    - generate a migration (npx drizzle-kit generate)
    - migrate (npx drizzle-kit migrate)
    - modify /chat and /register-user routes to utilize the database

### Next steps

    - setup a /get-messages route to get the user's chat history
