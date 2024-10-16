# Bee3Live
## Setup
- Clone the repository
- Make a .env file based on the provided .env.example file
- Run `docker compose up` to create the database with the credentials provided in .env
- Start the docker container if it is not started
- Run `npm i`
- Run `npx prisma generate`
- Run `npx prisma migrate dev`
- Seed the categories by running `npx prisma db seed`
- Start with `npm run dev`
