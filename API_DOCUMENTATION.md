# 🔌 CalcHub Nepal API Reference

Welcome to the official API documentation for CalcHub Nepal. Our RESTful API allows you to integrate powerful financial and utility calculations directly into your applications.

## 🚀 Base URL

All API requests should be prefixed with the following base URL:

```text
https://api.calchubnepal.com/v1
```

## 🔐 Authentication

The API uses Bearer Token authentication. You must include your API key in the `Authorization` header of every request.

**Header Format:**
```http
Authorization: Bearer YOUR_API_KEY
```

*To get an API key, please register on the [CalcHub Nepal Developer Portal](https://calchubnepal.com/developers).*

---

## 📦 Endpoints

### 1. Calculate EMI
Calculates the Equated Monthly Installment (EMI), total interest, and generates a full amortization schedule.

- **URL:** `/calculate/emi`
- **Method:** `POST`
- **Content-Type:** `application/json`

**Request Body:**
```json
{
  "principal": 1000000,
  "rate": 10.5,
  "tenure": 5,
  "tenureType": "years" 
}
```
*(Note: `tenureType` can be `"years"` or `"months"`)*

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "emi": 21494.00,
    "totalInterest": 289640.00,
    "totalPayment": 1289640.00,
    "schedule": [
      {
        "month": 1,
        "principal": 12744.00,
        "interest": 8750.00,
        "balance": 987256.00
      }
    ]
  }
}
```

---

### 2. Calculate Income Tax (Nepal)
Calculates the income tax liability based on the latest Nepal Government tax slabs.

- **URL:** `/calculate/tax`
- **Method:** `POST`
- **Content-Type:** `application/json`

**Request Body:**
```json
{
  "income": 1200000,
  "type": "individual",
  "deductions": {
    "ssf": 0,
    "pf": 0,
    "cit": 0,
    "insurance": 40000
  }
}
```
*(Note: `type` can be `"individual"` or `"couple"`)*

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "taxableIncome": 1160000,
    "totalTax": 107000,
    "effectiveTaxRate": 8.91,
    "slabs": [
      {
        "name": "First Slab (1%)",
        "amount": 500000,
        "tax": 5000,
        "rate": 1
      },
      {
        "name": "Second Slab (10%)",
        "amount": 300000,
        "tax": 30000,
        "rate": 10
      }
    ]
  }
}
```

---

### 3. Calculate GST / VAT
Adds or extracts Value Added Tax (VAT) from a given amount.

- **URL:** `/calculate/gst`
- **Method:** `POST`
- **Content-Type:** `application/json`

**Request Body:**
```json
{
  "amount": 5000,
  "rate": 13,
  "action": "add"
}
```
*(Note: `action` can be `"add"` or `"extract"`)*

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "originalAmount": 5000,
    "gstAmount": 650,
    "totalAmount": 5650,
    "rate": 13,
    "action": "add"
  }
}
```

---

## ⚠️ Error Handling

The API uses standard HTTP status codes to indicate the success or failure of a request.

| Status Code | Description |
| :--- | :--- |
| `200 OK` | The request was successful. |
| `400 Bad Request` | The request was invalid or missing required parameters. |
| `401 Unauthorized` | The API key is missing or invalid. |
| `429 Too Many Requests` | You have exceeded your rate limit. |
| `500 Internal Server Error` | An unexpected error occurred on our end. |

**Error Response Format:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_PARAMETERS",
    "message": "The 'principal' field must be a positive number."
  }
}
```

## 📈 Rate Limits

- **Free Tier:** 100 requests per minute
- **Pro Tier:** 1000 requests per minute
- **Enterprise Tier:** Unlimited

If you exceed the rate limit, you will receive a `429 Too Many Requests` response.
