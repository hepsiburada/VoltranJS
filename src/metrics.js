/* istanbul ignore file */
import prom from 'prom-client';

const suffix = process.env.NODE_ENV === 'production' ? '' : `_${Date.now()}`;

export default {
  fragmentRequestDurationMicroseconds: new prom.Histogram({
    name: `fragment_request_duration_ms${suffix}`,
    help: 'Duration of fragment requests in ms',
    labelNames: ['name', 'without_html'],
    buckets: [5, 25, 50, 75, 100]
  })
};
