import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const EVENT_NAME = 'onSnapper';
const { ScreenGuard } = NativeModules;
var screenGuardEmitter: any = new NativeEventEmitter(ScreenGuard);
export default {
  /**
   * activate screenshot blocking (iOS13+, Android 5+)
   * @param string capturedBackgroundColor (iOS only) background color layout after taking a screenshot
   * @param void callback callback after a screenshot has been taken
   */
  register(
    capturedBackgroundColor: String | null,
    callback: (arg0: any) => void
  ) {
    if (Platform.OS === 'ios') {
      let currentColor: String =
        capturedBackgroundColor == null ||
        capturedBackgroundColor.trim().length === 0 ||
        !capturedBackgroundColor.startsWith('#')
          ? '#000000'
          : capturedBackgroundColor;
      ScreenGuard.activateShield(currentColor);
    } else {
      ScreenGuard.activateShield();
    }
    const _callback = (res: any) => {
      callback(res);
    };
    screenGuardEmitter.addListener(EVENT_NAME, _callback);
  },

  /**
   * Deactivate screenshot
   */
  unregister() {
    // screenGuardEmitter.removeListener(EVENT_NAME);
    ScreenGuard.deactivateShield();
    const listenerCount = screenGuardEmitter.listenerCount(EVENT_NAME);
    if (!listenerCount) {
      screenGuardEmitter.removeEvent();
    }
  },
};
