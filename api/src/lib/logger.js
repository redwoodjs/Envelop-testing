import { createLogger } from '@redwoodjs/api/logger'

/**
 * Stream logs to Datadog
 */
import datadog from 'pino-datadog'

const isDataDogSetup =
  process.env.DATADOG_API_KEY && process.env.DATADOG_API_KEY !== ''

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

/**
 * Creates a logger with RedwoodLoggerOptions
 *
 * These extend and override default LoggerOptions,
 * can define a destination like a file or other supported pin log transport stream,
 * and sets where or not to show the logger configuration settings (defaults to false)
 *
 * @param RedwoodLoggerOptions
 *
 * RedwoodLoggerOptions have
 * @param {options} LoggerOptions - defines how to log, such as pretty printing, redaction, and format
 * @param {string | DestinationStream} destination - defines where to log, such as a transport stream or file
 * @param {boolean} showConfig - whether to display logger configuration on initialization
 */
export const logger = createLogger({
  options: { level: 'info', prettyPrint: false },
  destination: isDataDogSetup && stream,
})
