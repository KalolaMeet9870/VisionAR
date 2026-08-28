import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colors } from '../../theme/colors';
import { moderateScale, verticalScale } from '../../theme/Metrics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_SPACING = moderateScale(2);
const COLUMN_COUNT = 3;
export const GRID_ITEM_SIZE = (SCREEN_WIDTH - GRID_SPACING * (COLUMN_COUNT - 1)) / COLUMN_COUNT;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
    paddingTop: Platform.OS === 'ios' ? verticalScale(50) : verticalScale(16),
    paddingBottom: verticalScale(14),
    backgroundColor: colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.iconBoxBorder,
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: moderateScale(12),
  },
  backButton: {
    padding: moderateScale(4),
    marginRight: moderateScale(10),
  },
  headerTitle: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
  },
  reportButton: {
    width: moderateScale(38),
    height: moderateScale(38),
    borderRadius: moderateScale(8),
    backgroundColor: colors.flagBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: verticalScale(90),
  },
  avatarContainer: {
    alignSelf: 'center',
    marginTop: verticalScale(20),
    marginBottom: verticalScale(16),
  },
  avatarImage: {
    width: moderateScale(96),
    height: moderateScale(96),
    borderRadius: moderateScale(48),
    backgroundColor: colors.gray.six,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(16),
  },
  statBox: {
    alignItems: 'center',
    paddingHorizontal: moderateScale(20),
  },
  statNumber: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: moderateScale(13),
    color: colors.textSecondary,
    marginTop: verticalScale(2),
  },
  dividerLine: {
    width: 1,
    height: verticalScale(28),
    backgroundColor: colors.statDivider,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: moderateScale(30),
    marginBottom: verticalScale(18),
  },
  followButton: {
    flex: 1,
    height: verticalScale(42),
    borderRadius: moderateScale(8),
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: moderateScale(240),
  },
  followButtonWithWebsite: {
    marginRight: moderateScale(10),
  },
  followButtonActive: {
    backgroundColor: colors.gray.seven,
  },
  followButtonText: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: colors.white,
  },
  websiteButton: {
    width: moderateScale(42),
    height: moderateScale(42),
    borderRadius: moderateScale(8),
    backgroundColor: colors.iconBoxBg,
    borderWidth: 1,
    borderColor: colors.iconBoxBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bioContainer: {
    paddingHorizontal: moderateScale(24),
    marginBottom: verticalScale(20),
  },
  bioText: {
    fontSize: moderateScale(14),
    color: colors.bioText,
    lineHeight: moderateScale(20),
    textAlign: 'center',
  },
  showMoreButton: {
    marginTop: verticalScale(8),
    alignSelf: 'center',
  },
  showMoreText: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: colors.textPrimary,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.iconBoxBorder,
    marginBottom: verticalScale(4),
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(12),
  },
  tabIcon: {
    marginRight: moderateScale(6),
  },
  tabText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.textPrimary,
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2.5,
    backgroundColor: colors.activeIndicator,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    width: GRID_ITEM_SIZE,
    height: GRID_ITEM_SIZE,
    padding: GRID_SPACING / 2,
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.gray.six,
  },
  likeBadge: {
    position: 'absolute',
    bottom: moderateScale(6),
    left: moderateScale(6),
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCountText: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: colors.white,
    marginLeft: moderateScale(4),
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(40),
  },
  emptyText: {
    fontSize: moderateScale(14),
    color: colors.textSecondary,
  },
});
