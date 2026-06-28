export const FRAME_DIRECTORY = "/images/homepage/redback parallax";
export const FIRST_FRAME = 72;
export const FRAME_COUNT = 26;
export const SEQUENCE_COMPLETE_AT = 0.78;
export const SCROLL_SMOOTHING = 0.14;

// The Redback sequence lives in /images/homepage/redback parallax. Update
// FIRST_FRAME and FRAME_COUNT when frames are added or removed. Current frames
// run from 0072.png through 0097.png after the latest frame cleanup.
export const redbackFrames = Array.from({ length: FRAME_COUNT }, (_, index) => {
  const frameNumber = String(FIRST_FRAME + index).padStart(4, "0");
  return `${FRAME_DIRECTORY}/${frameNumber}.png`;
});
