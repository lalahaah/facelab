export interface ImageHashes {
  hash1: number;
  hash2: number;
  cardNumber: string;
}

export function getImageHashes(imageElement: HTMLImageElement): ImageHashes | null {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return null;

  ctx.drawImage(imageElement, 0, 0, 32, 32);
  const imageData = ctx.getImageData(0, 0, 32, 32).data;

  let hash1 = 2166136261;
  let hash2 = 1469598103;

  for (let i = 0; i < imageData.length; i++) {
    const byte = imageData[i];
    hash1 ^= byte;
    hash1 = Math.imul(hash1, 16777619);
    
    hash2 ^= byte;
    hash2 = Math.imul(hash2, 0x5bd1e995);
  }

  const cardNumber = String(Math.abs(hash1) % 10000).padStart(4, '0');

  return { hash1, hash2, cardNumber };
}

export function generateCardNumber(imageElement: HTMLImageElement): string {
  const hashes = getImageHashes(imageElement);
  return hashes ? hashes.cardNumber : '0000';
}
