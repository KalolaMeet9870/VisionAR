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
  headerContainer: {
    paddingHorizontal: moderateScale(16),
    paddingTop: Platform.OS === 'ios' ? verticalScale(50) : verticalScale(16),
    paddingBottom: verticalScale(12),
    backgroundColor: colors.white,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.searchBarBg,
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(12),
    height: verticalScale(44),
  },
  searchIcon: {
    marginRight: moderateScale(8),
  },
  searchInput: {
    flex: 1,
    fontSize: moderateScale(15),
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  clearButton: {
    padding: moderateScale(4),
  },
  scrollContent: {
    paddingBottom: verticalScale(90), // Space for floating bottom tab bar
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    marginTop: verticalScale(18),
    marginBottom: verticalScale(14),
  },
  sectionIcon: {
    marginRight: moderateScale(8),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: colors.textPrimary,
  },
  artistsListContent: {
    paddingHorizontal: moderateScale(16),
    paddingBottom: verticalScale(8),
  },
  artistCard: {
    alignItems: 'center',
    marginRight: moderateScale(16),
    width: moderateScale(104),
  },
  artistAvatarContainer: {
    width: moderateScale(90),
    height: moderateScale(90),
    borderRadius: moderateScale(45),
    borderWidth: 2,
    borderColor: colors.black,
    overflow: 'hidden',
    backgroundColor: colors.gray.six,
  },
  artistAvatar: {
    width: '100%',
    height: '100%',
  },
  artistName: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: verticalScale(8),
    lineHeight: moderateScale(16),
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    width: GRID_ITEM_SIZE,
    height: GRID_ITEM_SIZE,
    padding: GRID_SPACING / 2,
  },
  gridImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.gray.six,
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
