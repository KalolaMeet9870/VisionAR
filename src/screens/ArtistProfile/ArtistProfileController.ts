import { useState } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/stacks/types';

export interface ArtistArtwork {
  id: string;
  imageUrl: string;
  likesCount?: number;
}

type ArtistProfileScreenRouteProp = RouteProp<RootStackParamList, 'ArtistProfile'>;
type ArtistProfileNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ArtistProfile'>;

export const MOCK_FAN_RECORDINGS: ArtistArtwork[] = [
  { id: 'rec_1', imageUrl: 'https://picsum.photos/id/1043/400/400', likesCount: 2 },
  { id: 'rec_2', imageUrl: 'https://picsum.photos/id/1050/400/400', likesCount: 5 },
  { id: 'rec_3', imageUrl: 'https://picsum.photos/id/1069/400/400', likesCount: 12 },
];

export const MOCK_UPLOADS: ArtistArtwork[] = [
  { id: 'up_1', imageUrl: 'https://picsum.photos/id/1074/400/400', likesCount: 45 },
  { id: 'up_2', imageUrl: 'https://picsum.photos/id/1084/400/400', likesCount: 38 },
  { id: 'up_3', imageUrl: 'https://picsum.photos/id/1080/400/400', likesCount: 29 },
  { id: 'up_4', imageUrl: 'https://picsum.photos/id/1011/400/400', likesCount: 19 },
  { id: 'up_5', imageUrl: 'https://picsum.photos/id/1015/400/400', likesCount: 62 },
];

export const useArtistProfileController = () => {
  const navigation = useNavigation<ArtistProfileNavigationProp>();
  const route = useRoute<ArtistProfileScreenRouteProp>();

  const params = route.params || {
    id: 'artist_genevieve',
    name: 'Genevieve Tremblay',
    avatarUrl: 'https://picsum.photos/id/1025/300/300',
    bio: 'I am a multidisciplinary artist and creative technologist who lives in the Pacific NW, USA. I work with a suite of mobile, digital + virtual tools that allow me to capture + process visual/audio material I gather in the field. My work is best categorized as ‘Post-Net’...art created via dynamic mobile and virtual interfaces and is meant to be presented and shared across digital mediums.',
    followersCount: 2,
    collectedCount: 2,
    websiteUrl: 'https://example.com',
  };

  const [isFollowing, setIsFollowing] = useState(false);
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'recordings' | 'uploads'>('recordings');

  const handleToggleFollow = () => {
    setIsFollowing(prev => !prev);
  };

  const handleToggleBio = () => {
    setIsBioExpanded(prev => !prev);
  };

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleArtworkPress = (artwork: ArtistArtwork) => {
    navigation.navigate('Details', {
      id: artwork.id,
      title: params.name || 'Genevieve Tremblay',
      imageUrl: artwork.imageUrl,
      creatorName: params.name || 'Genevieve Tremblay',
      avatarUrl: params.avatarUrl,
    });
  };

  const handleReport = () => {
    // Action trigger for flag/report artist
  };

  const handleOpenWebsite = () => {
    // Action trigger for opening website
  };

  return {
    artist: {
      id: params.id,
      name: params.name || 'Genevieve Tremblay',
      avatarUrl: params.avatarUrl || 'https://picsum.photos/id/1025/300/300',
      bio: params.bio || 'I am a multidisciplinary artist and creative technologist...',
      followersCount: params.followersCount ?? 2,
      collectedCount: params.collectedCount ?? 2,
      websiteUrl: params.websiteUrl,
    },
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
    recordings: MOCK_FAN_RECORDINGS,
    uploads: MOCK_UPLOADS,
  };
};
