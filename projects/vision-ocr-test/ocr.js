// ocr.js
const vision = require('@google-cloud/vision');

// Google Vision API 클라이언트 생성
const client = new vision.ImageAnnotatorClient({
  keyFilename: 'vision-key.json',
});

async function runOCR(imagePath) {
  try {
    const [result] = await client.textDetection(imagePath);
    const detections = result.textAnnotations;
    if (detections.length > 0) {
      console.log('추출된 텍스트:\n', detections[0].description);
    } else {
      console.log('텍스트를 찾을 수 없습니다.');
    }
  } catch (error) {
    console.error('OCR 수행 중 오류 발생:', error);
  }
}

// 예: 이미지 경로를 커맨드 라인 인수로 받아 실행
const imagePath = process.argv[2];
if (!imagePath) {
  console.error('사용법: node ocr.js <이미지_경로>');
  process.exit(1);
}

runOCR(imagePath);
