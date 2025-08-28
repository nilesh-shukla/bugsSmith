import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Ring = () => {
  const mountRef = useRef(null);
  const animationIdRef = useRef(null);
  const ringGroupRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    // Prevent double initialization in React Strict Mode
    if (isInitialized.current) return;
    isInitialized.current = true;
    
    if (!mountRef.current) return;

    console.log('🔧 Initializing Ring component...');

    try {
      // Get parent dimensions for proper rendering
      const parent = mountRef.current.parentElement;
      const width = parent ? parent.offsetWidth : window.innerWidth;
      const height = parent ? parent.offsetHeight : window.innerHeight;

      console.log('📐 Canvas dimensions:', width, 'x', height);

      // Scene setup
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        premultipliedAlpha: false
      });
      
      console.log('🎨 WebGL Renderer created');
      
      renderer.setSize(width, height);
      renderer.setClearColor(0x000000, 0); // Fully transparent
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      rendererRef.current = renderer;

      // Check if canvas was created properly
      if (!renderer.domElement) {
        throw new Error('Failed to create WebGL canvas');
      }

      mountRef.current.appendChild(renderer.domElement);
      console.log('🖼️ Canvas added to DOM');

      // Create ring geometry
      const ringGroup = new THREE.Group();
      ringGroupRef.current = ringGroup;

      // Single main ring structure
      const ringGeometry = new THREE.TorusGeometry(8, 0.8, 16, 100);
      const ringMaterial = new THREE.MeshPhongMaterial({
        color: 0x4dd0e1,
        transparent: true,
        opacity: 0.6,
        shininess: 100,
        specular: 0x81c784
      });

      const mainRing = new THREE.Mesh(ringGeometry, ringMaterial);
      mainRing.castShadow = true;
      mainRing.receiveShadow = true;
      ringGroup.add(mainRing);

      console.log('💍 Main ring created');

      // Add dotted particles around the ring
      const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
      const particles = [];

      for (let i = 0; i < 150; i++) {
        const particleMaterial = new THREE.MeshBasicMaterial({
          color: 0x4dd0e1,
          transparent: true,
          opacity: 0.5
        });

        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        const angle = (i / 150) * Math.PI * 2;
        const radius = 8 + Math.random() * 4;
        const height = (Math.random() - 0.5) * 2;

        particle.position.x = Math.cos(angle) * radius;
        particle.position.y = height;
        particle.position.z = Math.sin(angle) * radius;

        ringGroup.add(particle);
        particles.push(particle);
      }

      console.log('✨ Particles created:', particles.length);

      // Apply tilt on Z-axis (around 30 degrees)
      ringGroup.rotation.z = Math.PI / 6;

      scene.add(ringGroup);
      console.log('🎭 Ring group added to scene');

      // Lighting setup - softer lighting for header
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
      directionalLight.position.set(10, 10, 5);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 1024;
      directionalLight.shadow.mapSize.height = 1024;
      scene.add(directionalLight);

      const pointLight = new THREE.PointLight(0x4dd0e1, 0.3, 50);
      pointLight.position.set(0, 0, 10);
      scene.add(pointLight);

      console.log('💡 Lighting setup complete');

      // Camera position - adjusted for header view
      camera.position.set(12, 6, 12);
      camera.lookAt(0, 0, 0);
      
      console.log('📸 Camera positioned');

      // Test render to make sure everything works
      renderer.render(scene, camera);
      console.log('🎬 Initial render complete');

      // Animation variables
      let time = 0;

      // Animation loop
      const animate = () => {
        try {
          animationIdRef.current = requestAnimationFrame(animate);

          time += 0.01;

          if (ringGroup) {
            // Rotate the ring group on Y-axis
            ringGroup.rotation.y += 0.005;

            // Add subtle floating motion
            ringGroup.position.y = Math.sin(time) * 0.5;

            // Animate particles
            particles.forEach((particle, index) => {
              if (particle && particle.material) {
                particle.rotation.y += 0.01 + (index * 0.0001);
                particle.material.opacity = 0.5 + Math.sin(time + index) * 0.2;
              }
            });
          }

          // Subtle camera movement
          camera.position.x = 12 + Math.sin(time * 0.2) * 1.5;
          camera.position.z = 12 + Math.cos(time * 0.2) * 1.5;
          camera.lookAt(0, 0, 0);

          renderer.render(scene, camera);
        } catch (error) {
          console.error('❌ Animation error:', error);
          if (animationIdRef.current) {
            cancelAnimationFrame(animationIdRef.current);
          }
        }
      };

      console.log('🚀 Starting animation loop');
      } catch (error) {
      console.error('💥 THREE.js initialization error:', error);
      
      // Show a fallback div if Three.js fails
      if (mountRef.current) {
        mountRef.current.innerHTML = `
          <div style="
            display: flex; 
            align-items: center; 
            justify-content: center; 
            height: 100%; 
            color: #4dd0e1; 
            font-size: 14px;
            background: transparent;
          ">
            Ring component failed to load
          </div>
        `;
      }
    }

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const parent = mountRef.current.parentElement;
      const newWidth = parent ? parent.offsetWidth : window.innerWidth;
      const newHeight = parent ? parent.offsetHeight : window.innerHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);
    animate();

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      // More thorough canvas cleanup
      if (mountRef.current) {
        // Remove all canvas elements from the mount point
        const canvases = mountRef.current.querySelectorAll('canvas');
        canvases.forEach(canvas => canvas.remove());
        
        // Remove renderer's DOM element if it exists
        if (renderer && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
          mountRef.current.removeChild(renderer.domElement);
        }
      }
      
      // Dispose of resources
      if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss();
      }
      
      // Clean up geometries and materials
      if (typeof ringGeometry !== 'undefined') ringGeometry.dispose();
      if (typeof ringMaterial !== 'undefined') ringMaterial.dispose();
      if (typeof particleGeometry !== 'undefined') particleGeometry.dispose();
      
      particles.forEach(particle => {
        if (particle.material) particle.material.dispose();
      });
      
      // Clear the particles array
      particles.length = 0;
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
};

export default Ring;