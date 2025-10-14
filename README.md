# Kube Credential Microservices

This project implements a digital credential system using a microservices architecture. It consists of an issuance-service to create credentials and a verification-service to validate them, supported by a React frontend. The entire application is containerized using Docker and deployed to a production-grade Kubernetes cluster on Amazon EKS (Elastic Kubernetes Service).

# Architecture Overview

The application is designed to run in two distinct environments: a local Docker Compose setup for development and a cloud-native Kubernetes deployment for production.

# High-Level Architecture

The system is composed of three main components: a frontend user interface, and two backend microservices. A persistent data layer is shared between the backend services to maintain the state of issued credentials.

![alt text](<HLD.drawio (1).png>)
![alt text](<Cloud design.drawio.png>)

# Codebase Structure

The project is a monorepo containing the frontend and two backend services. Kubernetes configuration files are stored in the k8s directory.

kube-credential-fsd/
├── docker-compose.yml # Local development orchestration
├── k8s/ # Kubernetes deployment manifests
│ ├── frontend-deployment.yaml
│ ├── issuance-service-deployment.yaml
│ └── ... (other .yaml files)
├── frontend/ # React frontend application
└── packages/ # Backend microservices
├── issuance-service/ # Issues new credentials
└── verification-service/ # Verifies existing credentials
Design Decisions
Several key architectural and design decisions were made to ensure the application is scalable, maintainable, and deployable.

1. # Microservices Architecture

   The application was split into separate issuance and verification services to promote separation of concerns. This allows each service to be developed, deployed, and scaled independently. This pattern is ideal for cloud-native applications, preventing a single point of failure and enabling more agile development cycles.

2. # Containerization with Docker

   All three application components (frontend, issuance, verification) are containerized using Docker. This ensures a consistent and reproducible runtime environment, eliminating "it works on my machine" issues. Multi-stage Dockerfiles are used to create optimized, lightweight production images by separating build-time dependencies from the final runtime image.

3. # Cloud Deployment on Kubernetes (Amazon EKS)

   Kubernetes was chosen as the container orchestrator for its robustness, scalability, and status as the industry standard. Amazon EKS was selected as the managed Kubernetes provider to offload the complexity of managing the Kubernetes control plane, allowing for a focus on application deployment and management.

4. # Networking Strategy: LoadBalancer Service Type
   It is critical to note that the networking strategy for this project is not a standard production best practice.

# Standard Approach:

In a production environment, an Ingress Controller would be used to manage all incoming traffic through a single entry point (one Load Balancer). Backend services would be of type ClusterIP, making them inaccessible from the public internet for security.

# Project Approach:

For this project, each service (frontend, issuance, verification) was exposed publicly using the type: LoadBalancer. This was a pragmatic decision made to meet the assignment's demonstration requirements within a tight timeframe after encountering complex IAM permission issues with the AWS Load Balancer (Ingress) Controller. This approach guarantees each service is reachable for evaluation but is less secure and more costly than using an Ingress.

5. # Data Persistence
   For local development, a named Docker volume (credential_data) is used to persist the credentials.json file and share it between the two backend services. In a cloud environment, this would be replaced with a more robust solution like a managed database (e.g., Amazon RDS) or a persistent volume on a shared file system (e.g., Amazon EFS).

# Prerequisites

Docker & Docker Compose

Node.js

kubectl (Kubernetes CLI)

eksctl (EKS CLI)

# An configured AWS account

## Running the Application Locally

Build and Start the Services:

Bash

docker-compose up --build
API Endpoints:

Frontend: http://localhost:3000

Issuance Service: http://localhost:8081

Verification Service: http://localhost:8082

Cloud Deployment (Kubernetes on AWS EKS)
The application has been successfully deployed to an EKS cluster.

# Live Frontend URL:

[Kube-Crential-frontend](http://a8220b3e9edd04a90a657e4f5680e242-1763668548.us-east-1.elb.amazonaws.com/)

# Performance Considerations

Users may experience slow loading times. This is an expected outcome due to the cost-effective infrastructure chosen for this demonstration:

# Server Infrastructure:

The cluster runs on AWS t3.small instances, which are subject to CPU throttling under sustained use.

# Geographic Latency:

The application is hosted in the us-east-1 (USA) region, which can introduce network latency for users in other parts of the world.

Frontend Optimization: The React frontend has not been fully optimized with production techniques like code-splitting or a CDN, resulting in a larger initial bundle size.

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
