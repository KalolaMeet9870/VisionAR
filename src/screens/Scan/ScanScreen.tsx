import React from 'react';
import { View, Text } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useScanController } from './ScanController';
import { ScanHeader } from './components/ScanHeader';
import { ScanOverlay } from './components/ScanOverlay';
import { ARImageVideoView } from '../../components/ARImageVideoView';
import { styles } from './ScanStyles';

export const ScanScreen: React.FC = () => {
  const isFocused = useIsFocused();
  const {
    hasCameraPermission,
    creatorInfo,
    targets,
    handleToggleFollow,
    handleToggleLike,
    handleShare,
    handleReport,
    handleImageDetected,
  } = useScanController();

  if (!hasCameraPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Camera permission is required to view AR content.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Fullscreen AR Camera Tracking View - Active only when tab is focused */}
      {isFocused && (
        <ARImageVideoView
          style={styles.cameraView}
          targets={targets}
          onImageDetected={handleImageDetected}
        />
      )}

      {/* Screen Overlay Content */}
      <View style={styles.overlayContainer} pointerEvents="box-none">
        <ScanHeader />

        {/* <ScanOverlay
          creatorInfo={creatorInfo}
          onToggleFollow={handleToggleFollow}
          onToggleLike={handleToggleLike}
          onShare={handleShare}
          onReport={handleReport}
        /> */}
      </View>
    </View>
  );
};

export default ScanScreen;
