const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const baseUrl = process.env.INTERROGATOR_BASE_URL;
    if (!baseUrl) return res.status(500).json({ error: 'Interrogator base URL not configured' });

    const target = `${baseUrl.replace(/\/$/, '')}/interrogator/analyze`;

    const form = new FormData();
    form.append('image', req.file.buffer, { filename: req.file.originalname, contentType: req.file.mimetype });

    const headers = form.getHeaders();
    if (process.env.INTERROGATOR_API_KEY) {
      headers['x-api-key'] = process.env.INTERROGATOR_API_KEY;
    }

    const resp = await axios.post(target, form, { headers, maxBodyLength: Infinity });

    return res.status(resp.status).json(resp.data);
  } catch (err) {
    console.error('Interrogator error:', err?.response?.data || err.message || err);
    const status = err?.response?.status || 500;
    const data = err?.response?.data || { error: 'Interrogator request failed' };
    return res.status(status).json(data);
  }
});

module.exports = router;
