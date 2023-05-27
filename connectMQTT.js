/**
 * Connects to MQTT with async-client
 * @module
 */
const config = require('config');
const mqtt = require('async-mqtt');

const asyncClient = mqtt.connect(config.get('mqtt.broker'));

module.exports = { asyncClient };
