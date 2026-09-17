import Foundation
import ARKit
import SceneKit
import React
import AVFoundation

@objc(ARImageVideoViewManager)
class ARImageVideoViewManager: RCTViewManager {
  
  override func view() -> UIView! {
    return ARImageVideoView()
  }
  
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
}

class ARImageVideoView: UIView, ARSCNViewDelegate {
  
  var arView: ARSCNView!
  var targets: [NSDictionary] = []
  var videoUrl: String = ""
  
  @objc var onImageDetected: RCTBubblingEventBlock?
  
  override init(frame: CGRect) {
    super.init(frame: frame)
    setupARView()
  }
  
  required init?(coder: NSCoder) {
    super.init(coder: coder)
    setupARView()
  }
  
  func setupARView() {
    arView = ARSCNView(frame: self.bounds)
    arView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
    arView.delegate = self
    self.addSubview(arView)
  }
  
  override func layoutSubviews() {
    super.layoutSubviews()
    startARSession()
  }
  
  @objc func setTargets(_ targets: [NSDictionary]) {
    self.targets = targets
    startARSession()
  }
  
  @objc func setVideoUrl(_ url: String) {
    self.videoUrl = url
  }
  
  func startARSession() {
    let configuration = ARImageTrackingConfiguration()
    
    guard let referenceImages = ARReferenceImage.referenceImages(inGroupNamed: "AR Resources", bundle: nil) else {
      print("Missing expected asset group 'AR Resources'.")
      return
    }
    
    configuration.trackingImages = referenceImages
    configuration.maximumNumberOfTrackedImages = 1
    
    arView.session.run(configuration, options: [.resetTracking, .removeExistingAnchors])
  }
  
  // MARK: - ARSCNViewDelegate
  
  func renderer(_ renderer: SCNSceneRenderer, didAdd node: SCNNode, for anchor: ARAnchor) {
    guard let imageAnchor = anchor as? ARImageAnchor else { return }
    
    let referenceImage = imageAnchor.referenceImage
    let imageName = referenceImage.name ?? "unknown"
    
    print("Detected image: \(imageName)")
    
    // Notify JS layer
    if let onImageDetected = onImageDetected {
      onImageDetected(["id": imageName])
    }
    
    // Look up specific videoUrl for the detected image target
    var targetVideoUrl: String? = self.videoUrl.isEmpty ? nil : self.videoUrl
    for targetDict in self.targets {
      if let targetId = targetDict["id"] as? String, targetId == imageName {
        if let vUrl = targetDict["videoUrl"] as? String, !vUrl.isEmpty {
          targetVideoUrl = vUrl
          break
        }
      }
    }
    
    // Physical dimensions of detected target image
    let physicalWidth = referenceImage.physicalSize.width
    let physicalHeight = referenceImage.physicalSize.height
    
    let plane = SCNPlane(width: physicalWidth, height: physicalHeight)
    
    if let urlStr = targetVideoUrl, let url = URL(string: urlStr), !urlStr.isEmpty {
      let player = AVPlayer(url: url)
      let videoNode = SKVideoNode(avPlayer: player)
      
      // Maintain exact physical aspect ratio to prevent video stretching/sketching
      let baseWidth: CGFloat = 1280.0
      let baseHeight: CGFloat = baseWidth * (physicalHeight / physicalWidth)
      let videoScene = SKScene(size: CGSize(width: baseWidth, height: baseHeight))
      
      videoNode.position = CGPoint(x: videoScene.size.width / 2.0, y: videoScene.size.height / 2.0)
      videoNode.yScale = -1.0 // Flip video vertically for SCNPlane mapping
      videoNode.size = videoScene.size
      videoScene.addChild(videoNode)
      
      plane.firstMaterial?.diffuse.contents = videoScene
      plane.firstMaterial?.isDoubleSided = true
      player.play()
    }
    
    let planeNode = SCNNode(geometry: plane)
    planeNode.eulerAngles.x = -.pi / 2
    
    node.addChildNode(planeNode)
  }
  
  func renderer(_ renderer: SCNSceneRenderer, didUpdate node: SCNNode, for anchor: ARAnchor) {
    guard let imageAnchor = anchor as? ARImageAnchor else { return }
    // Hide node if tracking is lost during motion
    node.isHidden = !imageAnchor.isTracked
  }
}

