# Important Notes

- Api status codes has their usual meanings
- In the docs of each api, these emojis have the following meaning
  - 🌍 - public api
  - 🔒 - secure api, requires _Bearer Token_ in the `Authorization` key in header
- In most cases, if there is no useful data to return in the response body, then it always return the following data:

```ts
{
  message: string
}
```

- The APIs are categorized into 3 modules: `Auth`, `User`, `Resource`
- Each of these module details including their APIs and models can be found in their respective folder in `src/api`
- For now the `.env` file is included in this project intentionally so as to make the testing easier but note that these credentials (inc. S3 bucket and Mongodb account) will be removed after 3 days as its just for interview purpose

- To run this project :
```sh
npm install
npm run dev
```
