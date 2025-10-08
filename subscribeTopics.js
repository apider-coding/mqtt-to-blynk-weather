const opentelemetry = require('@opentelemetry/api');

const tracer = opentelemetry.trace.getTracer('mqtt-to-blynk-weather');
const logger = require('./logger/logger');

/**
 * Subscribes to an array of MQTT topics.
 * @param {Object} client MQTT client
 * @param {Array} topics Array of topics to subscribe to
 */
const subscribeTopics = (client, topics) => {
  tracer.startActiveSpan('subscribe-all-topics', async (span) => {
    try {
      span.setAttribute('app.topics.count', topics.length);

      const subscriptionPromises = topics.map((topic) => {
        logger.info({ message: 'Subscribing to topic', topic: topic.name });
        // Add an event for each subscription attempt
        span.addEvent('Subscribing to topic', { name: topic.name });
        return client.subscribe(topic.name);
      });

      await Promise.all(subscriptionPromises);

      logger.info({ message: 'All topics subscribed successfully' });
      span.setStatus({ code: opentelemetry.SpanStatusCode.OK });
    } catch (err) {
      logger.error({ message: 'Failed to subscribe to topics', error: err.message });
      span.recordException(err);
      span.setStatus({ code: opentelemetry.SpanStatusCode.ERROR, message: err.message });
      // Re-throw the error if you want the caller to be able to handle it
      throw err;
    } finally {
      // The span will be ended automatically when the promise resolves or rejects
      span.end();
    }
  });
};
module.exports = { subscribeTopics };
