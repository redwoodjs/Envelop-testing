# Todo

This is an example Redwood app, implementing a very minimal todo application.
Features you can see in action here:

- Redwood Cells (see TodoListCell.js).
- Optimistic GraphQL response with Apollo (see AddTodo.js).
- SVG loader (see Check.js)
- StyledComponents usage (and stylistic approach)

## Getting Started

### Setup

We use Yarn as our package manager. To get the dependencies installed, just do
this in the root directory:

```terminal
yarn
```

Set up the database and generate the database client:

```terminal
yarn redwood prisma migrate dev
```

### Fire it up

```terminal
yarn redwood dev
```

Browse to `http://localhost:8910` (or run `yarn redwood open`) to see the web app.

Lambda functions run on
`localhost:8911` but are proxied via `localhost:8910/api/functions/*`.

# Todo

This is an example Redwood app, implementing a very minimal todo application.
Features you can see in action here:

- Redwood Cells (see TodoListCell.js).
- Optimistic GraphQL response with Apollo (see AddTodo.js).
- SVG loader (see Check.js)
- StyledComponents usage (and stylistic approach)

## Getting Started

### Setup

We use Yarn as our package manager. To get the dependencies installed, just do
this in the root directory:

```terminal
yarn
```

Set up the database and generate the database client:

```terminal
yarn redwood prisma migrate dev
```

#### Logging

Logging is enabled and configured in the GraphQL Handler and also setup to send to dataDog via a pino transport.

##### GraphQL

Logging the execution of the GraphQL resolvers is setup in `api/src/functions/graphql.js`.

The `createGraphQLHandler` is setup to log data, userAgent, a requestId, and tracing info.

```js
export const handler = createGraphQLHandler({
  loggerConfig: {
    logger,
    options: {
      operationName: true,
      userAgent: true,
      data: true,
      requestId: true,
      tracing: true,
    },
  },
  //...
```

##### DataDog

Currently, if `DATADOG_API_KEY` is provided, the app will attempt to log to [DataDog](https://www.datadoghq.com/)

If you want to test logging in development locally, then will need to setup a

```
DATADOG_API_KEY
```

in your local `.env` file.

#### Identifying and logging testcases

Since we want to compare the logs and trace timings across deployments (Netlify, Vercel, and Render) we can configure each deployed branch to
send this info to DataDog for searching and faceting.

```js
/**

 * Creates a synchronous pino-datadog stream
 *
 * @param {object} options - Datadog options including your account's API Key
 *
 * @typedef {DestinationStream}
 */
export const stream = datadog.createWriteStreamSync({
  apiKey: process.env.DATADOG_API_KEY,
  ddsource: 'main',
  ddtags: 'main',
  service: 'envelop-testing',
  size: 1,
})
```

We can set:

- ddsource: the deployment (netlify, render, or cercel)
- ddtags: the type of graphql (apollo or envelop)
- service: to the branch name tested

We'll do that also via envars.

```js
/**

 * Creates a synchronous pino-datadog stream
 *
 * @param {object} options - Datadog options including your account's API Key
 *
 * @typedef {DestinationStream}
 */
export const stream = datadog.createWriteStreamSync({
  apiKey: process.env.DATADOG_API_KEY,
  ddsource: process.env.DATADOG_SOURCE,
  ddtags: process.env.DATADOG_TAGS,
  service: process.env.DATADOG_SERVICE,
  size: 1,
})
```

See `.env.defaults`.

```
# where deployed: development, netlify, vercel, render
DATADOG_SOURCE=development
# which graphql: apollo or envelop
DATADOG_TAGS=apollo
# deployed branch name (netlify-envelop, render-apollo, etc)
DATADOG_SERVICE=envelop-testing
```

Change these in your environment settings in each deployment.

Note: For Netlify, functions only read from the UI dashboard set envars, so set:

- DATADOG_SERVICE
- DATADOG_SOURCE

But hardcode the `DATADOG_TAGS` in your logger configuration:

```js
export const stream = datadog.createWriteStreamSync({
  apiKey: process.env.DATADOG_API_KEY,
  ddsource: process.env.DATADOG_SOURCE,
  ddtags: 'graphql-apollo',
  service: process.env.DATADOG_SERVICE,
  size: 1,
})
```

### Fire it up

```terminal
yarn redwood dev
```

Browse to `http://localhost:8910` (or run `yarn redwood open`) to see the web app.

Lambda functions run on
`localhost:8911` but are proxied via `localhost:8910/api/functions/*`.
