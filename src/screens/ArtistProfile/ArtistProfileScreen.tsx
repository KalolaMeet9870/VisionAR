import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useArtistProfileController, ArtistArtwork } from './ArtistProfileController';
import { styles } from './ArtistProfileStyles';
import { colors } from '../../theme/colors';
import { strings } from '../../constants/strings';
import { moderateScale } from '../../theme/Metrics';

export const ArtistProfileScreen: React.FC = () => {
  const {
    artist,
    isFollowing,
    isBioExpanded,
    activeTab,
    setActiveTab,
    handleToggleFollow,
    handleToggleBio,
    handleGoBack,
    handleArtworkPress,
    handleReport,
    handleOpenWebsite,
    recordings,
    uploads,
  } = useArtistProfileController();

  const currentList = activeTab === 'recordings' ? recordings : uploads;
  const hasWebsite = Boolean(artist.websiteUrl);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      {/* Top Navigation Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back"
              size={moderateScale(24)}
              color={colors.textPrimary}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {artist.name}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.reportButton}
          onPress={handleReport}
          activeOpacity={0.7}
        >
          <Ionicons
            name="flag-outline"
            size={moderateScale(20)}
            color={colors.flagIcon}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Centered Profile Avatar */}
        <View style={styles.avatarContainer}>
          <Image source={{ uri: artist.avatarUrl }} style={styles.avatarImage} />
        </View>

        {/* Stats Row (Followers | Collected) */}
        {(artist.followersCount !== undefined || artist.collectedCount !== undefined) && (
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{artist.followersCount ?? 0}</Text>
              <Text style={styles.statLabel}>{strings.artistProfile.followers}</Text>
            </View>

            <View style={styles.dividerLine} />

            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{artist.collectedCount ?? 0}</Text>
              <Text style={styles.statLabel}>{strings.artistProfile.collected}</Text>
            </View>
          </View>
        )}

        {/* Action Buttons Row (Follow + Optional Website) */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[
              styles.followButton,
              hasWebsite && styles.followButtonWithWebsite,
              isFollowing && styles.followButtonActive,
            ]}
            onPress={handleToggleFollow}
            activeOpacity={0.85}
          >
            <Text style={styles.followButtonText}>
              {isFollowing ? strings.artistProfile.following : strings.artistProfile.follow}
            </Text>
          </TouchableOpacity>

          {hasWebsite && (
            <TouchableOpacity
              style={styles.websiteButton}
              onPress={handleOpenWebsite}
              activeOpacity={0.7}
            >
              <Ionicons
                name="globe-outline"
                size={moderateScale(22)}
                color={colors.textPrimary}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Artist Bio Section */}
        {Boolean(artist.bio) && (
          <View style={styles.bioContainer}>
            <Text
              style={styles.bioText}
              numberOfLines={isBioExpanded ? undefined : 4}
            >
              {artist.bio}
            </Text>
            <TouchableOpacity
              onPress={handleToggleBio}
              style={styles.showMoreButton}
              activeOpacity={0.7}
            >
              <Text style={styles.showMoreText}>
                {isBioExpanded
                  ? strings.artistProfile.showLess
                  : strings.artistProfile.showMore}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Sub-Tabs Navigation (Fan Recordings vs Uploads) */}
        <View style={styles.tabsContainer}>
          {/* Tab 1: Fan Recordings */}
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setActiveTab('recordings')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="people-outline"
              size={moderateScale(18)}
              color={activeTab === 'recordings' ? colors.textPrimary : colors.textSecondary}
              style={styles.tabIcon}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'recordings' && styles.activeTabText,
              ]}
            >
              {strings.artistProfile.fanRecordings}
            </Text>
            {activeTab === 'recordings' && (
              <View style={styles.activeTabIndicator} />
            )}
          </TouchableOpacity>

          {/* Tab 2: Uploads */}
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setActiveTab('uploads')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="videocam-outline"
              size={moderateScale(18)}
              color={activeTab === 'uploads' ? colors.textPrimary : colors.textSecondary}
              style={styles.tabIcon}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'uploads' && styles.activeTabText,
              ]}
            >
              {strings.artistProfile.uploads}
            </Text>
            {activeTab === 'uploads' && (
              <View style={styles.activeTabIndicator} />
            )}
          </TouchableOpacity>
        </View>

        {/* Content 3-Column Grid */}
        {currentList.length > 0 ? (
          <View style={styles.gridContainer}>
            {currentList.map((item: ArtistArtwork) => (
              <TouchableOpacity
                key={item.id}
                style={styles.gridItem}
                activeOpacity={0.85}
                onPress={() => handleArtworkPress(item)}
              >
                <Image source={{ uri: item.imageUrl }} style={styles.gridImage} />
                {item.likesCount !== undefined && (
                  <View style={styles.likeBadge}>
                    <Ionicons
                      name="heart"
                      size={moderateScale(14)}
                      color={colors.white}
                    />
                    <Text style={styles.likeCountText}>{item.likesCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {activeTab === 'recordings'
                ? strings.artistProfile.noRecordings
                : strings.artistProfile.noUploads}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ArtistProfileScreen;
