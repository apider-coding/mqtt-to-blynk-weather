const opentelemetry = require('@opentelemetry/api');

const tracer = opentelemetry.trace.getTracer('mqtt-to-blynk-weather');
/* eslint-disable no-console */
/**
 * @module
 */
/**
 * @param {Object} client MQTT client
 * @param {Array} topics Array of topics
 */
const logger = require('./logger/logger');

const subscribeTopics = async (client, topics) => {
  topics.forEach(async (topic) => {
    try {
      tracer.startActiveSpan(`subscribe-mqtt-topic:${topic.name}`, async (span) => {
        await client.subscribe(topic.name);
        logger.info({ message: 'Subscribed to topic', topic: topic.name });
        span.end();
      });
    } catch (err) {
      logger.error(err.message);
    }
  });
};

module.exports = { subscribeTopics };
