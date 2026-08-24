import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, PermissionsAndroid, Platform, Alert } from 'react-native';
import { ARImageVideoView } from '../components/ARImageVideoView';

const generateMockTargets = () => {
    const videoUrls = [
        "https://www.w3schools.com/html/mov_bbb.mp4",
        "https://media.w3.org/2010/05/sintel/trailer.mp4",
        "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
    ];

    const imageUrls = [
        'https://raw.githubusercontent.com/google-ar/arcore-android-sdk/master/samples/augmented_image_java/app/src/main/assets/default.jpg',
        'https://picsum.photos/id/237/800/600.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/e/e8/Elephants_Dream_s5_both.jpg',
        'https://picsum.photos/id/1025/800/600.jpg'
    ];

    return Array.from({ length: 10 }, (_, i) => ({
        id: `poster${i + 1}`,
        imageUrl: imageUrls[i % imageUrls.length],
        physicalWidth: 0.2,
        videoUrl: videoUrls[i % videoUrls.length]
    }));
};

const TARGETS = generateMockTargets();

const ARDemoScreen = () => {
    const [detectedId, setDetectedId] = useState<string | null>(null);
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        requestCameraPermission();
    }, []);

    const requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Camera Permission',
                        message: 'This app needs camera access for AR features',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    setHasPermission(true);
                } else {
                    Alert.alert('Permission Denied', 'Camera permission is required for AR');
                }
            } catch (err) {
                console.warn(err);
            }
        } else {
            // iOS permissions are handled in Info.plist
            setHasPermission(true);
        }
    };

    const handleImageDetected = (id: string) => {
        setDetectedId(id);
        console.log('Image Detected:', id);
    };

    if (!hasPermission) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Requesting camera permission...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ARImageVideoView
                style={styles.arView}
                targets={TARGETS}
                onImageDetected={handleImageDetected}
            />

            <View style={styles.overlay}>
                <Text style={styles.text}>
                    {detectedId ? `Playing video for: ${detectedId}` : 'Point camera at target image'}
                </Text>
                <Text style={styles.helpText}>
                    Image must be printed or on another screen
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    arView: {
        flex: 1,
    },
    overlay: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        alignItems: 'center',
        padding: 20,
    },
    text: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10,
        borderRadius: 8,
        textAlign: 'center',
    },
    helpText: {
        color: 'white',
        fontSize: 14,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 8,
        borderRadius: 8,
        marginTop: 10,
        textAlign: 'center',
    },
});

export default ARDemoScreen;
