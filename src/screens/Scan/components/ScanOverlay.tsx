import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from '../ScanStyles';
import { CreatorTarget } from '../ScanController';
import { colors } from '../../../theme/colors';
import { moderateScale } from '../../../theme/Metrics';

interface ScanOverlayProps {
  creatorInfo: CreatorTarget;
  onToggleFollow: () => void;
  onToggleLike: () => void;
  onShare: () => void;
  onReport: () => void;
}

export const ScanOverlay: React.FC<ScanOverlayProps> = ({
  creatorInfo,
  onToggleFollow,
  onToggleLike,
  onShare,
  onReport,
}) => {
  return (
    <View style={styles.mainOverlayContent}>
      {/* Profile & Info Section (Bottom Left) */}
      <View style={styles.profileSection}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <MaterialCommunityIcons
              name="eye-circle-outline"
              size={moderateScale(24)}
              color={colors.white}
            />
          </View>

          <Text style={styles.creatorName} numberOfLines={1}>
            {creatorInfo.creatorName}
          </Text>

          <TouchableOpacity
            style={[
              styles.followButton,
              creatorInfo.isFollowing && styles.followButtonActive,
            ]}
            onPress={onToggleFollow}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.followButtonText,
                creatorInfo.isFollowing && styles.followButtonTextActive,
              ]}
            >
              {creatorInfo.isFollowing ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.captionText}>{creatorInfo.caption}</Text>
      </View>

      {/* Action Icons Column (Bottom Right) */}
      <View style={styles.actionColumn}>
        {/* Heart / Like Icon */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onToggleLike}
          activeOpacity={0.7}
        >
          <View style={styles.actionIconContainer}>
            <Ionicons
              name={creatorInfo.isLiked ? 'heart' : 'heart-outline'}
              size={moderateScale(28)}
              color={creatorInfo.isLiked ? colors.red : colors.white}
            />
          </View>
        </TouchableOpacity>

        {/* Share Icon */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onShare}
          activeOpacity={0.7}
        >
          <View style={styles.actionIconContainer}>
            <Ionicons
              name="navigate-outline"
              size={moderateScale(26)}
              color={colors.white}
            />
          </View>
        </TouchableOpacity>

        {/* Flag / Report Icon */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onReport}
          activeOpacity={0.7}
        >
          <View style={styles.actionIconContainer}>
            <Ionicons
              name="flag-outline"
              size={moderateScale(24)}
              color={colors.white}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
