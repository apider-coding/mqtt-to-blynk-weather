const winston = require('winston');
const { context, trace } = require('@opentelemetry/api');

/**
 * Custom winston format to add trace context to logs.
 */
const otelFormat = winston.format((info) => {
  const span = trace.getSpan(context.active());
  if (span) {
    const { traceId, spanId } = span.spanContext();
    info.trace_id = traceId;
    info.span_id = spanId;
  }
  return info;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    otelFormat(), // Add the custom format
    winston.format.json(), // Or your existing format
  ),
  transports: [
    new winston.transports.Console(),
    // any other transports you have
  ],
});

module.exports = logger;
