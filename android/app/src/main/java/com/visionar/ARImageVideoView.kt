package com.visionar

import android.content.Context
import android.graphics.BitmapFactory
import android.opengl.GLES20
import android.opengl.GLSurfaceView
import android.util.Log
import android.widget.FrameLayout
import com.visionar.rendering.BackgroundRenderer
import com.visionar.rendering.DisplayRotationHelper
import com.visionar.rendering.VideoPlaneRenderer
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.uimanager.events.RCTEventEmitter
import com.google.ar.core.AugmentedImage
import com.google.ar.core.AugmentedImageDatabase
import com.google.ar.core.Config
import com.google.ar.core.Session
import com.google.ar.core.TrackingState
import com.google.ar.core.exceptions.CameraNotAvailableException
import java.io.IOException
import javax.microedition.khronos.egl.EGLConfig
import javax.microedition.khronos.opengles.GL10

class ARImageVideoView(context: Context) : FrameLayout(context), GLSurfaceView.Renderer, LifecycleEventListener {
    private val surfaceView: GLSurfaceView
    private var session: Session? = null
    private val displayRotationHelper: DisplayRotationHelper
    private val backgroundRenderer = BackgroundRenderer()
    private val videoPlaneRenderer = VideoPlaneRenderer()

    private var targets: ReadableArray? = null
    private val videoUrlMap = HashMap<String, String>()
    private var isSessionPaused = false

    init {
        surfaceView = GLSurfaceView(context)
        surfaceView.preserveEGLContextOnPause = true
        surfaceView.setEGLContextClientVersion(2)
        surfaceView.setEGLConfigChooser(8, 8, 8, 8, 16, 0)
        surfaceView.setRenderer(this)
        surfaceView.renderMode = GLSurfaceView.RENDERMODE_CONTINUOUSLY
        surfaceView.setWillNotDraw(false)

        addView(surfaceView)

        displayRotationHelper = DisplayRotationHelper(context)
        (context as? ReactContext)?.addLifecycleEventListener(this)
    }

    fun setTargets(targets: ReadableArray) {
        this.targets = targets
        videoUrlMap.clear()
        
        Thread {
            val databaseImages = ArrayList<Triple<String, android.graphics.Bitmap, Float>>()
            
            // Try loading local asset target poster1.jpg first so it always works offline
            try {
                context.assets.open("poster1.jpg").use { inputStream ->
                    val bitmap = BitmapFactory.decodeStream(inputStream)
                    if (bitmap != null) {
                        databaseImages.add(Triple("poster1", bitmap, 0.2f))
                        if (!videoUrlMap.containsKey("poster1")) {
                            videoUrlMap["poster1"] = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                        }
                        Log.d(TAG, "Loaded local asset image poster1.jpg into AugmentedImageDatabase")
                    }
                }
            } catch (e: Exception) {
                Log.w(TAG, "Could not load local asset poster1.jpg: ${e.message}")
            }

            for (i in 0 until targets.size()) {
                val target = targets.getMap(i)
                val id = target?.getString("id")
                val imageUrl = target?.getString("imageUrl")
                val videoUrl = target?.getString("videoUrl")
                val physicalWidth = target?.getDouble("physicalWidth")?.toFloat()

                if (id != null && videoUrl != null) {
                    videoUrlMap[id] = videoUrl
                }

                if (id != null && imageUrl != null && physicalWidth != null) {
                    try {
                        val url = java.net.URL(imageUrl)
                        val connection = url.openConnection() as java.net.HttpURLConnection
                        connection.doInput = true
                        connection.instanceFollowRedirects = true
                        connection.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                        connection.connectTimeout = 5000
                        connection.readTimeout = 5000
                        connection.connect()
                        val responseCode = connection.responseCode
                        if (responseCode == java.net.HttpURLConnection.HTTP_OK) {
                            val input = connection.inputStream
                            val bitmap = BitmapFactory.decodeStream(input)
                            if (bitmap != null) {
                                databaseImages.add(Triple(id, bitmap, physicalWidth))
                                Log.d(TAG, "Successfully loaded target image: $id ($imageUrl)")
                            } else {
                                Log.e(TAG, "Bitmap decoded as null for $imageUrl")
                            }
                        } else {
                            Log.e(TAG, "Failed to download image $imageUrl, status: $responseCode")
                        }
                    } catch (e: Exception) {
                        Log.e(TAG, "Failed to download image $imageUrl", e)
                    }
                }
            }

            (context as ReactContext).runOnUiQueueThread {
                setupSession(databaseImages)
            }
        }.start()
    }

