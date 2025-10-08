/* eslint-disable no-console */
const config = require('config');
const opentelemetry = require('@opentelemetry/api');
const { asyncClient } = require('./connectMQTT');
const { subscribeTopics } = require('./subscribeTopics');
const { processData } = require('./processData');
const logger = require('./logger/logger');

const tracer = opentelemetry.trace.getTracer(config.get('service.name'));

// Get topics we want to subscribe to from config
const topics = config.get('topics');

/**
 * Start up
 */
tracer.startActiveSpan('app-startup', async (span) => {
  try {
    logger.info({ message: 'Application starting up...' });
    span.setAttribute('app.topics.count', topics.length);

    await subscribeTopics(asyncClient, topics);
    processData(asyncClient, topics);

    logger.info({ message: 'MQTT topic listener started successfully' });
    span.setStatus({ code: opentelemetry.SpanStatusCode.OK });
  } catch (error) {
    logger.error({ message: 'Application startup failed', error });
    span.recordException(error);
    span.setStatus({ code: opentelemetry.SpanStatusCode.ERROR, message: error.message });
    process.exit(1); // Exit if startup fails
  } finally {
    span.end();
  }
});
