const express = require('express');
const client = require('prom-client');

const app = express();
const port = 3005;

// Create a Prometheus registry
const register = new client.Registry();

// Collect default system metrics
client.collectDefaultMetrics({ register });

// Define a custom counter metric
const helloCounter = new client.Counter({
  name: 'api_hello_called_total',
  help: 'Total number of times the /hello endpoint was called',
});
register.registerMetric(helloCounter);

// API route
app.get('/hello', (req, res) => {
  helloCounter.inc(); // Increment the counter
  res.send('Hello from Express with Prometheus!');
});

// Metrics route (Prometheus will scrape this)
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.listen(port, () => {
  console.log(`🚀 App running on http://localhost:${port}`);
});

