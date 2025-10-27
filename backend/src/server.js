require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.post('/api/interrogator/analyze', async (req, res) => {
  const base = process.env.INTERROGATOR_URL;
  if (!base) {
    return res.status(500).json({ error: 'INTERROGATOR_URL not configured' });
  }
  const url = base.replace(/\/+$/,'') + '/interrogator/analyze';
  try {
    const axiosRes = await axios.post(url, req.body, {
      headers: { 'Content-Type': 'application/json' },
      validateStatus: () => true
    });
    const contentType = (axiosRes.headers && axiosRes.headers['content-type']) || '';
    if (contentType.includes('application/json')) {
      res.status(axiosRes.status).json(axiosRes.data);
    } else {
      res.status(axiosRes.status).send(axiosRes.data);
    }
  } catch (err) {
    console.error('Interrogator proxy error', err);
    if (err.response) {
      const contentType = (err.response.headers && err.response.headers['content-type']) || '';
      if (contentType.includes('application/json')) {
        return res.status(err.response.status).json(err.response.data);
      }
      return res.status(err.response.status).send(err.response.data);
    }
    res.status(500).json({ error: err.message || 'Proxy error' });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'ServiceDeskAI backend is running' });
});

app.listen(port, () => {
  console.log(`ServiceDeskAI backend listening on port ${port}`);
});
