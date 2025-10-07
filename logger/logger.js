// eslint-disable-next-line import/no-unresolved
const pino = require('pino');
const { context, trace } = require('@opentelemetry/api');

/**
 * Mixin function for pino to add trace context to logs.
 * @returns {object} An object containing trace_id and span_id if a span is active.
 */
const pinoMixin = () => {
  const span = trace.getSpan(context.active());
  if (!span) {
    return {};
  }
  const { traceId, spanId } = span.spanContext();
  return { trace_id: traceId, span_id: spanId };
};

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  mixin: pinoMixin,
});

module.exports = logger;
