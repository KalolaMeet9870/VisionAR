import { moderateScale } from './Metrics';
import { FontFamily } from '../assets/fonts';

export const Typography = {
  heading: {
    fontFamily: FontFamily.outfitBold,
    fontSize: moderateScale(22),
  },
  body: {
    fontFamily: FontFamily.outfitRegular,
    fontSize: moderateScale(14),
  },
  medium: {
    fontFamily: FontFamily.outfitMedium,
    fontSize: moderateScale(16),
  },
  caption: {
    fontFamily: FontFamily.outfitRegular,
    fontSize: moderateScale(12),
  },
};
