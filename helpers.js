const opentelemetry = require('@opentelemetry/api');
const config = require('config');
const logger = require('./logger/logger');

const tracer = opentelemetry.trace.getTracer(config.get('service.name'));

const convertToMS = (item) => ((Number(item.toString()) * 1000) / 3600).toFixed(1);

/**
 * Function return kilowatt from message in watt
 * @param {*} item Item to be processed
 * @returns {Number} Item converted to kW
 */
const convertToKiloWatt = (item) => tracer.startActiveSpan('convert-watt', (span) => {
  const data = JSON.parse(item);
  const result = (Number(data.watt) / 1000).toFixed(2);
  span.setAttribute('app.kilowatt.value', result);
  logger.info({ message: 'converted to kW' });
  span.end();
  return result;
});

module.exports = { convertToMS, convertToKiloWatt };
