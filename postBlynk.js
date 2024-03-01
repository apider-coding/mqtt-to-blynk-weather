/* eslint-disable import/no-unresolved */
/* eslint-disable no-console */
// const fetch = require('node-fetch');
const axios = require('axios');
// const { trace } = require('@opentelemetry/api');
const logger = require('./logger/logger');
/**
 * Post data to Blynk
 * @param {String} url Blynk URL to post to
 * @returns true or err
 */
const postBlynk = async (url) => {
  try {
    const resp = await axios.get(url, { method: 'GET' });
    // For fetch need to check resp.ok
    // if (!resp.ok) {
    //   throw Error(resp);
    // }
    logger.info({ message: 'Posted to blynk', url, response_status: resp.status });
    return true;
  } catch (err) {
    logger.error({ message: err.message });
    // logger.error('This is a error message'); // A message could be logged like this as well
    return err;
  }
};

module.exports = { postBlynk };
