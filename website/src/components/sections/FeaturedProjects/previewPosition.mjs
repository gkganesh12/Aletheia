export function previewPosition(
  x,
  y,
  width,
  height,
  viewportWidth,
  viewportHeight,
) {
  return {
    left: Math.max(0, Math.min(x + 24, viewportWidth - width - 16)),
    top: Math.max(0, Math.min(y - height / 2, viewportHeight - height - 16)),
  };
}

export function keyboardPreviewPosition(
  width,
  height,
  viewportWidth,
  viewportHeight,
) {
  return {
    left: Math.max(0, viewportWidth - width - 40),
    top: Math.max(
      0,
      Math.min((viewportHeight - height) / 2, viewportHeight - height - 16),
    ),
  };
}
