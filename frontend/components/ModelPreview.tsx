import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { toast } from '@/hooks/use-toast';

interface ModelPreviewProps {
  file: File | null;
}

export const ModelPreview = ({ file }: ModelPreviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Setup renderer with better quality settings
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Setup controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controlsRef.current = controls;

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Add fill light
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-5, 0, -5);
    scene.add(fillLight);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      if (cameraRef.current) {
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
      }
      
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    if (!file || !sceneRef.current) return;

    const loader = new FBXLoader();
    const objectURL = URL.createObjectURL(file);

    // Clear existing model
    const existingMeshes = sceneRef.current.children.filter(child => child instanceof THREE.Mesh);
    existingMeshes.forEach(mesh => {
      if (mesh.geometry) mesh.geometry.dispose();
      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(mat => mat.dispose());
        } else {
          mesh.material.dispose();
        }
      }
      sceneRef.current?.remove(mesh);
    });

    loader.load(
      objectURL,
      (object) => {
        // Process materials and apply better defaults
        object.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            // Create a new standard material for each mesh
            const newMaterial = new THREE.MeshStandardMaterial({
              color: 0x808080, // Default gray color
              metalness: 0.5,
              roughness: 0.5,
              normalScale: new THREE.Vector2(1, 1),
            });

            // Try to preserve original material properties if they exist
            if (child.material) {
              const oldMaterial = child.material as THREE.Material;
              if ('color' in oldMaterial) {
                newMaterial.color = (oldMaterial as THREE.MeshStandardMaterial).color;
              }
              if ('map' in oldMaterial && (oldMaterial as any).map) {
                newMaterial.map = (oldMaterial as any).map;
              }
            }

            // Apply the new material
            child.material = newMaterial;

            // Enable shadows
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        // Add to scene
        sceneRef.current?.add(object);

        // Center and scale the model
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxDim;
        object.scale.setScalar(scale);

        object.position.sub(center.multiplyScalar(scale));

        // Update camera position based on model size
        if (cameraRef.current) {
          const distance = maxDim * 2;
          cameraRef.current.position.z = distance;
          if (controlsRef.current) {
            controlsRef.current.minDistance = distance * 0.5;
            controlsRef.current.maxDistance = distance * 2;
          }
        }
      },
      (xhr) => {
        const progress = (xhr.loaded / xhr.total) * 100;
        console.log(`Loading: ${Math.round(progress)}%`);
      },
      (error) => {
        console.error('Error loading FBX:', error);
        toast({
          title: "Error loading model",
          description: "There was an error loading the 3D model. Please try a different file.",
          variant: "destructive"
        });
      }
    );

    return () => URL.revokeObjectURL(objectURL);
  }, [file]);

  return (
    <div ref={containerRef} className="preview-container" />
  );
};