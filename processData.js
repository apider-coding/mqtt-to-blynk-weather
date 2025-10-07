/* eslint-disable no-param-reassign */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const config = require('config');
const opentelemetry = require('@opentelemetry/api');
const logger = require('./logger/logger');

const { convertToMS, parseSparsnasWatt } = require('./helpers');
const { postBlynk } = require('./postBlynk');

const tracer = opentelemetry.trace.getTracer('mqtt-to-blynk-weather');

/**
 * Processes the data from topics according to config
 * @param {Object} client MQTT Client
 * @param {Array} topics array of topics
 */
const processData = (client, topics) => {
  client.on('message', (topic, message) => {
    // Start a new span for each message received
    tracer.startActiveSpan(`process-mqtt-message:${topic}`, async (span) => {
      try {
        const params = topics.filter((item) => topic === item.name);
        if (topic.includes('km_h')) {
          message = convertToMS(message);
        }
        if (topic.includes('EspSparsnasGateway/valuesV2')) {
          message = parseSparsnasWatt(message);
        }

        // This log will now have trace context
        logger.info({ message: 'Got data from topic', topic, value: message.toString() });

        const dataUrl = `${config.get('blynk.url')}/${config.get('blynk.token')}/update/${params[0].pin}?value=${message.toString()}`;

        await postBlynk(dataUrl);
      } catch (error) {
        span.recordException(error);
        span.setStatus({ code: opentelemetry.SpanStatusCode.ERROR, message: error.message });
        logger.error({ message: 'Error processing message', error });
      } finally {
        // The span is automatically ended when the async function completes
        span.end();
      }
    });
  });
};

module.exports = { processData };
