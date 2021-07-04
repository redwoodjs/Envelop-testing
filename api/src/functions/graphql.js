import {
  createGraphQLHandler,
  makeMergedSchema,
  makeServices,
} from '@redwoodjs/graphql-server'

import schemas from 'src/graphql/**/*.{js,ts}'
import services from 'src/services/**/*.{js,ts}'
import { logger } from 'src/lib/logger'
import { db } from 'src/lib/db'

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
  schema: makeMergedSchema({
    schemas,
    services: makeServices({ services }),
  }),
  onException: () => {
    // Disconnect from your database with an unhandled exception.
    db.$disconnect()
  },
})
