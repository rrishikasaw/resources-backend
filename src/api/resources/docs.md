# Model

```ts
interface Resource {
  _id: ObjectId
  user: ObjectId('User')
  file?: string
  link?: string
  url: string
  status: 'active' | 'expired'
  expiry: Date
  createdAt: Date
  updatedAt: Date
}
```

# APIs

## 🔒 GET `/resources`

### Request Query

```js
{
  limit?: '10'
  page?: '1'
  status?: 'active' | 'inactive'
}
```

### Response Body

```ts
{
  resources: Resource[]
  count: number
}
```

### Description

- Returns the list of all resources as per the `status` filter and pagination
- Returns only those resources which is created by this user

## 🌍 GET `/resources/:id`

### Description

- Redirect to the resource url if active

## 🔒 POST `/resources`

### Request Body (Form Data)

```ts
{
  file?: File
  link?: string
  expiry: ISODateString
}
```

### Response Body

```ts
{
  resource: {
    _id: ObjectId('Resource')
    file?: string
    link?: string
    url: string
    user: ObjectId('User')
    status: 'active'
    expiry: Date
    createdAt: Date
    updatedAt: Date
  }
}
```

### Description

- Creates a new resource
- At least one of `file` or `link` is required

## 🔒 DELETE `/resources/:id`

### Description

- Deletes the resource
- Deletes the file from S3 also if `file` exists
- User must be the creator of that resource
