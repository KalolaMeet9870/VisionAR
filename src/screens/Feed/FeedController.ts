import { useState, useCallback } from 'react';
import { Share, Alert } from 'react-native';

export interface FeedPost {
  id: string;
  creatorName: string;
  avatarIcon: string;
  caption: string;
  isFollowing: boolean;
  isLiked: boolean;
  likeCount: number;
  videoUrl: string;
  bgImageUrl: string;
  artworkTitle: string;
}

const INITIAL_POSTS: FeedPost[] = [
  {
    id: '1',
    creatorName: 'Roman Fedorov',
    avatarIcon: 'emblem',
    caption: 'Любовь',
    isFollowing: false,
    isLiked: false,
    likeCount: 1240,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    bgImageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1000&auto=format&fit=crop', // Greenhouse background
    artworkTitle: 'Kaleidoscope AR #1',
  },
  {
    id: '2',
    creatorName: 'Elena Rostova',
    avatarIcon: 'emblem',
    caption: 'AR Sculptures in Nature 🌿',
    isFollowing: true,
    isLiked: true,
    likeCount: 3820,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    bgImageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1000&auto=format&fit=crop',
    artworkTitle: 'Lumina Sphere',
  },
];

export const useFeedController = () => {
  const [posts, setPosts] = useState<FeedPost[]>(INITIAL_POSTS);
  const [activePostIndex, setActivePostIndex] = useState<number>(0);

  const currentPost = posts[activePostIndex] || posts[0];

  const handleToggleFollow = useCallback((postId: string) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId ? { ...post, isFollowing: !post.isFollowing } : post
      )
    );
  }, []);

  const handleToggleLike = useCallback((postId: string) => {
    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const nextLiked = !post.isLiked;
          return {
            ...post,
            isLiked: nextLiked,
            likeCount: nextLiked ? post.likeCount + 1 : post.likeCount - 1,
          };
        }
        return post;
      })
    );
  }, []);

  const handleShare = useCallback(async (post: FeedPost) => {
    try {
      await Share.share({
        message: `Check out AR Artwork "${post.caption}" by ${post.creatorName} on VisionAR!`,
      });
    } catch (error) {
      console.warn('Share error:', error);
    }
  }, []);

  const handleReport = useCallback(() => {
    Alert.alert('Report Content', 'Thank you for your feedback. We will review this AR post.');
  }, []);

  return {
    posts,
    currentPost,
    activePostIndex,
    setActivePostIndex,
    handleToggleFollow,
    handleToggleLike,
    handleShare,
    handleReport,
  };
};
