/**
 * Connects to MQTT with async-client
 * @module
 */
const config = require('config');
const mqtt = require('async-mqtt');
const logger = require('./logger/logger');

const mqttOptions = {
  reconnectPeriod: config.has('mqtt.reconnectPeriodMs') ? config.get('mqtt.reconnectPeriodMs') : 5000,
  connectTimeout: config.has('mqtt.connectTimeoutMs') ? config.get('mqtt.connectTimeoutMs') : 30000,
};

const asyncClient = mqtt.connect(config.get('mqtt.broker'), mqttOptions);

asyncClient.on('connect', () => {
  logger.info({ message: 'Connected to MQTT broker', broker: config.get('mqtt.broker') });
});

asyncClient.on('reconnect', () => {
  logger.warn({
    message: 'Reconnecting to MQTT broker',
    broker: config.get('mqtt.broker'),
    reconnectPeriodMs: mqttOptions.reconnectPeriod,
  });
});

asyncClient.on('offline', () => {
  logger.warn({ message: 'MQTT broker connection is offline', broker: config.get('mqtt.broker') });
});

asyncClient.on('close', () => {
  logger.warn({ message: 'MQTT broker connection closed', broker: config.get('mqtt.broker') });
});

asyncClient.on('error', (error) => {
  logger.error({
    message: 'MQTT client error',
    broker: config.get('mqtt.broker'),
    error: error.message,
  });
});

module.exports = { asyncClient };
