# Test script for Product CRUD endpoints
Write-Host "=== Testing Product CRUD Endpoints ===" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000/products"

# Test 1: GET all products (should return empty array initially)
Write-Host "1. Testing GET /products (Get all products)..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri $baseUrl -Method GET -ErrorAction Stop
    Write-Host "   ✅ SUCCESS - Status: OK" -ForegroundColor Green
    Write-Host "   Response: $($response | ConvertTo-Json -Compress)"
} catch {
    Write-Host "   ❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Make sure the API Gateway is running on port 3000" -ForegroundColor Red
    exit 1
}

# Test 2: POST - Create a product
Write-Host "`n2. Testing POST /products (Create product)..." -ForegroundColor Yellow
$productData = @{
    title = "MacBook Pro"
    description = "Apple MacBook Pro 16-inch"
    price = 2499.99
    quantity = 10
    type = "Electronics"
    image = "https://example.com/macbook.jpg"
    categoryId = 1
} | ConvertTo-Json

try {
    $createdProduct = Invoke-RestMethod -Uri $baseUrl -Method POST -Body $productData -ContentType "application/json" -ErrorAction Stop
    Write-Host "   ✅ SUCCESS - Product created!" -ForegroundColor Green
    Write-Host "   Product ID: $($createdProduct.id)" -ForegroundColor Cyan
    Write-Host "   Product: $($createdProduct | ConvertTo-Json -Compress)"
    $productId = $createdProduct.id
} catch {
    Write-Host "   ❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Response: $responseBody" -ForegroundColor Red
    }
    Write-Host "   Note: Make sure category with ID 1 exists in the database" -ForegroundColor Yellow
    exit 1
}

# Test 3: GET by ID
Write-Host "`n3. Testing GET /products/$productId (Get product by ID)..." -ForegroundColor Yellow
try {
    $product = Invoke-RestMethod -Uri "$baseUrl/$productId" -Method GET -ErrorAction Stop
    Write-Host "   ✅ SUCCESS" -ForegroundColor Green
    Write-Host "   Product: $($product | ConvertTo-Json -Compress)"
} catch {
    Write-Host "   ❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: PUT - Update product
Write-Host "`n4. Testing PUT /products/$productId (Update product)..." -ForegroundColor Yellow
$updateData = @{
    title = "MacBook Pro Updated"
    price = 2299.99
    quantity = 15
} | ConvertTo-Json

try {
    $updatedProduct = Invoke-RestMethod -Uri "$baseUrl/$productId" -Method PUT -Body $updateData -ContentType "application/json" -ErrorAction Stop
    Write-Host "   ✅ SUCCESS - Product updated!" -ForegroundColor Green
    Write-Host "   Updated Product: $($updatedProduct | ConvertTo-Json -Compress)"
} catch {
    Write-Host "   ❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: GET all products again
Write-Host "`n5. Testing GET /products (Get all products after create)..." -ForegroundColor Yellow
try {
    $allProducts = Invoke-RestMethod -Uri $baseUrl -Method GET -ErrorAction Stop
    Write-Host "   ✅ SUCCESS" -ForegroundColor Green
    Write-Host "   Total products: $($allProducts.Count)"
    Write-Host "   Products: $($allProducts | ConvertTo-Json -Depth 5)"
} catch {
    Write-Host "   ❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: DELETE product
Write-Host "`n6. Testing DELETE /products/$productId (Delete product)..." -ForegroundColor Yellow
try {
    $deleteResponse = Invoke-RestMethod -Uri "$baseUrl/$productId" -Method DELETE -ErrorAction Stop
    Write-Host "   ✅ SUCCESS - Product deleted!" -ForegroundColor Green
    Write-Host "   Response: $($deleteResponse | ConvertTo-Json -Compress)"
} catch {
    Write-Host "   ❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 7: Verify deletion
Write-Host "`n7. Testing GET /products/$productId (Verify deletion)..." -ForegroundColor Yellow
try {
    $deletedProduct = Invoke-RestMethod -Uri "$baseUrl/$productId" -Method GET -ErrorAction Stop
    Write-Host "   ⚠️  WARNING: Product still exists (should have been deleted)" -ForegroundColor Yellow
} catch {
    Write-Host "   ✅ SUCCESS - Product not found (correctly deleted)" -ForegroundColor Green
}

Write-Host "`n=== All Tests Completed ===" -ForegroundColor Cyan
