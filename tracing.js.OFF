/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
/* eslint-disable max-len */

/* tracing.js */

const OTLP_URL = process.env.OTLP_URL || 'http://otlp-collector-ds.home';
console.log('OTLP endpoint:', OTLP_URL);

const opentelemetry = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-proto');
const { Resource } = require('@opentelemetry/resources');
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-proto');
const { PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { containerDetector } = require('@opentelemetry/resource-detector-container');

const {
  envDetector, hostDetector, osDetector, processDetector,
} = require('@opentelemetry/resources');
// If you want console DEBUG logging, otherwise comment out
// const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');
// diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const sdk = new opentelemetry.NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'mqtt-to-blynk-weather',
  }),
  traceExporter: new OTLPTraceExporter({
    url: `${OTLP_URL}/v1/traces`,
  }),
  instrumentations: [
    getNodeAutoInstrumentations({
      // only instrument fs if it is part of another trace
      '@opentelemetry/instrumentation-fs': {
        requireParentSpan: true,
      },
    }),
  ],
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: `${OTLP_URL}/v1/metrics`,
    }),
  }),
  resourceDetectors: [
    containerDetector,
    envDetector,
    hostDetector,
    osDetector,
    processDetector,
  ],
});

sdk.start();

// CMD [ "node", "-r", "./tracing.js", "app.js"]
// npm i @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node @opentelemetry/exporter-trace-otlp-proto @opentelemetry/resources @opentelemetry/semantic-conventions @opentelemetry/resource-detector-container @opentelemetry/resources @opentelemetry/api
// https://github.com/open-telemetry/opentelemetry-demo/blob/main/src/paymentservice/opentelemetry.js
