import { useState, useMemo } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/stacks/types';


export interface DetailsFeedItem {
  id: string;
  title: string;
  imageUrl: string;
  videoUrl?: string;
  creatorName: string;
  avatarUrl: string;
  isFollowing?: boolean;
  isLiked?: boolean;
}

type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;
type DetailsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Details'>;

export const MOCK_DETAILS_FEED: DetailsFeedItem[] = [
  {
    id: 'art_1',
    title: 'Thiago Neumann',
    imageUrl: 'https://picsum.photos/id/1025/1080/1920',
    creatorName: 'Thiago Neumann',
    avatarUrl: 'https://picsum.photos/id/1025/200/200',
    isFollowing: false,
    isLiked: false,
  },
  {
    id: 'art_2',
    title: 'Liska TITUL',
    imageUrl: 'https://picsum.photos/id/1043/1080/1920',
    creatorName: 'Eliska Podzimkova',
    avatarUrl: 'https://picsum.photos/id/1005/200/200',
    isFollowing: true,
    isLiked: true,
  },
  {
    id: 'art_3',
    title: 'Crystal Hands',
    imageUrl: 'https://picsum.photos/id/1050/1080/1920',
    creatorName: 'Maria Silva',
    avatarUrl: 'https://picsum.photos/id/1027/200/200',
    isFollowing: false,
    isLiked: false,
  },
  {
    id: 'art_4',
    title: 'Floral Scrapbook',
    imageUrl: 'https://picsum.photos/id/1069/1080/1920',
    creatorName: 'Alex Vance',
    avatarUrl: 'https://picsum.photos/id/1062/200/200',
    isFollowing: false,
    isLiked: false,
  },
  {
    id: 'art_5',
    title: 'AR Sculptures',
    imageUrl: 'https://picsum.photos/id/1074/1080/1920',
    creatorName: 'Jerry Hong',
    avatarUrl: 'https://picsum.photos/id/1084/200/200',
    isFollowing: true,
    isLiked: false,
  },
];

export const useDetailsController = () => {
  const navigation = useNavigation<DetailsScreenNavigationProp>();
  const route = useRoute<DetailsScreenRouteProp>();

  const initialParams = route.params;

  // Build feed list incorporating clicked route params item first
  const feedList = useMemo(() => {
    if (!initialParams?.id) return MOCK_DETAILS_FEED;
    const existingIndex = MOCK_DETAILS_FEED.findIndex(item => item.id === initialParams.id);
    if (existingIndex !== -1) {
      const copy = [...MOCK_DETAILS_FEED];
      const [clicked] = copy.splice(existingIndex, 1);
      return [clicked, ...copy];
    }
    const clickedItem: DetailsFeedItem = {
      id: initialParams.id,
      title: initialParams.title || 'Artwork Detail',
      imageUrl: initialParams.imageUrl || 'https://picsum.photos/id/1043/1080/1920',
      creatorName: initialParams.creatorName || 'Artist',
      avatarUrl: initialParams.avatarUrl || 'https://picsum.photos/id/1025/200/200',
      isFollowing: initialParams.isFollowing ?? false,
      isLiked: initialParams.isLiked ?? false,
    };
    return [clickedItem, ...MOCK_DETAILS_FEED];
  }, [initialParams]);

  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    feedList.forEach(item => {
      initial[item.id] = item.isFollowing ?? false;
    });
    return initial;
  });

  const [likedMap, setLikedMap] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    feedList.forEach(item => {
      initial[item.id] = item.isLiked ?? false;
    });
    return initial;
  });

  const handleToggleFollow = (id: string) => {
    setFollowingMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleLike = (id: string) => {
    setLikedMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleShare = (item: DetailsFeedItem) => {
    // Action trigger for sharing
  };

  const handleReport = (item: DetailsFeedItem) => {
    // Action trigger for report/flag
  };

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleOpenArtistProfile = (item: DetailsFeedItem) => {
    navigation.navigate('ArtistProfile', {
      id: item.id,
      name: item.creatorName,
      avatarUrl: item.avatarUrl,
    });
  };

  return {
    feedList,
    followingMap,
    likedMap,
    handleToggleFollow,
    handleToggleLike,
    handleShare,
    handleReport,
    handleGoBack,
    handleOpenArtistProfile,
  };
};
