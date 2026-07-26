export function getVideoPosterSrc(src: string) {
  return src.replace(/\.[^/.]+$/, "-poster.webp");
}
