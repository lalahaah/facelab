import { load, CustomMobileNet } from '@teachablemachine/image';
import { generateCardNumber } from './hash';

export interface AgePrediction {
  label: string;
  accuracy: number;
  cardNumber: string;
  stats: { label: string; value: number }[];
  rarityTier: 'common' | 'uncommon' | 'rare';
  rarityText: string;
}

let modelPromise: Promise<CustomMobileNet> | null = null;

function getModel(): Promise<CustomMobileNet> {
  if (!modelPromise) {
    const modelURL = '/models/age-estimate/model.json';
    const metadataURL = '/models/age-estimate/metadata.json';
    modelPromise = load(modelURL, metadataURL);
  }
  return modelPromise;
}

export async function predictAge(imageElement: HTMLImageElement): Promise<AgePrediction> {
  const model = await getModel();
  const predictions = await model.predict(imageElement);

  // 확률 내림차순 정렬
  const sorted = [...predictions].sort((a, b) => b.probability - a.probability);

  const top = sorted[0];
  const label = top ? top.className : '알 수 없음';
  const accuracy = top ? Math.round(top.probability * 100) : 0;

  const stats = sorted.map((p) => ({
    label: p.className,
    value: Math.round(p.probability * 100),
  }));

  const cardNumber = generateCardNumber(imageElement);

  let rarityTier: 'common' | 'uncommon' | 'rare' = 'common';
  if (accuracy >= 80) {
    rarityTier = 'rare';
  } else if (accuracy >= 55) {
    rarityTier = 'uncommon';
  }

  const rarityText = `분석 신뢰도 ${accuracy}%`;

  return {
    label,
    accuracy,
    cardNumber,
    stats,
    rarityTier,
    rarityText,
  };
}
