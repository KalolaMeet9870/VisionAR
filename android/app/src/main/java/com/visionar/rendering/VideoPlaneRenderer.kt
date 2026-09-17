package com.visionar.rendering

import android.content.Context
import android.graphics.SurfaceTexture
import android.media.MediaPlayer
import android.opengl.GLES11Ext
import android.opengl.GLES20
import android.opengl.Matrix
import android.util.Log
import android.view.Surface
import com.google.ar.core.Pose
import java.io.IOException
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.nio.FloatBuffer

class VideoPlaneRenderer {
    private var quadVertices: FloatBuffer? = null
    private var quadTexCoord: FloatBuffer? = null
    private var quadProgram = 0
    private var quadPositionParam = 0
    private var quadTexCoordParam = 0
    private var modelViewProjectionParam = 0
    private var textureId = -1
    
    private var surfaceTexture: SurfaceTexture? = null
    private var mediaPlayer: MediaPlayer? = null
    private var surface: Surface? = null
    @Volatile private var isVideoPlaying = false
    @Volatile private var isVideoPreparing = false
    @Volatile private var currentVideoUrl: String? = null

    private val modelMatrix = FloatArray(16)
    private val modelViewMatrix = FloatArray(16)
    private val modelViewProjectionMatrix = FloatArray(16)

    fun createOnGlThread(context: Context) {
        val textures = IntArray(1)
        GLES20.glGenTextures(1, textures, 0)
        textureId = textures[0]
        val textureTarget = GLES11Ext.GL_TEXTURE_EXTERNAL_OES
        GLES20.glBindTexture(textureTarget, textureId)
        GLES20.glTexParameteri(textureTarget, GLES20.GL_TEXTURE_WRAP_S, GLES20.GL_CLAMP_TO_EDGE)
        GLES20.glTexParameteri(textureTarget, GLES20.GL_TEXTURE_WRAP_T, GLES20.GL_CLAMP_TO_EDGE)
        GLES20.glTexParameteri(textureTarget, GLES20.GL_TEXTURE_MIN_FILTER, GLES20.GL_LINEAR)
        GLES20.glTexParameteri(textureTarget, GLES20.GL_TEXTURE_MAG_FILTER, GLES20.GL_LINEAR)

        surfaceTexture = SurfaceTexture(textureId)
        surface = Surface(surfaceTexture)
        
        synchronized(this) {
            mediaPlayer = MediaPlayer()
            mediaPlayer?.setSurface(surface)
        }

        val bbVertices = ByteBuffer.allocateDirect(QUAD_COORDS.size * 4)
        bbVertices.order(ByteOrder.nativeOrder())
        quadVertices = bbVertices.asFloatBuffer()
        quadVertices?.put(QUAD_COORDS)
        quadVertices?.position(0)

        val bbTexCoords = ByteBuffer.allocateDirect(QUAD_TEXCOORDS.size * 4)
        bbTexCoords.order(ByteOrder.nativeOrder())
        quadTexCoord = bbTexCoords.asFloatBuffer()
        quadTexCoord?.put(QUAD_TEXCOORDS)
        quadTexCoord?.position(0)

        val vertexShader = ShaderUtil.loadGLShader(TAG, context, GLES20.GL_VERTEX_SHADER, "video_plane.vert")
        val fragmentShader = ShaderUtil.loadGLShader(TAG, context, GLES20.GL_FRAGMENT_SHADER, "video_plane.frag")

        quadProgram = GLES20.glCreateProgram()
        GLES20.glAttachShader(quadProgram, vertexShader)
        GLES20.glAttachShader(quadProgram, fragmentShader)
        GLES20.glLinkProgram(quadProgram)
        GLES20.glUseProgram(quadProgram)

        quadPositionParam = GLES20.glGetAttribLocation(quadProgram, "a_Position")
        quadTexCoordParam = GLES20.glGetAttribLocation(quadProgram, "a_TexCoord")
        modelViewProjectionParam = GLES20.glGetUniformLocation(quadProgram, "u_ModelViewProjection")
    }

    @Synchronized
    fun playVideo(url: String) {
        // Case 1: Already actively playing this video
        if (isVideoPlaying && currentVideoUrl == url) return

        // Case 2: Resume playback if already prepared for this exact URL
        if (currentVideoUrl == url && mediaPlayer != null && !isVideoPreparing) {
            try {
                if (surface != null && surface!!.isValid) {
                    mediaPlayer?.setSurface(surface)
                }
                mediaPlayer?.isLooping = true
                mediaPlayer?.start()
                isVideoPlaying = true
                Log.d(TAG, "Resumed video playback instantly for $url")
                return
            } catch (e: Exception) {
                Log.w(TAG, "Could not resume mediaPlayer, re-initializing: ${e.message}")
            }
        }

        // Case 3: If currently preparing this exact URL, let prepareAsync complete
        if (isVideoPreparing && currentVideoUrl == url) return

        // Case 4: Load new video URL or re-initialize
        try {
            isVideoPlaying = false
            isVideoPreparing = true
            currentVideoUrl = url

            if (mediaPlayer == null) {
                mediaPlayer = MediaPlayer()
            } else {
                mediaPlayer?.reset()
            }

            if (surface != null && surface!!.isValid) {
                mediaPlayer?.setSurface(surface)
            }

            mediaPlayer?.setDataSource(url)
            mediaPlayer?.setOnPreparedListener { mp ->
                synchronized(this@VideoPlaneRenderer) {
                    if (isVideoPreparing && currentVideoUrl == url) {
                        try {
                            mp.isLooping = true
                            mp.start()
                            isVideoPlaying = true
                            isVideoPreparing = false
                            Log.d(TAG, "Video playback started for $url")
                        } catch (e: Exception) {
                            Log.e(TAG, "Error starting mediaPlayer playback", e)
                            isVideoPlaying = false
                            isVideoPreparing = false
                        }
                    } else {
                        try {
                            mp.pause()
                        } catch (e: Exception) {
                            Log.e(TAG, "Error pausing cancelled video player", e)
                        }
                        isVideoPlaying = false
                        isVideoPreparing = false
                    }
                }
            }
            mediaPlayer?.setOnErrorListener { _, what, extra ->
                Log.e(TAG, "MediaPlayer error for $url: what=$what, extra=$extra")
                synchronized(this@VideoPlaneRenderer) {
                    isVideoPlaying = false
                    isVideoPreparing = false
                    currentVideoUrl = null
                }
                true
            }
            mediaPlayer?.prepareAsync()
        } catch (e: Exception) {
            Log.e(TAG, "Failed to play video: ${e.message}", e)
            isVideoPlaying = false
            isVideoPreparing = false
            currentVideoUrl = null
        }
    }

