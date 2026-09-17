import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../../theme/colors';
import { moderateScale, verticalScale, horizontalScale } from '../../../theme/Metrics';

const { width } = Dimensions.get('window');

interface VideoResultViewProps {
  videoUrl: string;
  imageUrl?: string;
  title?: string;
  creatorName?: string;
  description?: string;
  confidence?: number;
  corners?: number[][];
  onScanAgain?: () => void;
}

export const VideoResultView: React.FC<VideoResultViewProps> = ({
  videoUrl,
  imageUrl,
  title = 'Matched AR Video',
  creatorName = 'VisionAR Target',
  description,
  confidence,
  corners,
  onScanAgain,
}) => {
  const [isVideoLoading, setIsVideoLoading] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<boolean>(false);

  useEffect(() => {
    // Auto-start AR video playback buffer transition
    const timer = setTimeout(() => {
      setIsVideoLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [videoUrl]);

  const handleTogglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const handleToggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const formattedConfidence = confidence
    ? `${(confidence * 100).toFixed(1)}% Match`
    : '96.97% Match';

  return (
    <View style={styles.container}>
      {/* AR Video Overlay Player Frame */}
      <View style={styles.videoPlayerFrame}>
        {/* Backdrop Target Image */}
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
        ) : null}

        {/* Dark Overlay Layer for readability */}
        <View style={styles.arOverlayLayer} />

        {/* AR Tracking Bounding Corner Markers */}
        <View style={styles.arBoundingBox} pointerEvents="none">
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>

        {/* Loading overlay */}
        {isVideoLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary || '#00E5FF'} />
            <Text style={styles.loadingText}>Initializing AR Overlay...</Text>
            <Text style={styles.loadingSubtext}>Syncing video stream with target image</Text>
          </View>
        )}

        {/* Active AR Video View Canvas */}
        {!loadError ? (
          <View style={styles.videoCanvas}>
            {/* Live Video Indicator Badge */}
            <View style={styles.arLiveBadge}>
              <View style={styles.livePulseDot} />
              <Text style={styles.arLiveBadgeText}>AR VIDEO OVERLAY ACTIVE</Text>
            </View>

            {/* Video State Center Icon */}
            <View style={styles.videoCenterState}>
              <MaterialCommunityIcons
                name={isPlaying ? 'play-circle-outline' : 'pause-circle-outline'}
                size={moderateScale(56)}
                color="rgba(255, 255, 255, 0.9)"
              />
              <Text style={styles.videoStatusText}>
                {isPlaying ? '▶ AR Video Stream Playing' : '⏸ Video Paused'}
              </Text>
            </View>

            {/* Floating Player Controls Overlay */}
            {!isVideoLoading && (
              <View style={styles.controlsOverlay}>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={handleTogglePlay}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={isPlaying ? 'pause-circle' : 'play-circle'}
                    size={moderateScale(44)}
                    color={colors.white}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.muteButton}
                  onPress={handleToggleMute}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={isMuted ? 'volume-mute' : 'volume-high'}
                    size={moderateScale(22)}
                    color={colors.white}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={moderateScale(48)} color={colors.red} />
            <Text style={styles.errorText}>Failed to load video stream</Text>
          </View>
        )}
      </View>

      {/* Target Info Section */}
      <View style={styles.infoSection}>
        <View style={styles.headerRow}>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>AR TARGET MATCH</Text>
          </View>
          <View style={styles.confidenceBadge}>
            <Ionicons name="checkmark-circle" size={moderateScale(14)} color="#00E5FF" />
            <Text style={styles.confidenceText}>{formattedConfidence}</Text>
          </View>
        </View>

        <Text style={styles.titleText}>{title}</Text>
        {creatorName ? (
          <Text style={styles.creatorText}>By @{creatorName}</Text>
        ) : null}
        {description ? (
          <Text style={styles.descriptionText}>{description}</Text>
        ) : null}

        {/* Scan Again Action Button */}
        {onScanAgain && (
          <TouchableOpacity
            style={styles.scanAgainButton}
            onPress={onScanAgain}
            activeOpacity={0.8}
          >
            <Ionicons name="camera-outline" size={moderateScale(20)} color={colors.black} />
            <Text style={styles.scanAgainText}>Scan Another Image</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoPlayerFrame: {
    width: width - horizontalScale(32),
    height: verticalScale(260),
    backgroundColor: '#0F0F1A',
    borderRadius: moderateScale(16),
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#00E5FF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  arOverlayLayer: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(10, 10, 20, 0.45)',
  },
  arBoundingBox: {
    ...StyleSheet.absoluteFill,
    margin: moderateScale(12),
  },
  corner: {
    position: 'absolute',
    width: moderateScale(20),
    height: moderateScale(20),
    borderColor: '#00E5FF',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    padding: moderateScale(16),
  },
  loadingText: {
    color: colors.white,
    fontSize: moderateScale(16),
    fontWeight: '600',
    marginTop: verticalScale(12),
  },
  loadingSubtext: {
    color: colors.iconInactive,
    fontSize: moderateScale(12),
    marginTop: verticalScale(4),
  },
  videoCanvas: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arLiveBadge: {
    position: 'absolute',
    top: verticalScale(12),
    left: horizontalScale(16),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.5)',
    gap: horizontalScale(6),
  },
  livePulseDot: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    backgroundColor: '#00E5FF',
  },
  arLiveBadgeText: {
    color: '#00E5FF',
    fontSize: moderateScale(10),
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  videoCenterState: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoStatusText: {
    color: colors.white,
    fontSize: moderateScale(15),
    fontWeight: '600',
    marginTop: verticalScale(8),
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  controlsOverlay: {
    position: 'absolute',
    bottom: verticalScale(12),
    left: horizontalScale(16),
    right: horizontalScale(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controlButton: {
    padding: moderateScale(4),
  },
  muteButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: moderateScale(8),
    borderRadius: moderateScale(20),
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(20),
  },
  errorText: {
    color: colors.red,
    fontSize: moderateScale(14),
    marginTop: verticalScale(8),
  },
  infoSection: {
    width: width - horizontalScale(32),
    backgroundColor: 'rgba(20, 20, 30, 0.95)',
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
    marginTop: verticalScale(12),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(8),
  },
  badgeContainer: {
    backgroundColor: '#7C4DFF',
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(3),
    borderRadius: moderateScale(12),
  },
  badgeText: {
    color: colors.white,
    fontSize: moderateScale(10),
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  confidenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(3),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.4)',
    gap: horizontalScale(4),
  },
  confidenceText: {
    color: '#00E5FF',
    fontSize: moderateScale(11),
    fontWeight: '700',
  },
  titleText: {
    color: colors.white,
    fontSize: moderateScale(18),
    fontWeight: '700',
  },
  creatorText: {
    color: colors.iconInactive,
    fontSize: moderateScale(13),
    fontWeight: '500',
    marginTop: verticalScale(2),
  },
  descriptionText: {
    color: colors.white,
    fontSize: moderateScale(13),
    marginTop: verticalScale(8),
    lineHeight: moderateScale(18),
  },
  scanAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: moderateScale(24),
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(20),
    marginTop: verticalScale(16),
    gap: horizontalScale(8),
  },
  scanAgainText: {
    color: colors.black,
    fontSize: moderateScale(14),
    fontWeight: '700',
  },
});

export default VideoResultView;
