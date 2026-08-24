import { StyleSheet, Platform } from 'react-native';
import { colors } from '../../theme/colors';
import {
  horizontalScale,
  verticalScale,
  moderateScale,
  width,
  height,
} from '../../theme/Metrics';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  feedItem: {
    width: width,
    height: height,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgImage: {
    ...StyleSheet.absoluteFill,
    width: width,
    height: height,
    resizeMode: 'cover',
  },
  bgOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  // Floating AR Video / Image Box
  arCardContainer: {
    width: width * 0.85,
    height: verticalScale(210),
    borderRadius: moderateScale(4),
    borderWidth: moderateScale(1.5),
    borderColor: 'rgba(255, 255, 255, 0.6)',
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
    backgroundColor: '#111',
    marginTop: -verticalScale(60), // offset slightly upwards like in screenshot
  },
  arVideoFrame: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  // Overlay Controls
  overlayContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'flex-end',
    paddingBottom: Platform.OS === 'ios' ? verticalScale(90) : verticalScale(74),
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: horizontalScale(16),
  },
  // Profile Section (Bottom Left)
  profileSection: {
    flex: 1,
    marginRight: horizontalScale(16),
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  avatarContainer: {
    width: moderateScale(38),
    height: moderateScale(38),
    borderRadius: moderateScale(19),
    backgroundColor: colors.badgeRed,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: moderateScale(1.5),
    borderColor: colors.white,
    marginRight: horizontalScale(10),
  },
  avatarEmblem: {
    width: moderateScale(22),
    height: moderateScale(22),
    alignItems: 'center',
    justifyContent: 'center',
  },
  creatorName: {
    color: colors.white,
    fontSize: moderateScale(15),
    fontWeight: '700',
    marginRight: horizontalScale(10),
    textShadowColor: colors.overlayShadow,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: moderateScale(4),
  },
  followButton: {
    paddingHorizontal: horizontalScale(14),
    paddingVertical: verticalScale(5),
    borderRadius: moderateScale(6),
    borderWidth: moderateScale(1.2),
    borderColor: colors.white,
    backgroundColor: 'transparent',
  },
  followButtonActive: {
    backgroundColor: colors.white,
    borderColor: colors.white,
  },
  followButtonText: {
    color: colors.white,
    fontSize: moderateScale(12),
    fontWeight: '700',
  },
  followButtonTextActive: {
    color: colors.black,
    fontWeight: '700',
  },
  captionText: {
    color: colors.white,
    fontSize: moderateScale(15),
    fontWeight: '500',
    marginTop: verticalScale(2),
    textShadowColor: colors.overlayShadow,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: moderateScale(4),
  },
  // Right Action Bar
  actionColumn: {
    alignItems: 'center',
    gap: verticalScale(18),
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconContainer: {
    width: moderateScale(42),
    height: moderateScale(42),
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionCount: {
    color: colors.white,
    fontSize: moderateScale(11),
    fontWeight: '600',
    marginTop: verticalScale(2),
    textShadowColor: colors.overlayShadow,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: moderateScale(2),
  },
});
