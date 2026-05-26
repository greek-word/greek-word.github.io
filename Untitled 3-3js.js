
        // Three.js Scene Setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('canvas-container').appendChild(renderer.domElement);

        // Background particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particleCount = 1000;
        
        const posArray = new Float32Array(particleCount * 3);
        for(let i = 0; i < particleCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 10;
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.02,
            color: 0x88dac7,
            transparent: true,
            opacity: 0.8
        });
        
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        // Floating objects
        const objects = [];
        const colors = [0xff6b6b, 0x4ecdc4, 0x88dac7, 0xffd166, 0x06d6a0];
        
        for(let i = 0; i < 10; i++) {
            const geometry = Math.random() > 0.5 
                ? new THREE.IcosahedronGeometry(Math.random() * 0.1 + 0.05, 0) 
                : new THREE.TorusGeometry(Math.random() * 0.1 + 0.05, Math.random() * 0.03 + 0.01, 16, 32);
            
            const material = new THREE.MeshStandardMaterial({
                color: colors[Math.floor(Math.random() * colors.length)],
                metalness: 0.3,
                roughness: 0.4,
                transparent: true,
                opacity: 0.8
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            
            mesh.position.set(
                (Math.random() - 0.5) * 5,
                (Math.random() - 0.5) * 5,
                (Math.random() - 0.5) * 5
            );
            
            mesh.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            
            // Store original position for floating animation
            mesh.userData = {
                originalY: mesh.position.y,
                speed: Math.random() * 0.2 + 0.1,
                rotationSpeed: Math.random() * 0.02 + 0.01
            };
            
            scene.add(mesh);
            objects.push(mesh);
        }

        // Lights
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);
        
        const pointLight = new THREE.PointLight(0xff6b6b, 1, 10);
        pointLight.position.set(2, 2, 2);
        scene.add(pointLight);

        // Camera position
        camera.position.z = 3;

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            
            // Animate particles
            particlesMesh.rotation.x += 0.0001;
            particlesMesh.rotation.y += 0.0001;
            
            // Animate floating objects
            objects.forEach(obj => {
                obj.position.y = obj.userData.originalY + Math.sin(Date.now() * 0.001 * obj.userData.speed) * 0.3;
                obj.rotation.x += obj.userData.rotationSpeed * 0.5;
                obj.rotation.y += obj.userData.rotationSpeed;
            });
            
            renderer.render(scene, camera);
        }
        
        animate();

        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Loader option selection
        const withLoaderBtn = document.getElementById('withLoader');
        const withoutLoaderBtn = document.getElementById('withoutLoader');
        const loaderOption = document.querySelector('.loader-option');
        const loader = document.querySelector('.loader');
        const loaderText = document.getElementById('loaderText');
        const progress = document.getElementById('progress');
        const initialAnimation = document.getElementById('initialAnimation');
        const content = document.querySelector('.content');
        const nav = document.querySelector('nav');

        // Create initial animation elements
        function createInitialAnimation() {
            // Create name element
            const nameElement = document.createElement('div');
            nameElement.className = 'name-animation';
            nameElement.textContent = 'Suraj Kumar';
            initialAnimation.appendChild(nameElement);
            
            // Create tagline element
            const taglineElement = document.createElement('div');
            taglineElement.className = 'tagline-animation';
            taglineElement.textContent = '3D Artist & Creative Developer';
            initialAnimation.appendChild(taglineElement);
            
            // Create particles
            for (let i = 0; i < 30; i++) {
                const particle = document.createElement('div');
                particle.className = 'animation-particle';
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.top = `${Math.random() * 100}%`;
                particle.style.width = `${Math.random() * 15 + 5}px`;
                particle.style.height = particle.style.width;
                initialAnimation.appendChild(particle);
            }
            
            // Create circles
            for (let i = 0; i < 5; i++) {
                const circle = document.createElement('div');
                circle.className = 'animation-circle';
                circle.style.borderColor = i % 2 === 0 ? '#ff6b6b' : '#88dac7';
                circle.style.width = `${Math.random() * 300 + 100}px`;
                circle.style.height = circle.style.width;
                circle.style.left = `${Math.random() * 100}%`;
                circle.style.top = `${Math.random() * 100}%`;
                initialAnimation.appendChild(circle);
            }
        }

        // Cursor follower
        const cursorFollower = document.querySelector('.cursor-follower');
        document.addEventListener('mousemove', (e) => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        });

        // Make elements interactive with cursor
        const interactiveElements = document.querySelectorAll('button, a, .content');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorFollower.classList.add('active');
            });
            el.addEventListener('mouseleave', () => {
                cursorFollower.classList.remove('active');
            });
        });

        // With loader option
        withLoaderBtn.addEventListener('click', () => {
            loaderOption.style.display = 'none';
            loader.style.display = 'flex';
            
            // Simulate loading progress
            let width = 0;
            const interval = setInterval(() => {
                width += Math.random() * 10;
                progress.style.width = `${width}%`;
                
                if(width >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        loader.style.opacity = '0';
                        setTimeout(() => {
                            loader.style.display = 'none';
                            createInitialAnimation();
                            startInitialAnimation();
                        }, 500);
                    }, 500);
                }
            }, 200);
            
            // Change loading text randomly
            const loadingTexts = [
                "Loading creative assets...",
                "Preparing 3D environment...",
                "Almost there...",
                "Final touches..."
            ];
            
            let textIndex = 0;
            const textInterval = setInterval(() => {
                loaderText.style.opacity = '0';
                setTimeout(() => {
                    textIndex = (textIndex + 1) % loadingTexts.length;
                    loaderText.textContent = loadingTexts[textIndex];
                    loaderText.style.opacity = '1';
                }, 300);
            }, 1500);
            
            setTimeout(() => {
                clearInterval(textInterval);
            }, 6000);
        });

        // Without loader option
        withoutLoaderBtn.addEventListener('click', () => {
            loaderOption.style.opacity = '0';
            setTimeout(() => {
                loaderOption.style.display = 'none';
                createInitialAnimation();
                startInitialAnimation();
            }, 500);
        });

        // Enhanced initial animation
        function startInitialAnimation() {
            initialAnimation.style.display = 'flex';
            
            // Animate particles
            const particles = document.querySelectorAll('.animation-particle');
            particles.forEach(particle => {
                gsap.fromTo(particle,
                    { opacity: 0, scale: 0 },
                    {
                        opacity: 0.7,
                        scale: 1,
                        duration: 1.5,
                        delay: Math.random() * 1,
                        ease: 'power2.out'
                    }
                );
                
                // Floating animation
                gsap.to(particle, {
                    x: `${(Math.random() - 0.5) * 100}`,
                    y: `${(Math.random() - 0.5) * 100}`,
                    duration: Math.random() * 5 + 5,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut'
                });
            });
            
            // Animate circles
            const circles = document.querySelectorAll('.animation-circle');
            circles.forEach(circle => {
                gsap.fromTo(circle,
                    { opacity: 0, scale: 0 },
                    {
                        opacity: 0.3,
                        scale: 1,
                        duration: 2,
                        delay: Math.random() * 1.5,
                        ease: 'elastic.out(1, 0.5)'
                    }
                );
                
                // Rotating animation
                gsap.to(circle, {
                    rotation: 360,
                    duration: Math.random() * 30 + 30,
                    repeat: -1,
                    ease: 'none'
                });
            });
            
            // Animate name
            gsap.to('.name-animation', {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 1.5,
                ease: 'elastic.out(1, 0.5)',
                delay: 0.3
            });
            
            // Animate tagline
            gsap.to('.tagline-animation', {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: 'power3.out',
                delay: 0.8
            });
            
            // Hide initial animation after delay
            setTimeout(() => {
                // Animate out particles and circles
                gsap.to('.animation-particle, .animation-circle', {
                    opacity: 0,
                    scale: 0,
                    duration: 0.8,
                    ease: 'power2.in'
                });
                
                // Animate out text
                gsap.to('.name-animation, .tagline-animation', {
                    opacity: 0,
                    scale: 0.8,
                    duration: 0.8,
                    ease: 'power2.in',
                    onComplete: () => {
                        initialAnimation.style.display = 'none';
                        showContent();
                    }
                });
            }, 3000);
        }

        // Show main content
        function showContent() {
            // Animate in navigation
            gsap.to(nav, {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power2.out'
            });
            
            // Animate astronaut scroll effect
            const mover = document.querySelector('.mover');
            window.addEventListener('scroll', () => {
                const scrollTop = window.scrollY;
                const maxScroll = document.body.scrollHeight - window.innerHeight;
                const scrollPercent = scrollTop / maxScroll;

                // Control animation progress
                mover.style.animationPlayState = 'paused';
                mover.style.animationDelay = `-${scrollPercent * 1}s`;
            });
        }

        // Interactive floating objects
        document.addEventListener('mousemove', (e) => {
            const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
            
            objects.forEach((obj, i) => {
                gsap.to(obj.position, {
                    x: obj.userData.originalX + mouseX * 0.5,
                    y: obj.userData.originalY + mouseY * 0.5,
                    duration: 1.5,
                    ease: 'power2.out'
                });
            });
        });
