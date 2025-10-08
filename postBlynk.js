const axios = require('axios');
const logger = require('./logger/logger');
/**
 * Post data to Blynk
 * @param {String} url Blynk URL to post to
 * @returns true or err
 */
const postBlynk = async (url, pin, value) => {
  try {
    const resp = await axios.get(url, { method: 'GET' });
    logger.info({
      message: 'Posted to blynk', pin, value, response_status: resp.status,
    });
    return true;
  } catch (err) {
    logger.error({ message: err.message });
    return err;
  }
};

module.exports = { postBlynk };
