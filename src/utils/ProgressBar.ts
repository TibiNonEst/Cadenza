export default async (value: number, maxValue: number, size: number): Promise<string> => {
  const percentage = value / maxValue;
  const progress = Math.round(size * percentage);
  const emptyProgress = size - progress;

  const progressText = '▇'.repeat(progress);
  const emptyProgressText = '—'.repeat(emptyProgress);

  return progressText + emptyProgressText;
};
