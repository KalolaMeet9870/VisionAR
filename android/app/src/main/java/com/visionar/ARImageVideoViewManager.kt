package com.visionar

import com.facebook.react.common.MapBuilder
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.bridge.ReadableArray

class ARImageVideoViewManager : SimpleViewManager<ARImageVideoView>() {
    override fun getName(): String {
        return "ARImageVideoView"
    }

    override fun createViewInstance(reactContext: ThemedReactContext): ARImageVideoView {
        return ARImageVideoView(reactContext)
    }

    @ReactProp(name = "targets")
    fun setTargets(view: ARImageVideoView, targets: ReadableArray) {
        view.setTargets(targets)
    }



    override fun getExportedCustomBubblingEventTypeConstants(): Map<String, Any> {
        return MapBuilder.builder<String, Any>()
            .put(
                "onImageDetected",
                MapBuilder.of(
                    "phasedRegistrationNames",
                    MapBuilder.of("bubbled", "onImageDetected")
                )
            )
            .build()
    }
}
