Hi Guys,
Regards Ryan Andrie Coretico very handsome
test comm
***

BACKEND:
  - Run Server
    - cd backend
    - npm install
    - npm run dev
  - Build Project
    - cd backend
    - npm run build

DATABASE:
- Uses drizzle orm: https://neon.com/
- npm run db:generate //generates/writes postgreSql migration file
- npm run db:migrate //migrate the generated postgre files

CLOUDINARY:
- Get credentials at https://cloudinary.com/
- Provide environment variables found in the project env example file

ENV:
- Found in the example env file, the following empty variables are the environment variables being used in the backend.
- Fill them up with your local or production credentials to ensure the backend connects properly to your database and services.

