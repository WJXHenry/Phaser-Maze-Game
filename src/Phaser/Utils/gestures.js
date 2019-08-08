/**
 * @enum {Gesture}
 */
export const GESTURES = {
  SWIPE_RIGHT: 0,
  SWIPE_LEFT: 1,
  SWIPE_UP: 2,
  SWIPE_DOWN: 3,
  SINGLE_TAP: 4,
  DOUBLE_TAP: 5, // Not sure if this can be implemented here (maybe separately)
  TP_SWIPE_RIGHT: 6, // TP = Two Pointer... (WIP)
  NONE_DETECTED: 7
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
    // TODO: change the detectGesture function to base it on speed of swipe (once Phaser has its new release)
    callback(detectGestureNoTime(pointer, options));
  });
}

function detectGesture(pointer, options) {
  let swipeThreshold = options.swipeThreshold || 100;
  let deltaTime = pointer.getDuration();
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
  return GESTURES.SINGLE_TAP;
}

// Swipe gestures without using time (speed/velocity)
function detectGestureNoTime(pointer, options) {
  let swipeThreshold = options.swipeThreshold || 50;
  let displacementX = pointer.upX - pointer.downX;
  let displacementY = pointer.upY - pointer.downY;
  let distanceX = Math.abs(displacementX);
  let distanceY = Math.abs(displacementY);
  if (distanceX > distanceY && distanceX > swipeThreshold) {
    if (displacementX < 0) {
      return GESTURES.SWIPE_LEFT;
    } else {
      return GESTURES.SWIPE_RIGHT;
    }
  } else if (distanceY > distanceX && distanceY > swipeThreshold) {
    if (displacementY < 0) {
      return GESTURES.SWIPE_UP;
    } else {
      return GESTURES.SWIPE_DOWN;
    }
  }
  return GESTURES.SINGLE_TAP;
}
