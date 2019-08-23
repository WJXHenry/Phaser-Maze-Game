/**
 * @typedef {Object} Detection - The detected gesture and its origin
 * @property {Gesture} gesture
 * @property {Object} origin - The position the gesture was initiated
 * @property {Number} origin.x
 * @property {Number} origin.y
 */

/**
 * @typedef {Object} Gesture
 * @property {Number} SWIPE_RIGHT
 * @property {Number} SWIPE_LEFT
 * @property {Number} SWIPE_UP
 * @property {Number} SWIPE_DOWN
 * @property {Number} SINGLE_TAP
 * @property {Number} NONE_DETECTED
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
 * Register input plugin for gesture detection
 * @param {Phaser.Input.InputPlugin} inputPlugin - The input plugin that handles all input related events
 * @callback callback - The callback function that handles the detected gesture
 *  @param {Detection} detection - The detected gesture
 * @param {Object} [options]
 * @param {Number} [options.swipeThreshold] - The swipe threshold for the detection
 */
export function gestureDetection(inputPlugin, callback, options = {}) {
  inputPlugin.on('pointerup', pointer => {
    callback(detectGesture(pointer, options));
  });
}

/**
 * Detects a gesture based on the given Phaser Pointer object
 * @param {Phaser.Input.Pointer} pointer - The Phaser Pointer object
 * @param {Object} [options]
 * @param {Number} [options.swipeThreshold] - The swipe threshold for the detection
 * @returns {Detection}
 */
function detectGesture(pointer, options) {
  let swipeThreshold = options.swipeThreshold || 100;
  let deltaTime = (pointer.upTime - pointer.downTime) / 1000;
  let velX = (pointer.upX - pointer.downX) / deltaTime;
  let velY = (pointer.upY - pointer.downY) / deltaTime;
  let speedX = Math.abs(velX);
  let speedY = Math.abs(velY);
  let origin = {
    x: pointer.downX,
    y: pointer.downY
  };
  if (speedX > speedY && speedX > swipeThreshold) {
    if (velX < 0) {
      return {
        gesture: GESTURES.SWIPE_LEFT,
        origin: origin
      };
    } else {
      return {
        gesture: GESTURES.SWIPE_RIGHT,
        origin: origin
      };
    }
  } else if (speedY > speedX && speedY > swipeThreshold) {
    if (velY < 0) {
      return {
        gesture: GESTURES.SWIPE_UP,
        origin: origin
      };
    } else {
      return {
        gesture: GESTURES.SWIPE_DOWN,
        origin: origin
      };
    }
  }
  return {
    gesture: GESTURES.SINGLE_TAP,
    origin: origin
  };
}

// Swipe gestures without using time (speed/velocity)
// eslint-disable-next-line
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
