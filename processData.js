/* eslint-disable no-param-reassign */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const config = require('config');
const opentelemetry = require('@opentelemetry/api');

const tracer = opentelemetry.trace.getTracer(config.get('service.name'));
const logger = require('./logger/logger');

const { convertToMS, convertToKiloWatt } = require('./helpers');
const { postBlynk } = require('./postBlynk');

/**
 * A map of transformation functions based on topic content.
 * This is more maintainable than multiple `if` statements.
 */
const transformationMap = {
  km_h: convertToMS,
  EspSparsnasGateway: convertToKiloWatt,
};

/**
 * Finds and applies a transformation if one is configured for the topic.
 * @param {string} topic The MQTT topic name.
 * @param {string} message The message payload.
 * @returns The transformed message.
 */
const applyTransformation = (topic, message) => {
  const matchingKey = Object.keys(transformationMap).find((key) => topic.includes(key));

  if (matchingKey) {
    return transformationMap[matchingKey](message);
  }

  return message; // Return original message if no transformation matches
};

/**
 * Processes the data from topics according to config
 * @param {Object} client MQTT Client
 * @param {Array} topics array of topics
 */
const processData = (client, topics) => {
  // Create a Map for efficient O(1) topic lookups instead of O(n) filtering.
  const topicMap = new Map(topics.map((topic) => [topic.name, topic]));

  client.on('message', (topic, message) => {
    tracer.startActiveSpan(`process-mqtt-message:${topic}`, async (span) => {
      try {
        // Efficiently get topic parameters from the map.
        const params = topicMap.get(topic);

        // Gracefully handle messages for topics not in our config.
        if (!params) {
          logger.warn({ message: 'Received message for unconfigured topic', topic });
          span.setStatus({ code: opentelemetry.SpanStatusCode.OK, message: 'Unconfigured topic' });
          return;
        }

        span.setAttribute('app.blynk.pin', params.pin);

        const transformedMessage = applyTransformation(topic, message);

        logger.info({ message: 'Got data from topic', topic, value: transformedMessage.toString() });

        const dataUrl = `${config.get('blynk.url')}/${config.get('blynk.token')}/update/${params.pin}?value=${transformedMessage.toString()}`;

        await postBlynk(dataUrl, params.pin, transformedMessage.toString());
        span.setStatus({ code: opentelemetry.SpanStatusCode.OK });
      } catch (error) {
        span.recordException(error);
        span.setStatus({ code: opentelemetry.SpanStatusCode.ERROR, message: error.message });
        logger.error({ message: 'Error processing message', error: error.message, stack: error.stack });
      } finally {
        span.end();
      }
    });
  });
};

module.exports = { processData };
