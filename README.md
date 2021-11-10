# Stripe - BusinessQL

## List customers

To list Stripe customers, send a POST request to the API with the following payload:

```json
{
  "method": "customers",
  "payload": {
    "secretKey": "<STRIPE_SECRET_KEY>"
  }
}
```

## Add customer

To add a new Stripe customer, send a POST request to the API with the following payload:

```json
{
  "method": "addCustomer",
  "payload": {
    "secretKey": "<STRIPE_SECRET_KEY>",
    "name": "Full Name",
    "email": "name@example.com",
    "metadata": {}
  }
}
```

## Update customer

To update a Stripe customer, send a POST request to the API with the following payload:

```json
{
  "method": "updateCustomer",
  "payload": {
    "secretKey": "<STRIPE_SECRET_KEY>",
    "customerId": "<CUSTOMER_ID>",
    "data": {
      "name": "New Name",
      "email": "new-email@example.com",
      "metadata": {
        "random": "extra data"
      }
    }
  }
}
```

## Remove customer

To remove a Stripe customer, send a POST request to the API with the following payload:

```json
{
  "method": "removeCustomer",
  "payload": {
    "secretKey": "<STRIPE_SECRET_KEY>",
    "customerId": "<CUSTOMER_ID>"
  }
}
```
