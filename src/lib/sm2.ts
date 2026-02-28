/**
 * SM-2 알고리즘 기반 간격 반복
 * quality: 0=Again, 3=Good, 5=Easy
 */
export interface SM2Result {
  interval: number;
  easeFactor: number;
  nextReviewAt: Date;
}

export function calculateSM2(
  quality: number,
  previousInterval: number,
  previousEaseFactor: number
): SM2Result {
  let easeFactor = previousEaseFactor;
  let interval = previousInterval;

  // Again: 1일 후
  if (quality < 3) {
    interval = 1;
  } else {
    // Good or Easy
    if (previousInterval === 0) {
      interval = 1;
    } else if (previousInterval === 1) {
      interval = 6;
    } else {
      interval = Math.round(previousInterval * easeFactor);
    }

    if (quality >= 5) {
      easeFactor = Math.min(3, previousEaseFactor + 0.15);
      interval = Math.round(interval * 1.3);
    } else if (quality >= 3) {
      easeFactor = Math.max(1.3, previousEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
    }
  }

  const nextReviewAt = new Date();
  nextReviewAt.setDate(nextReviewAt.getDate() + interval);
  nextReviewAt.setHours(0, 0, 0, 0);

  return { interval, easeFactor, nextReviewAt };
}
