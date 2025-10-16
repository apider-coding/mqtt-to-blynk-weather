// eslint-disable-next-line import/no-extraneous-dependencies
// const pino = require('pino');
// module.exports = pino();

// const logger = require('pino')();
// module.exports = logger;
// eslint-disable-next-line no-unused-vars, import/no-extraneous-dependencies
const { OpenTelemetryTransportV3 } = require('@opentelemetry/winston-transport');

const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console(),
    new OpenTelemetryTransportV3(),
  ],
});

module.exports = logger;

// // eslint-disable-next-line import/no-unresolved
// const pino = require('pino');
// const { context, trace } = require('@opentelemetry/api');
// const config = require('config');

// /**
//  * Mixin function for pino to add trace context to logs.
//  * @returns {object} An object containing trace_id and span_id if a span is active.
//  */
// const pinoMixin = () => {
//   const span = trace.getSpan(context.active());
//   if (!span) {
//     return {};
//   }
//   const { traceId, spanId } = span.spanContext();
//   return { trace_id: traceId, span_id: spanId };
// };

// const pinoConfig = {
//   level: config.get('logger.level') || 'info',
//   mixin: pinoMixin,
// };

// // Use pino-pretty for development for more readable logs
// if (process.env.NODE_ENV === 'development') {
//   pinoConfig.transport = {
//     target: 'pino-pretty',
//     options: {
//       colorize: true,
//       translateTime: 'SYS:standard',
//       ignore: 'pid,hostname,trace_id,span_id',
//     },
//   };
// }

// const logger = pino(pinoConfig);

// module.exports = logger;
