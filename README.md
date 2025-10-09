# Kube Credential Microservices

This project consists of two microservices, an `issuance-service` and a `verification-service`, designed to issue and verify digital credentials. The entire application is containerized using Docker and is ready for deployment on Kubernetes.

---

## Project Structure

The project is structured as a monorepo with the two services located in the `packages` directory.
kube-credential-fsd/
├── docker-compose.yml
├── README.md
└── packages/
...├── issuance-service/
...└── verification-service/

---

## Prerequisites

- Docker
- Docker Compose
- Node.js (for local development outside of Docker)
- Postman (for testing the API endpoints)

---

## Docker & Docker Compose Setup

The entire application is managed by Docker Compose for easy local development.

- **`Dockerfile`**: Each service in the `packages` directory has its own multi-stage `Dockerfile` to create an optimized and lightweight production image.
- **`docker-compose.yml`**: The root `docker-compose.yml` file orchestrates the building and running of both microservices.
- **Shared Volume**: A named Docker volume, `credential_data`, is used to persist the `credentials.json` database and enable data sharing between the two services.

---

## Running the Application Locally

The entire application can be started with a single command from the project's root directory.

1.  **Build and Start the Services:**

    **bash**
    docker-compose up --build

    This command will build the Docker images for both services and run them.

2.  **API Endpoints:**
    - **Issuance Service:** is available at `http://localhost:4001`
    - **Verification Service:** is available at `http://localhost:4002`

---

## API Usage

### Issue a Credential

- **Method:** `POST`
- **URL:** `http://localhost:4001/issue`
- **Body:**

  ```json
  {
    "credential": {
      "name": "John Doe",
      "course": "Kubernetes 101",
      "issueDate": "2025-10-09"
    }
  }
  Success Response (201 Created):
  JSON
  {
  "message": "credential issued by <container_id>"
  }
  Failure Response (409 Conflict): (If the credential already exists)
  JSON
  {
  "message": "This credential has already been issued."
  }

  ```

- **Method:** `POST`
- **URL:** `http://localhost:4002/verify`
- **Body:**
  ```JSON
  {
  "credential": {
  "name": "John Doe",
  "course": "Kubernetes 101",
  "issueDate": "2025-10-09"
  }
  }
  Success Response (200 OK): (If the credential is valid)
  ```

````JSON
{
"message": "Credential verified successfully.",
"issuedBy": "<container_id>",
"issuedAt": "2025-10-09T08:17:13.332Z"
}
Failure Response (404 Not Found): (If the credential does not exist)
```JSON
{
"message": "Credential not found or has not been issued."
}

````

## Running Unit Tests

To run the unit tests for a specific service, navigate into its directory and run the test command.

For the Issuance Service:

**Bash**

cd packages/issuance-service
npm test

For the Verification Service:

**Bash**

cd packages/verification-service
npm test

````

```

```
````
