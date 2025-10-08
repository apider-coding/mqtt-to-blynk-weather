// eslint-disable-next-line import/no-unresolved
const pino = require('pino');
const { context, trace } = require('@opentelemetry/api');
const config = require('config');

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

const pinoConfig = {
  level: config.get('logger.level') || 'info',
  mixin: pinoMixin,
};

// Use pino-pretty for development for more readable logs
if (process.env.NODE_ENV === 'development') {
  pinoConfig.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname,trace_id,span_id',
    },
  };
}

const logger = pino(pinoConfig);

module.exports = logger;
