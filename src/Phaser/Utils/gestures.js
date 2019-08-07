/**
 * @enum {Gesture}
 */
export const GESTURES = {
  SWIPE_RIGHT: 0,
  SWIPE_LEFT: 1,
  SWIPE_UP: 2,
  SWIPE_DOWN: 3,
  DOUBLE_TAP: 4, // Not sure if this can be implemented here (maybe separately)
  TP_SWIPE_RIGHT: 5, // TP = Two Pointer... (WIP)
  NONE_DETECTED: 6
};

/**
 * Register input manager for gesture detection
 * @param {Phaser.Input.InputPlugin} inputManager The input manager that handles all input related events
 * @callback callback The callback function that handles the detected gesture
 *  @param {Gesture} gesture The detected gesture
 * @param {Object} options
 * @param {Number} options.swipeThreshold The swipe threshold for the detection
 */
export function gestureDetection(inputManager, callback, options = {}) {
  inputManager.on('pointerup', pointer => {
    callback(detectGesture(pointer, options));
  });
}

function detectGesture(pointer, options) {
  let swipeThreshold = options.swipeThreshold || 0;
  let deltaTime = (pointer.upTime - pointer.downTime) / 1000;
  let velX = (pointer.upX - pointer.downX) / deltaTime;
  let velY = (pointer.upY - pointer.downY) / deltaTime;
  let speedX = Math.abs(velX);
  let speedY = Math.abs(velY);
  if (speedX > speedY && speedX > swipeThreshold) {
    if (velX < 0) {
      return GESTURES.SWIPE_LEFT;
    } else {
      return GESTURES.SWIPE_RIGHT;
    }
  } else if (speedY > speedX && speedY > swipeThreshold) {
    if (velY < 0) {
      return GESTURES.SWIPE_UP;
    } else {
      return GESTURES.SWIPE_DOWN;
    }
  }
  return GESTURES.NONE_DETECTED;
}
