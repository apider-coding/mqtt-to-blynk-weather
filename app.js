/* eslint-disable no-console */
const config = require('config');
const { asyncClient } = require('./connectMQTT');
const { subscribeTopics } = require('./subscribeTopics');
const { processData } = require('./processData');
const logger = require('./logger/logger');

// Get topics we want to subscribe to from config
const topics = config.get('topics');

/**
 * Start up
 */
(async () => {
  await subscribeTopics(asyncClient, topics);
  await processData(asyncClient, topics);
})();

logger.info({ message: 'MQTT topic listener started' });
