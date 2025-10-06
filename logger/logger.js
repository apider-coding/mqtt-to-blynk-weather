/* eslint-disable import/no-extraneous-dependencies */

const winston = require('winston');

// const logger = winston.createLogger({
//   // level: 'debug',
//   transports: [
//     new winston.transports.Console({
//       format: winston.format.combine(),
//     })],
// });

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console(),
  ],
});

// const logger = winston.createLogger({
//   level: 'debug',
//   transports: [
//     new winston.transports.Console({
//       format: winston.format.combine(
//         winston.format.timestamp(),
//         winston.format.json(),
//       ),
//       // format: winston.format.combine(
//       //   winston.format.timestamp(),
//       //   winston.format.splat(),
//       //   winston.format.simple(),
//       // ),
//     })],
// });

module.exports = logger;