// TIMELINE INTERACTION
// TIMELINE INTERACTION - FIXED VERSION
const nodes = document.querySelectorAll('.timeline-node');
const cards = document.querySelectorAll('.timeline-card');

// First, hide all cards initially (optional, but good for clarity)
cards.forEach(card => card.classList.remove('active'));

nodes.forEach(node => {
  // Make sure we get the index as a number
  const index = parseInt(node.dataset.index);
  
  node.addEventListener('mouseenter', () => {
    console.log(`Mouse enter node ${index}`);
    activateCard(index);
  });
  
  node.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent event bubbling
    console.log(`Click node ${index}`);
    activateCard(index);
  });
});

function activateCard(index) {
  console.log(`Activating card ${index}`);
  
  if (window.innerWidth <= 768) return; // mobile handled by CSS

  // Remove active class from all cards
  cards.forEach(card => card.classList.remove('active'));
  
  // Find and activate the correct card
  const card = document.querySelector(`.timeline-card[data-index="${index}"]`);
  if (card) {
    card.classList.add('active');
  }
}

// Optional: Close card when clicking elsewhere
document.addEventListener('click', (e) => {
  if (!e.target.closest('.timeline-node') && !e.target.closest('.timeline-card')) {
    cards.forEach(card => card.classList.remove('active'));
  }
});

        // Store original positions for interactive movement
        objects.forEach(obj => {
            obj.userData.originalX = obj.position.x;
            obj.userData.originalY = obj.position.y;
        });

        // Smooth scrolling for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
