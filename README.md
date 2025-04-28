### Blog Application

A full-stack blog application with a NestJS backend API, PostgreSQL database, and Next.js frontend. This application allows users to create accounts, publish blog posts, comment on posts, and like comments.

## Tech Stack

### Backend

- NestJS - Node.js framework for building efficient and scalable server-side applications
- TypeORM - ORM for TypeScript and JavaScript
- PostgreSQL - Relational database
- JWT - Authentication
- Swagger - API documentation


### Frontend

- Next.js - React framework for production
- React Query - Data fetching and state management
- Shadcn UI - Component library
- Tailwind CSS - Utility-first CSS framework
- Axios - HTTP client

## DB Diagram

You can view the DB diagram [here](https://dbdiagram.io/e/66c126748b4bb5230e61aac7/680ed3d11ca52373f5918ba0).

## Prerequisites

- [Docker](https://www.docker.com/get-started) and Docker Compose
- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/)


## Project Structure

```plaintext
blog-app/
├── backend/           # NestJS API
│   ├── src/           # Source code
│   ├── Dockerfile     # Docker configuration for backend
    ├── docker-compose.yml # Docker Compose configuration
│   └── ...
├── frontend/          # Next.js frontend
│   ├── app/           # Next.js app directory
│   ├── components/    # React components
│   ├── services/      # API services
│   └── ...
└── README.md          # This file
```

## Getting Started

### Backend Setup

1. Clone the repository:

```shellscript
git clone <repository-url>
cd blog-app
```


2. Create a `.env` file in the root directory with the following content:

```plaintext
PORT=8000
DB_HOST=db
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=postgres
JWT_SECRET=qkwdmqkemgwm123
JWT_EXPIRES_IN=3600s
```


3. Start the backend services using Docker Compose:

```shellscript
docker-compose up -d
```

This will start:

1. PostgreSQL database on port 5432
2. NestJS application on port 8000
3. pgAdmin (PostgreSQL admin interface) on port 5050



4. Access the API at `http://localhost:8000/api`
5. Access Swagger API documentation at `http://localhost:8000/api/docs`
6. Access pgAdmin at `http://localhost:5050` (email: [admin@admin.com](mailto:admin@admin.com), password: pgadmin4)


### Frontend Setup

1. Navigate to the frontend directory:

```shellscript
cd frontend
```


2. Install dependencies:

```shellscript
npm install
```


3. Create a `.env.local` file with the following content:

```plaintext
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```


4. Start the development server:

```shellscript
npm run dev
```


5. Access the frontend at `http://localhost:3000`


## Environment Variables

### Backend (.env)

| Variable | Description | Default
|-----|-----|-----
| PORT | Port for the NestJS application | 8000
| DB_HOST | PostgreSQL host | db
| DB_PORT | PostgreSQL port | 5432
| DB_USERNAME | PostgreSQL username | postgres
| DB_PASSWORD | PostgreSQL password | postgres
| DB_NAME | PostgreSQL database name | postgres
| JWT_SECRET | Secret key for JWT token generation | qkwdmqkemgwm123
| JWT_EXPIRES_IN | JWT token expiration time | 3600s


### Frontend (.env.local)

| Variable | Description | Default
|-----|-----|-----
| NEXT_PUBLIC_API_URL | URL for the backend API | [http://localhost:8000/api](http://localhost:8000/api)


## Docker Configuration

The application uses Docker Compose to orchestrate the following services:

1. **PostgreSQL Database (db)**

1. Image: postgres
2. Port: 5432
3. Volumes: ./pgdata:/var/lib/postgresql/data



2. **NestJS Application (app)**

1. Built from Dockerfile
2. Port: 8000
3. Depends on: db
4. Volumes: .:/app and /app/node_modules



3. **pgAdmin (pgadmin)**

1. Image: dpage/pgadmin4
2. Port: 5050
3. Depends on: db
4. Volumes: ./pgadmin_data:/var/lib/pgadmin





## Running the Application

### Start all backend services

```shellscript
cd backend
docker-compose up -d
```

### View logs

```shellscript
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
```

### Stop all services

```shellscript
docker-compose down
```

### Rebuild services

```shellscript
docker-compose up -d --build
```

## API

For complete API documentation, visit the Swagger UI at `http://localhost:8000/api/docs` after starting the application.

## Frontend Features

- User authentication (login/register)
- Create, edit, and delete blog posts
- Upload images for blog posts
- Comment on posts
- Like comments
- User profile management
- Responsive design


## Development

### Backend Development

If you want to run the NestJS application directly without Docker:

1. Install dependencies:

```shellscript
cd backend
npm install
```


2. Update the `.env` file to use localhost for DB_HOST:

```plaintext
DB_HOST=localhost
```


3. Run the development server:

```shellscript
npm run start:dev
```




### Frontend Development

1. Navigate to the frontend directory:

```shellscript
cd frontend
```


2. Install dependencies:

```shellscript
npm install
```


3. Run the development server:

```shellscript
npm run dev
```




## Troubleshooting

### Database Connection Issues

If the NestJS application can't connect to the database:

1. Ensure PostgreSQL container is running:

```shellscript
docker ps | grep postgres
```


2. Check PostgreSQL logs:

```shellscript
docker-compose logs db
```


3. Verify environment variables in the `.env` file.


### API Connection from Frontend

If the frontend can't connect to the API:

1. Ensure the NestJS application is running:

```shellscript
docker ps | grep blog-app-server
```


2. Check that `NEXT_PUBLIC_API_URL` is set correctly in `.env.local`.
3. Verify that the API is accessible by visiting `http://localhost:8000/api/docs`.


## Example .env Files

### Backend .env

```plaintext
PORT=8000
DB_HOST=db
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=postgres
JWT_SECRET=qkwdmqkemgwm123
JWT_EXPIRES_IN=3600s
```

### Frontend .env.local

```plaintext
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## License

[MIT](LICENSE)

## Contributors

- Your Name - Initial work
