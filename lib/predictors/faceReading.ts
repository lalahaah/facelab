import '@tensorflow/tfjs';
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

let detectorPromise: Promise<faceLandmarksDetection.FaceLandmarksDetector> | null = null;

function getDetector(): Promise<faceLandmarksDetection.FaceLandmarksDetector> {
  if (!detectorPromise) {
    const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
    detectorPromise = faceLandmarksDetection.createDetector(model, {
      runtime: 'tfjs',
      refineLandmarks: false,
    });
  }
  return detectorPromise;
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
  const detector = await getDetector();
  const faces = await detector.estimateFaces(imageElement);

  if (!faces || faces.length === 0) {
    throw new Error('얼굴을 찾지 못했어요, 다른 사진으로 시도해주세요');
  }

  const keypoints = faces[0].keypoints;

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
