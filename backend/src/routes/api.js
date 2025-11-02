const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { join } = require('path');
const axios = require('axios');
const FormData = require('form-data');

const router = express.Router();

const uploadDir = join(__dirname, '..', 'uploads');
try { fs.mkdirSync(uploadDir, { recursive: true }); } catch (e) { }

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const safeName = file.originalname.replace(/\s+/g, '_');
    cb(null, `${unique}-${safeName}`);
  }
});

const upload = multer({ storage });

router.post('/analyze', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }

  const form = new FormData();
  form.append('image', fs.createReadStream(req.file.path));

  const baseUrl = process.env.INTERROGATOR_BASE_URL;
  if (!baseUrl) return res.status(500).json({ error: 'Interrogator base URL not configured' });
  const target = `${baseUrl.replace(/\/$/, '')}/interrogator/analyze`;

  const headers = Object.assign({}, form.getHeaders());
  if (process.env.INTERROGATOR_API_KEY) {
    headers['x-api-key'] = process.env.INTERROGATOR_API_KEY;
  }

  try {
    const response = await axios.post(target, form, {
      headers,
      maxBodyLength: Infinity,
      timeout: 30000
    });
    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error analyzing image:', error?.response?.data || error.message || error);
    const status = error?.response?.status || 502;
    const data = error?.response?.data || { error: 'Failed to analyze image' };
    return res.status(status).json(data);
  }
});

module.exports = router;
