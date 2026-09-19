import { getImageHashes } from './hash';

export interface BloodTypePrediction {
  label: string;
  accuracy: number;
  rarityText: string;
  cardNumber: string;
  rarityTier: 'common' | 'uncommon' | 'rare';
  stats: { label: string; value: number }[];
}

export function predictBloodType(imageElement: HTMLImageElement): BloodTypePrediction {
  const fallback: BloodTypePrediction = {
    label: 'A형',
    accuracy: 80,
    rarityText: '전체의 34%, 가장 균형 잡힌 표준형',
    cardNumber: '0000',
    rarityTier: 'common',
    stats: [
      { label: '꼼꼼함', value: 85 },
      { label: '책임감', value: 90 },
      { label: '신중함', value: 75 },
    ],
  };

  const hashes = getImageHashes(imageElement);
  if (!hashes) return fallback;

  const { hash1, hash2, cardNumber } = hashes;

  const score1 = Math.abs(hash1) % 100;
  
  let label = '';
  let rarityText = '';
  let rarityTier: 'common' | 'uncommon' | 'rare' = 'common';
  let statLabels: [string, string, string] = ['', '', ''];

  if (score1 <= 33) {
    label = 'A형';
    rarityText = '전체의 34%, 가장 균형 잡힌 표준형';
    rarityTier = 'common';
    statLabels = ['꼼꼼함', '책임감', '신중함'];
  } else if (score1 <= 60) {
    label = 'O형';
    rarityText = '전체의 27%, 리더십 강한 타입으로 꼽혀요';
    rarityTier = 'common';
    statLabels = ['리더십', '사교성', '추진력'];
  } else if (score1 <= 89) {
    label = 'B형';
    rarityText = '전체의 29%, 개성 강한 타입으로 알려져 있어요';
    rarityTier = 'uncommon';
    statLabels = ['자유로움', '열정', '창의력'];
  } else {
    label = 'AB형';
    rarityText = '전체의 10%만 가진 희귀한 타입';
    rarityTier = 'rare';
    statLabels = ['직관력', '다재다능', '독창성'];
  }

  const accuracy = 70 + (Math.abs(hash2) % 25);
  
  const stats = [
    { label: statLabels[0], value: 40 + (Math.abs(hash2) % 59) },
    { label: statLabels[1], value: 40 + (Math.abs(Math.imul(hash2, 31)) % 59) },
    { label: statLabels[2], value: 40 + (Math.abs(Math.imul(hash2, 17)) % 59) },
  ];

  return { label, accuracy, rarityText, cardNumber, rarityTier, stats };
}
