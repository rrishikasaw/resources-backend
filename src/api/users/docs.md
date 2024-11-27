
# Model

```ts
interface User {
  _id: ObjectId
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}
```

---

# APIs

## 🌍 POST `/`

### Request Body

```ts
{
  name: string
  email: string
  password: string
}
```

### Description

- Registers a new user
- Checks if `email` is available

## 🔒 GET `/`

### Response Body

```js
{
  _id: 'john.doe',
  name: 'John Doe',
  email: 'john.doe@example.com',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-07-26T00:00:00Z'
}
```

### Description

- Returns the details of that logged-in user
