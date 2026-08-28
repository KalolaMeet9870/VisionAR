import React from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSearchController, FeaturedArtist, PopularArtwork } from './SearchController';
import { styles } from './SearchStyles';
import { colors } from '../../theme/colors';
import { strings } from '../../constants/strings';
import { moderateScale } from '../../theme/Metrics';

export const SearchScreen: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    handleClearSearch,
    handleArtworkPress,
    handleArtistPress,
    featuredArtists,
    popularArtworks,
  } = useSearchController();

  const renderArtistItem = ({ item }: { item: FeaturedArtist }) => (
    <TouchableOpacity
      style={styles.artistCard}
      activeOpacity={0.8}
      onPress={() => handleArtistPress(item)}
    >
      <View style={styles.artistAvatarContainer}>
        <Image source={{ uri: item.avatarUrl }} style={styles.artistAvatar} />
      </View>
      <Text style={styles.artistName} numberOfLines={2}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );


  return (
    <View style={styles.container}>
      {/* Top Search Header */}
      <View style={styles.headerContainer}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search-outline"
            size={moderateScale(20)}
            color={colors.searchIcon}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder={strings.search.placeholder}
            placeholderTextColor={colors.searchPlaceholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={handleClearSearch}
              style={styles.clearButton}
              activeOpacity={0.7}
            >
              <Ionicons
                name="close-circle"
                size={moderateScale(18)}
                color={colors.searchIcon}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Section 1: Featured Artists */}
        {featuredArtists.length > 0 && (
          <View>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="ribbon-outline"
                size={moderateScale(22)}
                color={colors.textPrimary}
                style={styles.sectionIcon}
              />
              <Text style={styles.sectionTitle}>{strings.search.featuredArtists}</Text>
            </View>

            <FlatList
              data={featuredArtists}
              renderItem={renderArtistItem}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.artistsListContent}
            />
          </View>
        )}

        {/* Section 2: Popular Artworks (3-Column Grid) */}
        <View style={styles.sectionHeader}>
          <Ionicons
            name="star-outline"
            size={moderateScale(22)}
            color={colors.textPrimary}
            style={styles.sectionIcon}
          />
          <Text style={styles.sectionTitle}>{strings.search.popular}</Text>
        </View>

        {popularArtworks.length > 0 ? (
          <View style={styles.gridContainer}>
            {popularArtworks.map((item: PopularArtwork) => (
              <TouchableOpacity
                key={item.id}
                style={styles.gridItem}
                activeOpacity={0.85}
                onPress={() => handleArtworkPress(item)}
              >
                <Image source={{ uri: item.imageUrl }} style={styles.gridImage} />
              </TouchableOpacity>
            ))}
          </View>
        ) : (

          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{strings.search.noResults}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default SearchScreen;
