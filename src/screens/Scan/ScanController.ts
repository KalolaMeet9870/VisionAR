import { useState, useEffect, useCallback } from 'react';
import { PermissionsAndroid, Platform, Alert, Share } from 'react-native';
import { ImageTarget } from '../../components/ARImageVideoView';

export interface CreatorTarget {
  id: string;
  creatorName: string;
  avatarIcon: string;
  caption: string;
  isFollowing: boolean;
  isLiked: boolean;
  likeCount: number;
}

export const useScanController = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'scan' | 'search' | 'add' | 'feed' | 'you'>('scan');
  
  const [creatorInfo, setCreatorInfo] = useState<CreatorTarget>({
    id: 'poster1',
    creatorName: 'Roman Fedorov',
    avatarIcon: 'eye-triangle',
    caption: 'Любовь',
    isFollowing: false,
    isLiked: false,
    likeCount: 124,
  });

  const [targets] = useState<ImageTarget[]>([
    {
      id: 'poster1',
      imageUrl: 'https://raw.githubusercontent.com/google-ar/arcore-android-sdk/master/samples/augmented_image_java/app/src/main/assets/default.jpg',
      physicalWidth: 0.2,
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    },
    {
      id: 'poster2',
      imageUrl: 'https://picsum.photos/id/237/800/600.jpg',
      physicalWidth: 0.2,
      videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
    },
  ]);

  const requestCameraPermission = useCallback(async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission Required',
            message: 'VisionAR needs camera access to track AR targets and display video overlays.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        setHasCameraPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
      } catch (err) {
        console.warn('Camera permission request error:', err);
      }
    } else {
      setHasCameraPermission(true);
    }
  }, []);

  useEffect(() => {
    requestCameraPermission();
  }, [requestCameraPermission]);

  const handleToggleFollow = useCallback(() => {
    setCreatorInfo(prev => ({
      ...prev,
      isFollowing: !prev.isFollowing,
    }));
  }, []);

  const handleToggleLike = useCallback(() => {
    setCreatorInfo(prev => ({
      ...prev,
      isLiked: !prev.isLiked,
      likeCount: prev.isLiked ? prev.likeCount - 1 : prev.likeCount + 1,
    }));
  }, []);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: `Check out AR Target by ${creatorInfo.creatorName} - ${creatorInfo.caption}`,
      });
    } catch (error) {
      console.warn('Share error:', error);
    }
  }, [creatorInfo]);

  const handleReport = useCallback(() => {
    Alert.alert('Report Content', 'Thank you for your feedback. We will review this AR content.');
  }, []);

  const handleImageDetected = useCallback((id: string) => {
    console.log('AR Target Detected in ScanController:', id);
  }, []);

  return {
    hasCameraPermission,
    activeTab,
    setActiveTab,
    creatorInfo,
    targets,
    handleToggleFollow,
    handleToggleLike,
    handleShare,
    handleReport,
    handleImageDetected,
  };
};
