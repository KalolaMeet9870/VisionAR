import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from '../ScanStyles';
import { CreatorTarget, ScanState } from '../ScanController';
import { MatchTargetResult } from '../../../services/api';
import { VideoResultView } from './VideoResultView';
import { colors } from '../../../theme/colors';
import { moderateScale } from '../../../theme/Metrics';

interface ScanOverlayProps {
  scanState: ScanState;
  resultMediaType: 'image' | 'video' | null;
  matchResult: MatchTargetResult | null;
  errorMessage: string | null;
  onCapturePress: () => void;
  onResetScan: () => void;
  creatorInfo: CreatorTarget;
  onToggleFollow: () => void;
  onToggleLike: () => void;
  onShare: () => void;
  onReport: () => void;
}

export const ScanOverlay: React.FC<ScanOverlayProps> = ({
  scanState,
  resultMediaType,
  matchResult,
  errorMessage,
  onCapturePress,
  onResetScan,
  creatorInfo,
  onToggleFollow,
  onToggleLike,
  onShare,
  onReport,
}) => {
  // 1. Idle Scanning Overlay (Viewfinder & Shutter Button)
  if (scanState === 'idle') {
    return (
      <View style={styles.fullOverlay} pointerEvents="box-none">
        {/* Reticle Viewfinder Frame */}
        <View style={styles.reticleContainer} pointerEvents="none">
          <View style={styles.reticleFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
            <View style={styles.scannerBeamLine} />
          </View>
          <Text style={styles.reticleGuideText}>Point camera at AR target & capture</Text>
        </View>

        {/* Shutter Capture Button (Bottom Center) */}
        <View style={styles.shutterContainer} pointerEvents="box-none">
          <TouchableOpacity
            style={styles.shutterOuterRing}
            onPress={onCapturePress}
            activeOpacity={0.8}
          >
            <View style={styles.shutterInnerCircle}>
              <MaterialCommunityIcons
                name="camera"
                size={moderateScale(28)}
                color={colors.black}
              />
            </View>
          </TouchableOpacity>
          <Text style={styles.shutterHintText}>TAP TO CAPTURE</Text>
        </View>
      </View>
    );
  }

  // 2. Capturing & Uploading Overlay (Loading state over frozen preview)
  if (scanState === 'capturing' || scanState === 'uploading') {
    return (
      <View style={styles.fullOverlay} pointerEvents="box-none">
        <View style={styles.uploadingCard}>
          <ActivityIndicator size="large" color={colors.primary || '#00E5FF'} />
          <Text style={styles.uploadingTitle}>Matching Target Image...</Text>
          <Text style={styles.uploadingSubtext}>Uploading snapshot to Match API</Text>
          <View style={styles.processingBadge}>
            <Text style={styles.processingBadgeText}>CAMERA FROZEN</Text>
          </View>
        </View>
      </View>
    );
  }

  // 3. Success Result State: Hide overlay cards to present clean full-screen AR camera tracking view
  if (scanState === 'success') {
    return null;
  }

  // 4. No Match Found State
  if (scanState === 'no_match') {
    return (
      <View style={styles.fullOverlay} pointerEvents="box-none">
        <View style={styles.statusCard}>
          <Ionicons name="help-circle-outline" size={moderateScale(56)} color="#FFB74D" />
          <Text style={styles.statusTitle}>No Target Match Found</Text>
          <Text style={styles.statusDescription}>
            We couldn't match this image with any registered AR target. Make sure the target is clear, well-lit, and in focus.
          </Text>

          <TouchableOpacity
            style={styles.scanAgainButton}
            onPress={onResetScan}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh-outline" size={moderateScale(20)} color={colors.black} />
            <Text style={styles.scanAgainText}>Try Scanning Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 5. API Error State
  if (scanState === 'error') {
    return (
      <View style={styles.fullOverlay} pointerEvents="box-none">
        <View style={styles.statusCard}>
          <Ionicons name="alert-circle-outline" size={moderateScale(56)} color={colors.red} />
          <Text style={styles.statusTitle}>Match Request Error</Text>
          <Text style={styles.statusDescription}>
            {errorMessage || 'Unable to connect to the Match API. Please verify your connection.'}
          </Text>

          <TouchableOpacity
            style={styles.scanAgainButton}
            onPress={onResetScan}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh-outline" size={moderateScale(20)} color={colors.black} />
            <Text style={styles.scanAgainText}>Try Scanning Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return null;
};
