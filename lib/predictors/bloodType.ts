export function predictBloodType(imageElement: HTMLImageElement): { label: string; accuracy: number } {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    return { label: 'A형', accuracy: 80 }; // Fallback
  }

  // Draw image to 32x32 to get a low-res pixel map
  ctx.drawImage(imageElement, 0, 0, 32, 32);
  const imageData = ctx.getImageData(0, 0, 32, 32).data;

  // FNV-1a Hash (32-bit)
  let hash1 = 2166136261;
  let hash2 = 1469598103;

  for (let i = 0; i < imageData.length; i++) {
    const byte = imageData[i];
    
    hash1 ^= byte;
    hash1 = Math.imul(hash1, 16777619);
    
    hash2 ^= byte;
    hash2 = Math.imul(hash2, 0x5bd1e995);
  }

  // Ensure positive modulo
  const score1 = Math.abs(hash1) % 100;
  
  let label = '';
  if (score1 <= 33) {
    label = 'A형';       // 34%
  } else if (score1 <= 60) {
    label = 'O형';       // 27%
  } else if (score1 <= 89) {
    label = 'B형';       // 29%
  } else {
    label = 'AB형';      // 10%
  }

  // Deterministic accuracy between 70 and 94
  const accuracy = 70 + (Math.abs(hash2) % 25);

  return { label, accuracy };
}
