const config = require('config');
const opentelemetry = require('@opentelemetry/api');

const tracer = opentelemetry.trace.getTracer(config.get('service.name'));
const logger = require('./logger/logger');

const subscribeAllTopics = async (client, topics, trigger) => {
  await tracer.startActiveSpan('subscribe-all-topics', async (span) => {
    try {
      span.setAttribute('app.topics.count', topics.length);
      span.setAttribute('app.subscription.trigger', trigger);

      const subscriptionPromises = topics.map((topic) => {
        logger.info({ message: 'Subscribing to topic', topic: topic.name, trigger });
        span.addEvent('Subscribing to topic', { name: topic.name });
        return client.subscribe(topic.name);
      });

      await Promise.all(subscriptionPromises);

      logger.info({ message: 'All topics subscribed successfully', trigger });
      span.setStatus({ code: opentelemetry.SpanStatusCode.OK });
    } catch (err) {
      logger.error({
        message: 'Failed to subscribe to topics',
        trigger,
        error: err.message,
      });
      span.recordException(err);
      span.setStatus({ code: opentelemetry.SpanStatusCode.ERROR, message: err.message });
    } finally {
      span.end();
    }
  });
};

/**
 * Subscribes to an array of MQTT topics.
 * @param {Object} client MQTT client
 * @param {Array} topics Array of topics to subscribe to
 */
const subscribeTopics = (client, topics) => {
  let subscriptionInFlight;

  const runSubscription = (trigger) => {
    if (subscriptionInFlight) {
      return subscriptionInFlight;
    }

    subscriptionInFlight = subscribeAllTopics(client, topics, trigger)
      .finally(() => {
        subscriptionInFlight = null;
      });

    return subscriptionInFlight;
  };

  client.on('connect', () => {
    runSubscription('connect');
  });

  if (client.connected) {
    runSubscription('startup');
  } else {
    logger.warn({ message: 'MQTT broker not connected yet, waiting to subscribe to topics' });
  }
};
module.exports = { subscribeTopics };
