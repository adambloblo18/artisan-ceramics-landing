export const HERO_VIDEO_DELAY_MS = 2000;

export function canLoadHeroVideo(options: {
  width: number;
  reducedMotion: boolean;
  saveData: boolean;
}) {
  return options.width >= 768 && !options.reducedMotion && !options.saveData;
}