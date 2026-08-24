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
    private var isVideoPlaying = false

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
        mediaPlayer = MediaPlayer()
        mediaPlayer?.setSurface(surface)

        val numVertices = 4
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

    private var currentVideoUrl: String? = null
    private var isVideoPreparing = false

    fun playVideo(url: String) {
        if ((isVideoPlaying || isVideoPreparing) && currentVideoUrl == url) return
        
        try {
            isVideoPlaying = false
            isVideoPreparing = true
            currentVideoUrl = url

            mediaPlayer?.reset()
            mediaPlayer?.setDataSource(url)
            mediaPlayer?.setOnPreparedListener { mp ->
                mp.isLooping = true
                mp.start()
                isVideoPlaying = true
                isVideoPreparing = false
                Log.d(TAG, "Video playback started for $url")
            }
            mediaPlayer?.setOnErrorListener { _, what, extra ->
                Log.e(TAG, "MediaPlayer error for $url: what=$what, extra=$extra")
                isVideoPlaying = false
                isVideoPreparing = false
                currentVideoUrl = null
                true
            }
            mediaPlayer?.prepareAsync()
        } catch (e: Exception) {
            Log.e(TAG, "Failed to play video", e)
            isVideoPlaying = false
            isVideoPreparing = false
            currentVideoUrl = null
        }
    }

    fun stopVideo() {
        if (isVideoPlaying || isVideoPreparing) {
            try {
                if (mediaPlayer?.isPlaying == true) {
                    mediaPlayer?.pause()
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error pausing mediaPlayer", e)
            }
            isVideoPlaying = false
            isVideoPreparing = false
            currentVideoUrl = null
        }
    }

    fun updateVideoSurface() {
        if (isVideoPlaying) {
            try {
                surfaceTexture?.updateTexImage()
            } catch (e: Exception) {
                // Ignore transient frame update exceptions
            }
        }
    }

    fun draw(viewMatrix: FloatArray, projectionMatrix: FloatArray, pose: Pose, extentX: Float, extentZ: Float) {
        if (!isVideoPlaying) return

        GLES20.glUseProgram(quadProgram)
        GLES20.glBindTexture(GLES11Ext.GL_TEXTURE_EXTERNAL_OES, textureId)

        // Create model matrix from pose
        pose.toMatrix(modelMatrix, 0)
        
        // Scale to match the exact physical size of the detected image
        // extentX and extentZ already represent the full width and height of the image
        Matrix.scaleM(modelMatrix, 0, extentX, 1f, extentZ)

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
