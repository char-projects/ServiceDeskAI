const express = require('express');
const fs = require('fs');
const { join } = require('path');
const router = express.Router();

const uploadDir = join(__dirname, '..', 'uploads');

// List saved uploads
router.get('/uploads', async (req, res) => {
  try {
    const files = await fs.promises.readdir(uploadDir);
    const list = await Promise.all(files.map(async (f) => {
      const st = await fs.promises.stat(join(uploadDir, f));
      return { filename: f, size: st.size, mtime: st.mtime };
    }));
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: 'Could not list uploads', detail: e.message });
  }
});

module.exports = router;
