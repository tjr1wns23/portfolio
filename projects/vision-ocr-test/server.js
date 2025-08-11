const express = require('express');
const multer = require('multer');
const vision = require('@google-cloud/vision');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());

app.use(express.static('public'));

const upload = multer({ dest: 'uploads/' });

const client = new vision.ImageAnnotatorClient({
  keyFilename: './vision-key.json',
});

app.post('/api/ocr', upload.single('image'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const [result] = await client.textDetection(filePath);
    fs.unlinkSync(filePath); // 업로드된 이미지 파일 삭제
    const detections = result.textAnnotations;
    res.json({ text: detections[0]?.description || '' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
