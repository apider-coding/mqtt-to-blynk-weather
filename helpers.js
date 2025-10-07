/**
 * @module
 */

/**
 * Function that convert km/h to m/s
 * @param {*} item Item to be converted in km/h
 * @returns {Number} Item converted to m/s
 */

const opentelemetry = require('@opentelemetry/api');
const logger = require('./logger/logger');

const tracer = opentelemetry.trace.getTracer('mqtt-to-blynk-weather');

const convertToMS = (item) => ((Number(item.toString()) * 1000) / 3600).toFixed(1);

/**
 * Function return watt from message in kW
 * @param {*} item Item to be processed
 * @returns {Number} Item converted to kW
 */
const parseSparsnasWatt = (item) => tracer.startActiveSpan('convert-watt', (span) => {
  const msgJson = JSON.parse(item);
  const result = (Number(msgJson.watt) / 1000).toFixed(2);
  span.setAttribute('app.watt.value', result);
  logger.info({ message: 'converted watt for item' });
  return result;
});

module.exports = { convertToMS, parseSparsnasWatt };
