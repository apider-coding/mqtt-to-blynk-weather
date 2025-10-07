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
const processData = async (client, topics) => {
  tracer.startActiveSpan('process data', async (parentSpan) => {
    await client.on('message', async (topic, message) => {
      const params = topics.filter((item) => topic === item.name);
      if (topic.includes('km_h')) {
        message = convertToMS(message);
      }
      if (topic.includes('EspSparsnasGateway/valuesV2')) {
        message = parseSparsnasWatt(message);
      }

      // debug
      logger.info({ message: 'Got data from topic', topic, value: message.toString() });

      const dataUrl = `${config.get('blynk.url')}/${config.get('blynk.token')}/update/${params[0].pin}?value=${message.toString()}`;

      await postBlynk(dataUrl);
      parentSpan.end();
    });
  });
};

module.exports = { processData };
