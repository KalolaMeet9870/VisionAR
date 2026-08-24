import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const isTablet = Math.min(width, height) >= 600;
const factor = isTablet ? 0.65 : 0.5;

const fontScale = PixelRatio.getFontScale();
const allowScaling = fontScale > 1;
const maxFontSize = Math.min(fontScale, 1.2);

const horizontalScale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
const moderateScale = (size: number) =>
  size + (horizontalScale(size) - size) * factor;

const GlobalMetrics = {
  isAndroid: Platform.OS === 'android',
  isIos: Platform.OS === 'ios',
  isPad: Platform.OS === 'ios' && Platform.isPad,
  isTV: Platform.isTV,
};

export {
  GlobalMetrics,
  height,
  horizontalScale,
  moderateScale,
  verticalScale,
  width,
  allowScaling,
  maxFontSize,
};
