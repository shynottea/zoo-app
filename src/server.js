const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'build')));

const publicVapidKey = 'BJlXprab7YxbZfCCAmlOb3Nw1rcD-6wDHLCHWS6hze_43aB3zoJPMKUX7QcmQMGVZd_AvFZ4JfgGTHvwIIZOR7o';
const privateVapidKey = 'iCgMnlEa1-4uvzdVB9HwwgW04LaBtIircGRO0edVdWc';

webpush.setVapidDetails('mailto:you@example.com', publicVapidKey, privateVapidKey);

app.post('/subscribe', (req, res) => {
  const subscription = req.body;

  const payload = JSON.stringify({ title: 'Test Notification', body: 'This is a test.' });

  webpush.sendNotification(subscription, payload).catch((err) => console.error(err));

  res.status(201).json({});
});

const port = 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
