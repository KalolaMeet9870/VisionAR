import React from 'react';
import { requireNativeComponent, ViewProps, ViewStyle } from 'react-native';

export type ImageTarget = {
    id: string;
    imageUrl: string; // URL for the target image
    physicalWidth: number; // in meters
    videoUrl: string; // video URL for this specific target
};

interface NativeProps extends ViewProps {
    targets: ReadonlyArray<{
        id: string;
        imageUrl: string;
        physicalWidth: number;
        videoUrl: string;
    }>;
    onImageDetected?: (event: { nativeEvent: { id: string } }) => void;
}

const NativeARImageVideoView = requireNativeComponent<NativeProps>('ARImageVideoView');

interface ARImageVideoViewProps {
    style?: ViewStyle;
    targets: ImageTarget[];
    onImageDetected?: (id: string) => void;
}

export const ARImageVideoView: React.FC<ARImageVideoViewProps> = ({
    style,
    targets,
    onImageDetected,
}) => {
    const _onImageDetected = (event: { nativeEvent: { id: string } }) => {
        if (onImageDetected) {
            console.log('Image detected:', event.nativeEvent.id);
            onImageDetected(event.nativeEvent.id);
        }
    };

    return (
        <NativeARImageVideoView
            targets={targets}
            style={style}
            onImageDetected={_onImageDetected}
        />
    );
};
