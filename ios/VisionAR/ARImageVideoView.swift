import Foundation
import ARKit
import SceneKit
import React

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
    // Restart session if needed when targets change
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
    
    // Notify JS
    if let onImageDetected = onImageDetected {
      onImageDetected(["id": imageName])
    }
    
    // Create Plane
    let plane = SCNPlane(width: referenceImage.physicalSize.width,
                         height: referenceImage.physicalSize.height)
    
    // Create Video Node
    if let url = URL(string: videoUrl) {
      let player = AVPlayer(url: url)
      let videoNode = SKVideoNode(avPlayer: player)
      let videoScene = SKScene(size: CGSize(width: 1280, height: 720))
      
      videoNode.position = CGPoint(x: videoScene.size.width / 2, y: videoScene.size.height / 2)
      videoNode.yScale = -1.0 // Flip video
      videoNode.size = videoScene.size
      videoScene.addChild(videoNode)
      
      plane.firstMaterial?.diffuse.contents = videoScene
      player.play()
    }
    
    let planeNode = SCNNode(geometry: plane)
    planeNode.eulerAngles.x = -.pi / 2
    
    node.addChildNode(planeNode)
  }
}
