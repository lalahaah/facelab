// config/face-reading-phrases.ts
// 관상 리포트 문구뱅크 — 랜드마크 비율값을 성격 서술로 변환하는 데 쓰이는 콘텐츠 데이터.
// 과학적 근거 없는 재미 콘텐츠. lib/predictors/faceReading.ts에서 이 데이터를 사용해
// 실제 랜드마크 비율을 bin으로 분류하고 문장을 조합한다.

export type FeatureBin = 'low' | 'mid' | 'high';

export interface FeatureThreshold {
  low: number; // 이 값 이하면 'low'
  high: number; // 이 값 이상이면 'high', 그 사이는 'mid'
}

// 랜드마크로 계산한 비율값의 구간 경계.
// MVP 단계 추정치 — 실 사용자 테스트 후 조정 필요할 수 있음 (나이 측정 모델처럼).
export const featureThresholds: Record<string, FeatureThreshold> = {
  eyeWidthRatio: { low: 0.22, high: 0.27 },
  noseLengthRatio: { low: 0.28, high: 0.33 },
  mouthWidthRatio: { low: 0.40, high: 0.46 },
  faceShapeRatio: { low: 0.70, high: 0.80 },
};

export interface PhraseEntry {
  trait: string; // 짧은 특징 라벨 (타이틀 조합용)
  sentence: string; // 결과 문단에 들어갈 실제 문장
}

export const eyePhrases: Record<FeatureBin, PhraseEntry> = {
  low: {
    trait: '또렷한 눈매',
    sentence:
      '또렷하고 집중력 있는 눈매를 가지셨네요. 한 번 마음먹은 일은 끝까지 해내는 뚝심이 느껴져요.',
  },
  mid: {
    trait: '균형 잡힌 눈매',
    sentence:
      '균형 잡힌 눈매가 인상적이에요. 상황을 침착하게 파악하는 관찰력이 있는 타입이에요.',
  },
  high: {
    trait: '크고 시원한 눈매',
    sentence:
      '크고 시원한 눈매를 가지셨어요. 표현력이 풍부하고 사람들과 잘 어울리는 성향이 엿보여요.',
  },
};

export const nosePhrases: Record<FeatureBin, PhraseEntry> = {
  low: {
    trait: '아담한 코',
    sentence:
      '아담하고 부드러운 코 라인이에요. 친근하고 다가가기 편한 인상을 주는 타입이에요.',
  },
  mid: {
    trait: '균형 잡힌 코',
    sentence: '균형 잡힌 콧대가 안정감을 줘요. 무슨 일이든 무난하게 잘 풀어가는 편이에요.',
  },
  high: {
    trait: '오뚝한 코',
    sentence:
      '오뚝하고 곧은 콧대를 가지셨어요. 목표 의식이 뚜렷하고 자기 주관이 확실한 타입으로 보여요.',
  },
};

export const mouthPhrases: Record<FeatureBin, PhraseEntry> = {
  low: {
    trait: '야무진 입매',
    sentence:
      '야무지고 단정한 입매예요. 말보다 행동으로 보여주는, 신중한 성격일 가능성이 높아요.',
  },
  mid: {
    trait: '부드러운 입매',
    sentence: '부드러운 입매가 편안한 인상을 줘요. 주변 사람을 잘 챙기는 다정한 타입으로 보여요.',
  },
  high: {
    trait: '시원시원한 입매',
    sentence:
      '시원시원한 입매를 가지셨네요. 활발하고 사교적인, 분위기 메이커 기질이 느껴져요.',
  },
};

export const faceShapePhrases: Record<FeatureBin, PhraseEntry> = {
  low: {
    trait: '갸름한 얼굴형',
    sentence: '갸름하고 세련된 얼굴형이에요. 냉철하고 논리적인 사고를 하는 편일 것 같아요.',
  },
  mid: {
    trait: '균형 잡힌 얼굴형',
    sentence: '균형 잡힌 계란형 얼굴이에요. 어디서든 무난하게 잘 적응하는 밸런스형이에요.',
  },
  high: {
    trait: '동글동글한 얼굴형',
    sentence:
      '동글동글하고 온화한 얼굴형이에요. 사람 좋다는 소리 자주 듣는, 편안한 매력의 소유자예요.',
  },
};

// 타이틀 후보 — 특징 조합 해시로 결정론적으로 하나 선택됨
export const titlePool: string[] = [
  '지적인 상',
  '온화한 상',
  '카리스마 상',
  '친근한 상',
  '우아한 상',
  '쾌활한 상',
  '신비로운 상',
  '다정한 상',
];

// 마무리 멘트 후보 — 해시로 결정론적 선택
export const closingLinePool: string[] = [
  '오늘 하루도 당신다운 하루 되시길 바랄게요 ☺️',
  '이 관상, 어디까지나 재미로 봐주세요 — 진짜 매력은 직접 만나봐야 아는 법이니까요 😉',
  '사진 속 그 표정, 딱 지금 기분이 담겨있는 것 같아요 📸',
  '오늘의 표본은 여기까지! 다음에 또 다른 표정으로 만나요 🔬',
];