    @Synchronized
    fun stopVideo() {
        try {
            if (mediaPlayer?.isPlaying == true) {
                mediaPlayer?.pause()
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error pausing mediaPlayer", e)
        }
        isVideoPlaying = false
        isVideoPreparing = false
    }

    @Synchronized
    fun release() {
        stopVideo()
        try {
            mediaPlayer?.stop()
            mediaPlayer?.release()
            mediaPlayer = null
            surface?.release()
            surface = null
            surfaceTexture?.release()
            surfaceTexture = null
        } catch (e: Exception) {
            Log.e(TAG, "Error releasing VideoPlaneRenderer resources", e)
        }
    }

    fun updateVideoSurface() {
        if (isVideoPlaying && surfaceTexture != null) {
            try {
                surfaceTexture?.updateTexImage()
            } catch (e: Exception) {
                // Ignore transient frame update exceptions
            }
        }
    }

    fun draw(viewMatrix: FloatArray, projectionMatrix: FloatArray, pose: Pose, extentX: Float, extentZ: Float) {
        if (!isVideoPlaying) return

        try {
            GLES20.glUseProgram(quadProgram)
            GLES20.glBindTexture(GLES11Ext.GL_TEXTURE_EXTERNAL_OES, textureId)

            // Create model matrix from pose
            pose.toMatrix(modelMatrix, 0)
            
            // Adjust scaling to match physical target size while preserving video aspect ratio
            var drawExtentX = extentX
            var drawExtentZ = extentZ

            if (mediaPlayer != null && isVideoPlaying) {
                val vWidth = mediaPlayer?.videoWidth ?: 0
                val vHeight = mediaPlayer?.videoHeight ?: 0
                if (vWidth > 0 && vHeight > 0 && extentX > 0f && extentZ > 0f) {
                    val videoAspect = vWidth.toFloat() / vHeight.toFloat()
                    val targetAspect = extentX / extentZ

                    // Scale to fit inside target boundary while matching video aspect ratio
                    if (videoAspect > targetAspect) {
                        drawExtentZ = extentX / videoAspect
                    } else {
                        drawExtentX = extentZ * videoAspect
                    }
                }
            }

            Matrix.scaleM(modelMatrix, 0, drawExtentX, 1f, drawExtentZ)

            Matrix.multiplyMM(modelViewMatrix, 0, viewMatrix, 0, modelMatrix, 0)
            Matrix.multiplyMM(modelViewProjectionMatrix, 0, projectionMatrix, 0, modelViewMatrix, 0)

            GLES20.glUniformMatrix4fv(modelViewProjectionParam, 1, false, modelViewProjectionMatrix, 0)

            GLES20.glVertexAttribPointer(quadPositionParam, COORDS_PER_VERTEX, GLES20.GL_FLOAT, false, 0, quadVertices)
            GLES20.glVertexAttribPointer(quadTexCoordParam, TEXCOORDS_PER_VERTEX, GLES20.GL_FLOAT, false, 0, quadTexCoord)

            GLES20.glEnableVertexAttribArray(quadPositionParam)
            GLES20.glEnableVertexAttribArray(quadTexCoordParam)

            GLES20.glEnable(GLES20.GL_BLEND)
            GLES20.glBlendFunc(GLES20.GL_SRC_ALPHA, GLES20.GL_ONE_MINUS_SRC_ALPHA)

            GLES20.glDrawArrays(GLES20.GL_TRIANGLE_STRIP, 0, 4)

            GLES20.glDisableVertexAttribArray(quadPositionParam)
            GLES20.glDisableVertexAttribArray(quadTexCoordParam)
            GLES20.glDisable(GLES20.GL_BLEND)
        } catch (e: Exception) {
            Log.e(TAG, "Error in VideoPlaneRenderer draw", e)
        }
    }

    companion object {
        private val TAG = VideoPlaneRenderer::class.java.simpleName
        private const val COORDS_PER_VERTEX = 3
        private const val TEXCOORDS_PER_VERTEX = 2
        private val QUAD_COORDS = floatArrayOf(
            -0.5f, 0.0f, 0.5f,   // Top-left
            -0.5f, 0.0f, -0.5f,  // Bottom-left  
            0.5f, 0.0f, 0.5f,    // Top-right
            0.5f, 0.0f, -0.5f    // Bottom-right
        )
        private val QUAD_TEXCOORDS = floatArrayOf(
            0.0f, 1.0f,  // Top-left (flipped)
            0.0f, 0.0f,  // Bottom-left (flipped)
            1.0f, 1.0f,  // Top-right (flipped)
            1.0f, 0.0f   // Bottom-right (flipped)
        )
    }
}
