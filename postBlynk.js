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
    logger.error({ message: `Failed to post to Blynk: ${err.message}` });
    // Throw the error so the calling function's catch block can handle it
    throw err;
  }
};

module.exports = { postBlynk };
