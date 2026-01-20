# Product CRUD API Testing Guide

## Overview
Full CRUD (Create, Read, Update, Delete) operations for Products have been implemented and are accessible through the API Gateway.

## Prerequisites

1. **Database Setup**: Ensure PostgreSQL is running and accessible
   - Default connection: `postgresql://nestuser:nestpass@localhost:5432/youshop`
   - Or update `PRODUCT_DATABASE_URL` in `.env` file

2. **Create a Category First**: Products require a category to exist
   ```sql
   INSERT INTO "Category" (name, description) VALUES ('Electronics', 'Electronic devices');
   ```

3. **Start Services**:
   ```powershell
   # Terminal 1 - Product Service
   cd apps/product-service
   $env:PRODUCT_DATABASE_URL="postgresql://nestuser:nestpass@localhost:5432/youshop"
   npx nest start product-service --watch

   # Terminal 2 - API Gateway
   cd apps/api-gateway
   $env:API_GATEWAY_PORT="3000"
   npx nest start api-gateway --watch
   ```

## Available Endpoints

Base URL: `http://localhost:3000/products`

### 1. GET /products
Get all products

**Request:**
```powershell
Invoke-RestMethod -Uri http://localhost:3000/products -Method GET
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Product Name",
    "description": "Description",
    "price": 99.99,
    "quantity": 10,
    "type": "Type",
    "image": "image-url",
    "categoryId": 1,
    "category": {
      "id": 1,
      "name": "Category Name",
      "description": "Category Description"
    }
  }
]
```

### 2. POST /products
Create a new product

**Request:**
```powershell
$body = @{
    title = "MacBook Pro"
    description = "Apple MacBook Pro 16-inch"
    price = 2499.99
    quantity = 10
    type = "Electronics"
    image = "https://example.com/macbook.jpg"
    categoryId = 1
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:3000/products -Method POST -Body $body -ContentType "application/json"
```

**Response:**
```json
{
  "id": 1,
  "title": "MacBook Pro",
  "description": "Apple MacBook Pro 16-inch",
  "price": 2499.99,
  "quantity": 10,
  "type": "Electronics",
  "image": "https://example.com/macbook.jpg",
  "categoryId": 1,
  "category": { ... }
}
```

### 3. GET /products/:id
Get a product by ID

**Request:**
```powershell
Invoke-RestMethod -Uri http://localhost:3000/products/1 -Method GET
```

**Response:**
```json
{
  "id": 1,
  "title": "MacBook Pro",
  ...
}
```

### 4. PUT /products/:id
Update a product (all fields optional)

**Request:**
```powershell
$updateData = @{
    title = "MacBook Pro Updated"
    price = 2299.99
    quantity = 15
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:3000/products/1 -Method PUT -Body $updateData -ContentType "application/json"
```

**Response:**
```json
{
  "id": 1,
  "title": "MacBook Pro Updated",
  "price": 2299.99,
  "quantity": 15,
  ...
}
```

### 5. DELETE /products/:id
Delete a product

**Request:**
```powershell
Invoke-RestMethod -Uri http://localhost:3000/products/1 -Method DELETE
```

**Response:**
```json
{
  "message": "Product with ID 1 has been deleted"
}
```

## Complete Test Script

Run the provided `test-products.ps1` script:

```powershell
.\test-products.ps1
```

## Error Handling

- **400 Bad Request**: Invalid product ID format
- **404 Not Found**: Product or Category not found
- **500 Internal Server Error**: Service communication issues or database errors

## Features Implemented

✅ Full CRUD operations (Create, Read, Update, Delete)  
✅ Input validation using class-validator  
✅ Category existence validation  
✅ Error handling with proper HTTP status codes  
✅ Products include category information in responses  
✅ Microservice architecture (TCP communication)  
✅ Clean separation of concerns  

## Architecture

- **API Gateway** (Port 3000): HTTP REST API endpoint
- **Product Service** (Port 3003): TCP Microservice handling business logic
- **Database**: PostgreSQL with Prisma ORM

## Notes

- Products require a valid `categoryId` that exists in the database
- All price and quantity values must be non-negative
- Product title is required
- Description, type, and image are optional fields
