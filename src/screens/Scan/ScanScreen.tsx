import React, { useRef, useEffect } from 'react';
import { View, Text, Image, Animated, Platform } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Camera, CameraRef, useCameraDevice } from 'react-native-vision-camera';
import { useScanController } from './ScanController';
import { ScanHeader } from './components/ScanHeader';
import { ScanOverlay } from './components/ScanOverlay';
import { ARImageVideoView } from '../../components/ARImageVideoView';
import { strings } from '../../constants/strings';
import { styles } from './ScanStyles';

export const ScanScreen: React.FC = () => {
  const isFocused = useIsFocused();
  const cameraRef = useRef<CameraRef>(null);
  const device = useCameraDevice('back');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const {
    hasCameraPermission,
    scanState,
    isCameraActive,
    isLiveArActive,
    capturedImageUri,
    matchResult,
    resultMediaType,
    errorMessage,
    creatorInfo,
    handleCapturePhoto,
    handleResetScan,
    handleToggleFollow,
    handleToggleLike,
    handleShare,
    handleReport,
  } = useScanController();

  // Smooth transition animation when transitioning from preview to result
  useEffect(() => {
    if (scanState === 'success' || scanState === 'no_match' || scanState === 'error') {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [scanState, fadeAnim]);

  /**
   * Shutter button capture trigger
   */
  const handleShutterPress = async () => {
    if (cameraRef.current) {
      try {
        const snapshot = await cameraRef.current.takeSnapshot();
        const path = await snapshot.saveToTemporaryFileAsync('jpg', 85);
        const photoUri = Platform.OS === 'android' ? `file://${path}` : path;
        handleCapturePhoto(photoUri);
      } catch (err) {
        console.warn('Camera takeSnapshot exception, using snapshot fallback:', err);
        handleCapturePhoto();
      }
    } else {
      handleCapturePhoto();
    }
  };

  if (!hasCameraPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          {strings.scan.cameraPermissionRequired || 'Camera access is required for image scanning.'}
        </Text>
      </View>
    );
  }

  // Camera isActive control: Only active when focused and in idle scanning state
  const shouldRunCamera = isFocused && isCameraActive && scanState === 'idle';

  // Format matched target for Native ARCore View
  const arTargets = matchResult ? [
    {
      id: matchResult.id || 'matched_target',
      imageUrl: matchResult.imageUrl || '',
      physicalWidth: 0.2,
      videoUrl: matchResult.videoUrl || '',
    }
  ] : [];

  return (
    <View style={styles.container}>
      {/* 1. Live Native AR Core / ARKit View / Vision Camera Stream */}
      {scanState === 'success' && matchResult?.videoUrl && isLiveArActive ? (
        <ARImageVideoView
          style={styles.cameraView}
          targets={arTargets}
          onImageDetected={(id) => console.log('Live AR target detected:', id)}
        />
      ) : device != null && shouldRunCamera ? (
        <Camera
          ref={cameraRef}
          style={styles.cameraView}
          device={device}
          isActive={shouldRunCamera}
        />
      ) : (
        /* Camera Placeholder / Fallback view when camera is paused or releasing */
        <View style={[styles.cameraView, styles.cameraOffBackground]}>
          <Text style={styles.cameraOffText}>
            {scanState === 'idle' ? 'Initializing Camera Device...' : 'Camera Paused'}
          </Text>
        </View>
      )}

      {/* 2. Frozen Captured Image Preview Overlay */}
      {capturedImageUri && scanState !== 'idle' && !isLiveArActive ? (
        <Image
          source={{ uri: capturedImageUri }}
          style={styles.frozenPreviewImage}
          resizeMode="cover"
        />
      ) : null}

      {/* 3. Smooth Fade Animated Overlay for Results */}
      <Animated.View
        style={[styles.overlayContainer, { opacity: scanState === 'idle' || scanState === 'uploading' ? 1 : fadeAnim }]}
        pointerEvents="box-none"
      >
        <ScanHeader />

        <ScanOverlay
          scanState={scanState}
          resultMediaType={resultMediaType}
          matchResult={matchResult}
          errorMessage={errorMessage}
          onCapturePress={handleShutterPress}
          onResetScan={handleResetScan}
          creatorInfo={creatorInfo}
          onToggleFollow={handleToggleFollow}
          onToggleLike={handleToggleLike}
          onShare={handleShare}
          onReport={handleReport}
        />
      </Animated.View>
    </View>
  );
};

export default ScanScreen;
