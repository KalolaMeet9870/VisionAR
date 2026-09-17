import { useState, useEffect, useCallback } from 'react';
import { PermissionsAndroid, Platform, Alert, Share } from 'react-native';
import { ImageTarget } from '../../components/ARImageVideoView';
import arApiService, { MatchApiResponse, MatchTargetResult } from '../../services/api';
import { normalizeApiUrl, API_CONFIG } from '../../config/config';

export interface CreatorTarget {
  id: string;
  creatorName: string;
  avatarIcon: string;
  caption: string;
  isFollowing: boolean;
  isLiked: boolean;
  likeCount: number;
}

export type ScanState = 'idle' | 'capturing' | 'uploading' | 'success' | 'no_match' | 'error';

export const useScanController = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'scan' | 'search' | 'add' | 'feed' | 'you'>('scan');
  
  // Camera & Scan State Management
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(true);
  const [isLiveArActive, setIsLiveArActive] = useState<boolean>(true);
  const [capturedImageUri, setCapturedImageUri] = useState<string | null>(null);
  const [matchResult, setMatchResult] = useState<MatchTargetResult | null>(null);
  const [resultMediaType, setResultMediaType] = useState<'image' | 'video' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
            message: 'VisionAR needs camera access to scan image targets and display AR content.',
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

  /**
   * Reset scan state and re-activate camera for a new scan
   */
  const handleResetScan = useCallback(() => {
    setScanState('idle');
    setCapturedImageUri(null);
    setMatchResult(null);
    setResultMediaType(null);
    setErrorMessage(null);
    setIsCameraActive(true);
  }, []);

  /**
   * Core Camera Capture & Match API Upload Flow
   */
  const handleCapturePhoto = useCallback(async (capturedUri?: string, creatorHandle: string = API_CONFIG.DEFAULT_TENANT_ID) => {
    // Prevent multiple clicks or camera movement while already processing
    if (scanState !== 'idle') return;

    setScanState('capturing');
    
    // Requirement 2 & 11: Freeze camera preview immediately & release camera resources
    setIsCameraActive(false);

    // Save captured image URI
    const uriToUse = capturedUri || 'https://picsum.photos/id/237/800/600.jpg';
    setCapturedImageUri(uriToUse);

    // Requirement 3 & 4: Show captured image preview while uploading to Match API
    setScanState('uploading');

    try {
      const formData = new FormData();
      const filename = uriToUse.split('/').pop() || `scan_${Date.now()}.jpg`;

      // 1. Append image binary object for React Native FormData
      formData.append('image', {
        uri: Platform.OS === 'android' ? uriToUse : uriToUse.replace('file://', ''),
        type: 'image/jpeg',
        name: filename.endsWith('.jpg') || filename.endsWith('.jpeg') || filename.endsWith('.png') ? filename : `${filename}.jpg`,
      } as any);

      // 2. Append creator parameter (defaults to investor-demo as per backend API spec)
      const creatorValue = creatorHandle || API_CONFIG.DEFAULT_TENANT_ID || 'investor-demo';
      formData.append('creator', creatorValue);

      console.log('Sending scan API request to POST /api/scan with creator:', creatorValue);

      // 3. Call backend Scan API (POST /api/scan)
      const response: MatchApiResponse = await arApiService.scanImage(formData);
      console.log('Scan API Response:', response);

      const isSuccess = response?.success !== false && (response as any)?.matched !== false;
      const matchObj = typeof response?.match === 'object' && response?.match !== null ? response.match : null;
      const hasTargetData = matchObj || response.target || response.data || response.result || response.videoUrl || response.imageUrl;

      if (isSuccess && hasTargetData) {
        const targetObj: any = matchObj?.target || response.target || response.data || response.result || response || {};
        
        let videoUrl = matchObj?.videoUrl || targetObj.videoUrl || response.videoUrl || matchObj?.mediaUrl || targetObj.mediaUrl;
        let imageUrl = matchObj?.imageUrl || targetObj.imageUrl || response.imageUrl || targetObj.url || uriToUse;
        
        // Normalize localhost/127.0.0.1 URLs for Android device / emulator compatibility
        videoUrl = normalizeApiUrl(videoUrl);
        imageUrl = normalizeApiUrl(imageUrl);

        const contentType = (matchObj?.contentType || targetObj.contentType || targetObj.type || 'video').toLowerCase();

        const confidence = matchObj?.matcher?.confidence || targetObj.confidence;
        const corners = matchObj?.matcher?.corners || targetObj.corners;

        let detectedMediaType: 'image' | 'video' = 'image';
        if (
          contentType.includes('video') ||
          (videoUrl && (videoUrl.endsWith('.mp4') || videoUrl.endsWith('.mov') || videoUrl.includes('video') || videoUrl.includes('uploads/videos') || videoUrl.includes('mov_bbb')))
        ) {
          detectedMediaType = 'video';
        }

        setMatchResult({
          id: targetObj.id || matchObj?.matcher?.target_id || 'matched_target',
          title: targetObj.name || targetObj.title || 'Augmented AR Target Match',
          creatorName: targetObj.username || targetObj.tenantId || response.matchedTenant || creatorValue || 'AliveAR Creator',
          description: targetObj.description || `Matched AR target with ${(confidence ? (confidence * 100).toFixed(1) : '95.0')}% confidence.`,
          imageUrl: imageUrl,
          videoUrl: videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4',
          type: detectedMediaType,
          contentType: contentType,
          confidence: confidence,
          corners: corners,
          likeCount: targetObj.likeCount || 124,
          isLiked: false,
          isFollowing: false,
        });

        setResultMediaType(detectedMediaType);
        setScanState('success');
      } else {
        // Handle 404/no_match state
        setScanState('no_match');
      }
    } catch (err: any) {
      console.warn('Scan API Error:', err);

      // Handle 404/400 No Match or low feature count responses gracefully
      const errMessage = (err?.message || err?.error || '').toString().toLowerCase();
      if (
        err?.status === 404 ||
        err?.status === 400 ||
        errMessage.includes('no match') ||
        errMessage.includes('not found') ||
        errMessage.includes('detectable feature') ||
        errMessage.includes('enough feature')
      ) {
        console.log('Scan API returned no match / insufficient feature points:', err?.message);
        setScanState('no_match');
        return;
      }

      const isNetErr =
        err?.isNetworkError ||
        err?.status === 0 ||
        err?.code === 'ERR_NETWORK' ||
        err?.code === 'ECONNREFUSED' ||
        err?.message === 'Network Error';

      // Fallback offline demo toggle if server API is strictly unreachable in local dev environment
      if (__DEV__ && isNetErr) {
        console.log('DEV Mode Fallback: Backend server unreachable. Providing demo match preview.');
        setMatchResult({
          id: 'dev_mock_target',
          title: 'AR Target Matched (Demo Mode)',
          creatorName: 'Roman Fedorov',
          description: 'Matched AR target detected.',
          imageUrl: uriToUse,
          videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          type: 'video',
          confidence: 0.95,
        });
        setResultMediaType('video');
        setScanState('success');
        return;
      }

      // Handle API error state
      setErrorMessage(err?.message || err?.error || 'Failed to process scan API request.');
      setScanState('error');
    }
  }, [scanState]);

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
        message: `Check out AR Target by ${matchResult?.creatorName || creatorInfo.creatorName}`,
      });
    } catch (error) {
      console.warn('Share error:', error);
    }
  }, [creatorInfo, matchResult]);

  const handleReport = useCallback(() => {
    Alert.alert('Report Content', 'Thank you for your feedback. We will review this AR content.');
  }, []);

  const handleImageDetected = useCallback((id: string) => {
    console.log('AR Target Detected in ScanController:', id);
  }, []);

  const handleToggleLiveAr = useCallback(() => {
    setIsLiveArActive(prev => !prev);
  }, []);

  return {
    hasCameraPermission,
    activeTab,
    setActiveTab,
    scanState,
    isCameraActive,
    isLiveArActive,
    handleToggleLiveAr,
    capturedImageUri,
    matchResult,
    resultMediaType,
    errorMessage,
    creatorInfo,
    targets,
    handleCapturePhoto,
    handleResetScan,
    handleToggleFollow,
    handleToggleLike,
    handleShare,
    handleReport,
    handleImageDetected,
  };
};
