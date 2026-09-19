import '@tensorflow/tfjs';
import * as faceDetection from '@tensorflow-models/face-detection';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import {
  featureThresholds,
  eyePhrases,
  nosePhrases,
  mouthPhrases,
  faceShapePhrases,
  titlePool,
  closingLinePool,
  FeatureBin,
} from '@/config/face-reading-phrases';
import { generateCardNumber } from './hash';

export interface FaceReadingPrediction {
  title: string;
  paragraphs: string[];
  cardNumber: string;
  rarityTier: 'common' | 'uncommon' | 'rare';
}

let faceDetectorPromise: Promise<faceDetection.FaceDetector> | null = null;
let landmarksDetectorPromise: Promise<faceLandmarksDetection.FaceLandmarksDetector> | null = null;

function getFaceDetector(): Promise<faceDetection.FaceDetector> {
  if (!faceDetectorPromise) {
    const detectorModel = faceDetection.SupportedModels.MediaPipeFaceDetector;
    faceDetectorPromise = faceDetection.createDetector(detectorModel, {
      runtime: 'tfjs',
    });
  }
  return faceDetectorPromise;
}

function getLandmarksDetector(): Promise<faceLandmarksDetection.FaceLandmarksDetector> {
  if (!landmarksDetectorPromise) {
    const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
    landmarksDetectorPromise = faceLandmarksDetection.createDetector(model, {
      runtime: 'tfjs',
      refineLandmarks: false,
    });
  }
  return landmarksDetectorPromise;
}

function dist(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

function getBin(value: number, threshold: { low: number; high: number }): FeatureBin {
  if (value <= threshold.low) return 'low';
  if (value >= threshold.high) return 'high';
  return 'mid';
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export async function predictFaceReading(imageElement: HTMLImageElement): Promise<FaceReadingPrediction> {
  // 1. 얼굴 위치 탐지 (BlazeFace)
  const faceDetector = await getFaceDetector();
  const faces = await faceDetector.estimateFaces(imageElement);

  if (!faces || faces.length === 0) {
    throw new Error('얼굴을 찾지 못했어요, 다른 사진으로 시도해주세요');
  }

  // 여러 얼굴이 감지되면 바운딩 박스 면적이 가장 큰 것 선택
  let largestFace = faces[0];
  let maxArea = largestFace.box.width * largestFace.box.height;
  for (let i = 1; i < faces.length; i++) {
    const area = faces[i].box.width * faces[i].box.height;
    if (area > maxArea) {
      maxArea = area;
      largestFace = faces[i];
    }
  }

  const box = largestFace.box;
  const imgWidth = imageElement.naturalWidth || imageElement.width;
  const imgHeight = imageElement.naturalHeight || imageElement.height;

  // 사방으로 40%씩 여유를 두고 확장한 크롭 영역 계산 (이미지 경계 clamp)
  const expandX = box.width * 0.4;
  const expandY = box.height * 0.4;

  const cropX = Math.max(0, box.xMin - expandX);
  const cropY = Math.max(0, box.yMin - expandY);
  const cropX2 = Math.min(imgWidth, box.xMin + box.width + expandX);
  const cropY2 = Math.min(imgHeight, box.yMin + box.height + expandY);

  const cropW = Math.max(1, cropX2 - cropX);
  const cropH = Math.max(1, cropY2 - cropY);

  console.log('Face Crop Region:', { cropX, cropY, cropW, cropH });

  // 캔버스에 최소 256x256 이상 크기로 크롭 영역 확대
  const scale = Math.max(1, 256 / Math.min(cropW, cropH));
  const canvasW = Math.round(cropW * scale);
  const canvasH = Math.round(cropH * scale);

  const canvas = document.createElement('canvas');
  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('얼굴을 찾지 못했어요, 다른 사진으로 시도해주세요');
  }
  ctx.drawImage(imageElement, cropX, cropY, cropW, cropH, 0, 0, canvasW, canvasH);

  // 2. 크롭된 캔버스로 FaceMesh 랜드마크 추출
  const landmarksDetector = await getLandmarksDetector();
  const landmarkFaces = await landmarksDetector.estimateFaces(canvas);

  if (!landmarkFaces || landmarkFaces.length === 0) {
    throw new Error('얼굴을 찾지 못했어요, 다른 사진으로 시도해주세요');
  }

  const keypoints = landmarkFaces[0].keypoints;

  // 4개 비율 계산 (MediaPipe FaceMesh 468포인트 기준 통용 인덱스):
  // - 얼굴 너비: keypoints[234] ~ keypoints[454] 사이 거리
  // - 얼굴 높이: keypoints[10] ~ keypoints[152] 사이 거리
  // - 눈 너비: (keypoints[33]~keypoints[133] 거리 + keypoints[362]~keypoints[263] 거리) / 2
  // - 코 길이: keypoints[168] ~ keypoints[4] 사이 거리
  // - 입 너비: keypoints[61] ~ keypoints[291] 사이 거리
  const faceWidth = dist(keypoints[234], keypoints[454]);
  const faceHeight = dist(keypoints[10], keypoints[152]);
  const eyeWidth = (dist(keypoints[33], keypoints[133]) + dist(keypoints[362], keypoints[263])) / 2;
  const noseLength = dist(keypoints[168], keypoints[4]);
  const mouthWidth = dist(keypoints[61], keypoints[291]);

  const eyeWidthRatio = eyeWidth / (faceWidth || 1);
  const noseLengthRatio = noseLength / (faceHeight || 1);
  const mouthWidthRatio = mouthWidth / (faceWidth || 1);
  const faceShapeRatio = faceWidth / (faceHeight || 1);

  console.log('Face Reading Ratios:', {
    eyeWidthRatio,
    noseLengthRatio,
    mouthWidthRatio,
    faceShapeRatio,
  });

  const eyeBin = getBin(eyeWidthRatio, featureThresholds.eyeWidthRatio);
  const noseBin = getBin(noseLengthRatio, featureThresholds.noseLengthRatio);
  const mouthBin = getBin(mouthWidthRatio, featureThresholds.mouthWidthRatio);
  const faceShapeBin = getBin(faceShapeRatio, featureThresholds.faceShapeRatio);

  const paragraphs = [
    eyePhrases[eyeBin].sentence,
    nosePhrases[noseBin].sentence,
    mouthPhrases[mouthBin].sentence,
    faceShapePhrases[faceShapeBin].sentence,
  ];

  const binCombination = `${eyeBin}-${noseBin}-${mouthBin}-${faceShapeBin}`;
  const comboHash = hashString(binCombination);

  const title = titlePool[comboHash % titlePool.length];
  const closingLine = closingLinePool[(comboHash >> 2) % closingLinePool.length];
  paragraphs.push(closingLine);

  const cardNumber = generateCardNumber(imageElement);

  const nonMidCount = [eyeBin, noseBin, mouthBin, faceShapeBin].filter((b) => b !== 'mid').length;
  let rarityTier: 'common' | 'uncommon' | 'rare' = 'common';
  if (nonMidCount >= 3) {
    rarityTier = 'rare';
  } else if (nonMidCount === 2) {
    rarityTier = 'uncommon';
  }

  return {
    title,
    paragraphs,
    cardNumber,
    rarityTier,
  };
}
