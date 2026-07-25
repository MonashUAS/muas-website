/** Circular adjacency for carousel prefetch (wraps at ends). */
export function isCircularNear(
  index: number,
  activeIndex: number,
  length: number,
  radius = 1,
): boolean {
  if (length <= 0) {
    return false;
  }

  if (length === 1) {
    return index === activeIndex;
  }

  for (let offset = -radius; offset <= radius; offset += 1) {
    const nearIndex = ((activeIndex + offset) % length + length) % length;
    if (nearIndex === index) {
      return true;
    }
  }

  return false;
}
