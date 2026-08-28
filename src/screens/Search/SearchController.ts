import { useState, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/stacks/types';

export interface FeaturedArtist {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface PopularArtwork {
  id: string;
  title: string;
  imageUrl: string;
  artistName: string;
}

export const MOCK_FEATURED_ARTISTS: FeaturedArtist[] = [
  {
    id: 'artist_1',
    name: '洪世哲 Jerry Hong',
    avatarUrl: 'https://picsum.photos/id/1005/300/300',
  },
  {
    id: 'artist_2',
    name: 'Thiago Neumann',
    avatarUrl: 'https://picsum.photos/id/1025/300/300',
  },
  {
    id: 'artist_3',
    name: 'Maria Silva',
    avatarUrl: 'https://picsum.photos/id/1027/300/300',
  },
  {
    id: 'artist_4',
    name: 'Alex Vance',
    avatarUrl: 'https://picsum.photos/id/1062/300/300',
  },
];

export const MOCK_POPULAR_ARTWORKS: PopularArtwork[] = [
  { id: 'art_1', title: 'Liska TITUL', imageUrl: 'https://picsum.photos/id/1043/800/1000', artistName: 'Eliska Podzimkova' },
  { id: 'art_2', title: 'Crystal Hands', imageUrl: 'https://picsum.photos/id/1050/800/1000', artistName: 'Thiago Neumann' },
  { id: 'art_3', title: 'Floral Scrapbook', imageUrl: 'https://picsum.photos/id/1069/800/1000', artistName: 'Maria Silva' },
  { id: 'art_4', title: 'AR Sculptures', imageUrl: 'https://picsum.photos/id/1074/800/1000', artistName: 'Alex Vance' },
  { id: 'art_5', title: 'Pink Cloud Head', imageUrl: 'https://picsum.photos/id/1084/800/1000', artistName: 'Jerry Hong' },
  { id: 'art_6', title: 'Mural Splash', imageUrl: 'https://picsum.photos/id/1080/800/1000', artistName: 'Thiago Neumann' },
  { id: 'art_7', title: 'Golden Arrow', imageUrl: 'https://picsum.photos/id/1011/800/1000', artistName: 'Maria Silva' },
  { id: 'art_8', title: 'Mystic Tapestry', imageUrl: 'https://picsum.photos/id/1015/800/1000', artistName: 'Alex Vance' },
  { id: 'art_9', title: 'Abstract Vision', imageUrl: 'https://picsum.photos/id/1020/800/1000', artistName: 'Jerry Hong' },
  { id: 'art_10', title: 'Botanical AR', imageUrl: 'https://picsum.photos/id/1028/800/1000', artistName: 'Thiago Neumann' },
  { id: 'art_11', title: 'Celestial Night', imageUrl: 'https://picsum.photos/id/1039/800/1000', artistName: 'Maria Silva' },
  { id: 'art_12', title: 'Urban Rooster', imageUrl: 'https://picsum.photos/id/1052/800/1000', artistName: 'Alex Vance' },
];

export const useSearchController = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArtists = useMemo(() => {
    if (!searchQuery.trim()) return MOCK_FEATURED_ARTISTS;
    return MOCK_FEATURED_ARTISTS.filter(artist =>
      artist.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredArtworks = useMemo(() => {
    if (!searchQuery.trim()) return MOCK_POPULAR_ARTWORKS;
    return MOCK_POPULAR_ARTWORKS.filter(
      art =>
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.artistName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleArtworkPress = (artwork: PopularArtwork) => {
    navigation.navigate('Details', {
      id: artwork.id,
      title: artwork.title,
      imageUrl: artwork.imageUrl,
      creatorName: artwork.artistName,
      avatarUrl: 'https://picsum.photos/id/1025/300/300',
    });
  };

  const handleArtistPress = (artist: FeaturedArtist) => {
    navigation.navigate('ArtistProfile', {
      id: artist.id,
      name: artist.name,
      avatarUrl: artist.avatarUrl,
    });
  };


  return {
    searchQuery,
    setSearchQuery,
    handleClearSearch,
    handleArtworkPress,
    handleArtistPress,
    featuredArtists: filteredArtists,
    popularArtworks: filteredArtworks,
  };
};