    private fun setupSession(databaseImages: List<Triple<String, android.graphics.Bitmap, Float>>) {
        if (session == null) {
            try {
                val availability = com.google.ar.core.ArCoreApk.getInstance().checkAvailability(context)
                Log.d(TAG, "ARCore availability: $availability")
                
                val reactContext = context as? ReactContext
                val currentActivity = reactContext?.currentActivity
                if (currentActivity != null) {
                    val installStatus = com.google.ar.core.ArCoreApk.getInstance().requestInstall(currentActivity, true)
                    if (installStatus == com.google.ar.core.ArCoreApk.InstallStatus.INSTALL_REQUESTED) {
                        Log.i(TAG, "ARCore install requested from Google Play Store")
                        return
                    }
                }
                
                session = Session(context)
            } catch (e: com.google.ar.core.exceptions.UnavailableException) {
                Log.e(TAG, "ARCore unavailable or not installed: ${e.message}", e)
                return
            } catch (e: Exception) {
                Log.e(TAG, "Failed to create AR session: ${e.message}", e)
                return
            }
        }

        val config = Config(session)
        config.focusMode = Config.FocusMode.AUTO
        config.updateMode = Config.UpdateMode.LATEST_CAMERA_IMAGE

        if (databaseImages.isNotEmpty()) {
            val database = AugmentedImageDatabase(session)
            for ((name, bitmap, width) in databaseImages) {
                database.addImage(name, bitmap, width)
            }
            config.augmentedImageDatabase = database
        }

        session?.configure(config)
        
        if (!isSessionPaused) {
            try {
                session?.resume()
            } catch (e: CameraNotAvailableException) {
                Log.e(TAG, "Camera not available", e)
            }
        }
    }

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        displayRotationHelper.onResume()
        if (isSessionPaused) {
            try {
                session?.resume()
                isSessionPaused = false
            } catch (e: Exception) {
                Log.e(TAG, "Error resuming session on attach", e)
            }
        }
    }

    override fun onDetachedFromWindow() {
        super.onDetachedFromWindow()
        displayRotationHelper.onPause()
        videoPlaneRenderer.stopVideo()
        try {
            session?.pause()
            isSessionPaused = true
        } catch (e: Exception) {
            Log.e(TAG, "Error pausing session on detach", e)
        }
    }

    override fun onHostResume() {
        displayRotationHelper.onResume()
        if (isSessionPaused) {
            try {
                session?.resume()
                isSessionPaused = false
            } catch (e: Exception) {
                Log.e(TAG, "Error resuming session in onHostResume", e)
            }
        }
    }

    override fun onHostPause() {
        displayRotationHelper.onPause()
        videoPlaneRenderer.stopVideo()
        if (!isSessionPaused) {
            try {
                session?.pause()
                isSessionPaused = true
            } catch (e: Exception) {
                Log.e(TAG, "Error pausing session in onHostPause", e)
            }
        }
    }

    override fun onHostDestroy() {
        videoPlaneRenderer.release()
        try {
            session?.close()
        } catch (e: Exception) {
            Log.e(TAG, "Error closing session in onHostDestroy", e)
        }
        session = null
    }

    override fun onSurfaceCreated(gl: GL10?, config: EGLConfig?) {
        GLES20.glClearColor(0.1f, 0.1f, 0.1f, 1.0f)
        backgroundRenderer.createOnGlThread(context)
        videoPlaneRenderer.createOnGlThread(context)
    }

    override fun onSurfaceChanged(gl: GL10?, width: Int, height: Int) {
        displayRotationHelper.onSurfaceChanged(width, height)
        GLES20.glViewport(0, 0, width, height)
    }

    override fun onDrawFrame(gl: GL10?) {
        GLES20.glClear(GLES20.GL_COLOR_BUFFER_BIT or GLES20.GL_DEPTH_BUFFER_BIT)

        if (session == null || isSessionPaused) return

        displayRotationHelper.updateSessionIfNeeded(session!!)

        try {
            session!!.setCameraTextureName(backgroundRenderer.textureId)
            val frame = session!!.update()
            
            backgroundRenderer.draw(frame)
            videoPlaneRenderer.updateVideoSurface()

            val camera = frame.camera
            val projmtx = FloatArray(16)
            camera.getProjectionMatrix(projmtx, 0, 0.1f, 100.0f)
            val viewmtx = FloatArray(16)
            camera.getViewMatrix(viewmtx, 0)

            val allAugmentedImages = session!!.getAllTrackables(AugmentedImage::class.java)
            var hasActiveTrackingImage = false

            for (augmentedImage in allAugmentedImages) {
                if (augmentedImage.trackingState == TrackingState.TRACKING &&
                    augmentedImage.trackingMethod == AugmentedImage.TrackingMethod.FULL_TRACKING) {
                    
                    hasActiveTrackingImage = true
                    val event = Arguments.createMap()
                    event.putString("id", augmentedImage.name)
                    (context as ReactContext)
                        .getJSModule(RCTEventEmitter::class.java)
                        .receiveEvent(id, "onImageDetected", event)

                    val videoUrl = videoUrlMap[augmentedImage.name]
                    if (videoUrl != null) {
                        videoPlaneRenderer.playVideo(videoUrl)
                        videoPlaneRenderer.draw(
                            viewmtx,
                            projmtx,
                            augmentedImage.centerPose,
                            augmentedImage.extentX,
                            augmentedImage.extentZ
                        )
                    }
                    break
                }
            }

            if (!hasActiveTrackingImage) {
                videoPlaneRenderer.stopVideo()
            }

        } catch (e: Exception) {
            Log.e(TAG, "Exception on draw frame", e)
        }
    }

    companion object {
        private val TAG = ARImageVideoView::class.java.simpleName
    }
}
