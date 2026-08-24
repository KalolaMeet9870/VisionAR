#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(ARImageVideoViewManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(targets, NSArray)
RCT_EXPORT_VIEW_PROPERTY(videoUrl, NSString)
RCT_EXPORT_VIEW_PROPERTY(onImageDetected, RCTBubblingEventBlock)

@end
