# Order Management Microservices

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Kafka](https://img.shields.io/badge/Apache%20Kafka-231F20?style=for-the-badge&logo=apache-kafka&logoColor=white)](https://kafka.apache.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

> **Event-driven microservices architecture** demonstrating production-ready patterns for order processing, payment handling, and real-time notifications using Apache Kafka and NestJS.

## Architecture Overview

![Flow Diagram](./assets/flow-diagram.png)

This project implements a **distributed microservices system** with the following flow:

1. **API Gateway** receives order requests and emits `order-created` events
2. **Order Service** consumes orders, persists to database, and triggers `process-payment` events
3. **Payment Service** processes payments, stores results, and emits `payment-succeeded` events
4. **Notification Service** observes the entire flow and logs user notifications

### Microservices

| Service                  | Port | Purpose                        | Database   |
| ------------------------ | ---- | ------------------------------ | ---------- |
| **API Gateway**          | 3000 | REST API & Event Publisher     | -          |
| **Order Service**        | -    | Order Processing & Persistence | PostgreSQL |
| **Payment Service**      | -    | Payment Processing & Storage   | PostgreSQL |
| **Notification Service** | -    | User Notification Observer     | -          |

### Event Topics

- `order-created` - Published by Gateway, consumed by Order & Notification services
- `process-payment` - Published by Order, consumed by Payment service
- `payment-succeeded` - Published by Payment, consumed by Notification service

---

## Key Features

### Production-Ready Patterns

- **Input Validation** - DTOs with `class-validator` decorators
- **API Documentation** - Auto-generated Swagger UI at `/api-docs`
- **Health Checks** - Kafka connectivity monitoring at `/api/health`
- **Data Persistence** - PostgreSQL with TypeORM
- **Error Handling** - Global exception filters with proper logging
- **Type Safety** - Full TypeScript with strict mode
- **Structured Logging** - NestJS Logger with context tracking
- **Event Sourcing** - Complete audit trail via Kafka events

### Tech Stack

- **Framework**: NestJS 11+ with TypeScript
- **Message Broker**: Apache Kafka
- **Database**: PostgreSQL 15
- **ORM**: TypeORM with auto-migrations
- **Validation**: class-validator & class-transformer
- **API Docs**: Swagger/OpenAPI 3.0
- **Monorepo**: Nx workspace for code sharing

---

##  Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/mahmoodiftee/order-management-with-nestjs-microservices-and-kafka.git
cd NestJs-Kafka-Microservices

# Install dependencies
npm install

# Start infrastructure (Kafka, Zookeeper, PostgreSQL)
docker-compose up -d
```

### Running Services

Open **4 terminals** and run each service:

```bash
# Terminal 1: API Gateway
npx nx serve api-gateway

# Terminal 2: Order Service
npx nx serve order-microservice

# Terminal 3: Payment Service
npx nx serve payment-microservice

# Terminal 4: Notification Service
npx nx serve notification-microservice
```

---

##  API Documentation

Once the API Gateway is running, access **interactive API documentation** at:

**http://localhost:3000/api-docs**

### Example: Create Order

**Request:**

```bash
curl -X POST http://localhost:3000/api/order \\
  -H "Content-Type: application/json" \\
  -d '{
    "customerId": "cust-12345",
    "productId": "prod-abc-123",
    "quantity": 2,
    "amount": 99.99
  }'
```

**Response:**

```json
{
  "message": "Order created and processing started",
  "order": {
    "orderId": 1709234567890,
    "customerId": "cust-12345",
    "productId": "prod-abc-123",
    "quantity": 2,
    "amount": 99.99,
    "status": "pending",
    "createdAt": "2026-02-17T17:30:00.000Z"
  }
}
```

### Health Check

```bash
curl http://localhost:3000/api/health
```

---

##  Database Schema

### Orders Table

```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id VARCHAR NOT NULL,
  product_id VARCHAR NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  status VARCHAR DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Payments Table

```sql
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

##  Monitoring & Observability

### Logs

Each service uses **NestJS Logger** with contextual information:

```
[AppController] Event emitted for order creation
[OrderService] Order created in database: 1
[AppController] Received new order: {"customerId":"cust-12345"...}
[PaymentService] Payment created in database: 1
[AppController] Notification: Payment succeeded for order: {...}
```

### Health Endpoints

- **Gateway Health**: http://localhost:3000/api/health

---

##  Testing the Flow

1. **Start all services** (API Gateway + 3 microservices)
2. **Start infrastructure**: `docker-compose up -d`
3. **Create an order** via POST to `/api/order`
4. **Watch the logs** cascade:
   - Gateway: Order emitted
   - Order Service: Saved to DB, payment triggered
   - Notification: First alert (order received)
   - Payment Service: Payment saved
   - Notification: Second alert (payment success)

---

##  Project Structure

```
apps/
├── api-gateway/          # REST API & Kafka producer
├── order-microservice/   # Order processing service
├── payment-microservice/ # Payment processing service
└── notification-microservice/ # Notification observer

libs/
└── shared/              # Shared DTOs and utilities
    ├── dtos/            # Data Transfer Objects
    └── filters/         # Exception filters

docker-compose.yml       # Infrastructure setup
```

---

##  Environment Variables

Create a `.env` file in the root:

```env
KAFKA_BROKERS=localhost:9092
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/microservices_db
PORT=3000
```


##  Future Enhancements

- [ ] Distributed tracing with OpenTelemetry
- [ ] SAGA pattern for compensating transactions
- [ ] Redis caching layer
- [ ] Unit & integration test suites
- [ ] Kubernetes deployment manifests
- [ ] CI/CD pipeline
- [ ] Authentication & authorization (JWT)
- [ ] Rate limiting & throttling

---

