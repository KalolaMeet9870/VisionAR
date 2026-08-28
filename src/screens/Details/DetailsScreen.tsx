import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDetailsController, DetailsFeedItem } from './DetailsController';
import { styles } from './DetailsStyles';
import { colors } from '../../theme/colors';
import { strings } from '../../constants/strings';
import { moderateScale } from '../../theme/Metrics';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const DetailsScreen: React.FC = () => {
  const {
    feedList,
    followingMap,
    likedMap,
    handleToggleFollow,
    handleToggleLike,
    handleShare,
    handleReport,
    handleGoBack,
    handleOpenArtistProfile,
  } = useDetailsController();

  const renderItem = ({ item }: { item: DetailsFeedItem }) => {
    const isFollowing = followingMap[item.id] ?? false;
    const isLiked = likedMap[item.id] ?? false;

    return (
      <View style={styles.slideItem}>
        {/* Background Environment / Camera View simulation */}
        <Image source={{ uri: item.imageUrl }} style={styles.bgImage} />
        <View style={styles.bgOverlay} />

        {/* Floating AR Video / Image Box */}
        <View style={styles.arCardContainer}>
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.arVideoFrame}
          />
        </View>

        {/* Overlay Info & Actions */}
        <View style={styles.overlayContainer} pointerEvents="box-none">
          <View style={styles.bottomRow}>
            {/* Creator Info (Bottom Left) */}
            <View style={styles.profileSection}>
              <View style={styles.profileHeader}>
                <TouchableOpacity
                  style={styles.profileClickableArea}
                  onPress={() => handleOpenArtistProfile(item)}
                  activeOpacity={0.8}
                >
                  {/* Red Avatar emblem */}
                  <View style={styles.avatarContainer}>
                    <MaterialCommunityIcons
                      name="triangle-outline"
                      size={moderateScale(18)}
                      color={colors.white}
                    />
                  </View>

                  {/* Creator Name */}
                  <Text style={styles.creatorName} numberOfLines={1}>
                    {item.creatorName}
                  </Text>
                </TouchableOpacity>

                {/* Follow Button */}
                <TouchableOpacity
                  style={[
                    styles.followButton,
                    isFollowing && styles.followButtonActive,
                  ]}
                  onPress={() => handleToggleFollow(item.id)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.followButtonText,
                      isFollowing && styles.followButtonTextActive,
                    ]}
                  >
                    {isFollowing ? strings.feed.following : strings.feed.follow}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Caption */}
              <Text style={styles.captionText}>{item.title}</Text>
            </View>

            {/* Right Action Icons Column */}
            <View style={styles.actionColumn}>
              {/* Heart / Like Icon */}
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleToggleLike(item.id)}
                activeOpacity={0.7}
              >
                <View style={styles.actionIconContainer}>
                  <Ionicons
                    name={isLiked ? 'heart' : 'heart-outline'}
                    size={moderateScale(30)}
                    color={isLiked ? colors.red : colors.white}
                  />
                </View>
              </TouchableOpacity>

              {/* Share Icon */}
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleShare(item)}
                activeOpacity={0.7}
              >
                <View style={styles.actionIconContainer}>
                  <Ionicons
                    name="navigate-outline"
                    size={moderateScale(28)}
                    color={colors.white}
                  />
                </View>
              </TouchableOpacity>

              {/* Flag / Report Icon */}
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleReport(item)}
                activeOpacity={0.7}
              >
                <View style={styles.actionIconContainer}>
                  <Ionicons
                    name="flag-outline"
                    size={moderateScale(25)}
                    color={colors.white}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const getItemLayout = (_: any, index: number) => ({
    length: SCREEN_HEIGHT,
    offset: SCREEN_HEIGHT * index,
    index,
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Floating Top Left Back Arrow Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleGoBack}
        activeOpacity={0.7}
      >
        <Ionicons
          name="arrow-back"
          size={moderateScale(24)}
          color={colors.white}
        />
      </TouchableOpacity>

      {/* Vertical Paging Feed List */}
      <FlatList
        data={feedList}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        pagingEnabled
        getItemLayout={getItemLayout}
        snapToInterval={SCREEN_HEIGHT}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default DetailsScreen;
