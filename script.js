/* =================================================
   PERFECT MOBILE BUSINESS CARD JAVASCRIPT
   =================================================

   Features:
   - Perfect mobile touch handling
   - Reliable flip animation on mobile
   - Optimized for all mobile browsers
   - No hover conflicts on mobile

   ================================================= */

document.addEventListener("DOMContentLoaded", () => {
	console.log("🎴 Initializing Mobile-Perfect Business Card...");

	// MAIN VARIABLES
	const businessCard = document.getElementById("businessCard");
	let isFlipping = false;
	let isFlipped = false;
	let touchStartTime = 0;
	let touchStartY = 0;
	let touchStartX = 0;

	// DEVICE DETECTION
	const isMobile =
		/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent
		) || window.innerWidth <= 768;
	const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
	const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

	console.log(`📱 Device: ${isMobile ? "Mobile" : "Desktop"}`);
	console.log(`👆 Touch: ${isTouch ? "Yes" : "No"}`);
	console.log(`🍎 iOS: ${isIOS ? "Yes" : "No"}`);

	// CHECK IF CARD EXISTS
	if (!businessCard) {
		console.error("❌ Business card element not found!");
		return;
	}

	console.log("✅ Business card element found");

	/* ===== FLIP ANIMATION FUNCTIONS ===== */

	// MAIN FLIP FUNCTION - MOBILE OPTIMIZED
	function flipCard() {
		if (isFlipping) {
			console.log("⏸️ Already flipping, ignoring");
			return;
		}

		console.log(`🔄 Flipping card ${isFlipped ? "to front" : "to back"}`);

		isFlipping = true;
		isFlipped = !isFlipped;

		// MOBILE HAPTIC FEEDBACK
		if (navigator.vibrate && isMobile) {
			navigator.vibrate(30);
		}

		// FLIP ANIMATION
		businessCard.classList.toggle("flipped");

		// MOBILE FLIP SOUND
		if (isMobile) {
			playMobileFlipSound();
		} else {
			playFlipSound();
		}

		// RESET FLIPPING STATE
		const duration = isMobile ? 600 : 800;
		setTimeout(() => {
			isFlipping = false;
			console.log("✅ Flip complete");
		}, duration);

		updateAccessibility();
	}

	/* ===== MOBILE TOUCH HANDLING ===== */

	// TOUCH START HANDLER
	function handleTouchStart(event) {
		// DON'T FLIP IF TOUCHING INTERACTIVE ELEMENTS
		if (
			event.target.closest(".social-link") ||
			event.target.closest(".tech-item")
		) {
			return;
		}

		const touch = event.touches[0];
		touchStartTime = Date.now();
		touchStartX = touch.clientX;
		touchStartY = touch.clientY;

		// PREVENT SCROLLING DURING TOUCH
		event.preventDefault();
	}

	// TOUCH END HANDLER
	function handleTouchEnd(event) {
		// DON'T FLIP IF TOUCHING INTERACTIVE ELEMENTS
		if (
			event.target.closest(".social-link") ||
			event.target.closest(".tech-item")
		) {
			return;
		}

		const touchDuration = Date.now() - touchStartTime;
		const touch = event.changedTouches[0];
		const deltaX = Math.abs(touch.clientX - touchStartX);
		const deltaY = Math.abs(touch.clientY - touchStartY);

		// CHECK FOR VALID TAP (not swipe, not too long)
		if (touchDuration < 500 && deltaX < 30 && deltaY < 30) {
			console.log("👆 Valid tap detected");
			flipCard();
		}

		event.preventDefault();
	}

	// MOUSE CLICK HANDLER (DESKTOP)
	function handleClick(event) {
		// SKIP ON MOBILE DEVICES
		if (isMobile || isTouch) {
			return;
		}

		// DON'T FLIP IF CLICKING ON INTERACTIVE ELEMENTS
		if (
			event.target.closest(".social-link") ||
			event.target.closest(".tech-item")
		) {
			console.log("🚫 Interactive element clicked");
			return;
		}

		console.log("🖱️ Desktop click");
		flipCard();
	}

	// KEYBOARD HANDLER
	function handleKeydown(event) {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			console.log("⌨️ Keyboard flip");
			flipCard();
		}

		if (event.key === "Escape" && isFlipped) {
			console.log("🔙 Escape - flip to front");
			flipCard();
		}
	}

	/* ===== SOUND EFFECTS ===== */

	// MOBILE OPTIMIZED FLIP SOUND
	function playMobileFlipSound() {
		if (window.AudioContext || window.webkitAudioContext) {
			try {
				const audioContext = new (window.AudioContext ||
					window.webkitAudioContext)();
				const oscillator = audioContext.createOscillator();
				const gainNode = audioContext.createGain();

				oscillator.connect(gainNode);
				gainNode.connect(audioContext.destination);

				// MOBILE-FRIENDLY SOUND SETTINGS
				oscillator.frequency.setValueAtTime(
					250,
					audioContext.currentTime
				);
				oscillator.frequency.exponentialRampToValueAtTime(
					125,
					audioContext.currentTime + 0.08
				);

				// QUIETER FOR MOBILE
				gainNode.gain.setValueAtTime(0.003, audioContext.currentTime);
				gainNode.gain.exponentialRampToValueAtTime(
					0.0008,
					audioContext.currentTime + 0.08
				);

				oscillator.start(audioContext.currentTime);
				oscillator.stop(audioContext.currentTime + 0.08);
			} catch (error) {
				console.log("🔇 Mobile audio not available");
			}
		}
	}

	// DESKTOP FLIP SOUND
	function playFlipSound() {
		if (window.AudioContext || window.webkitAudioContext) {
			try {
				const audioContext = new (window.AudioContext ||
					window.webkitAudioContext)();
				const oscillator = audioContext.createOscillator();
				const gainNode = audioContext.createGain();

				oscillator.connect(gainNode);
				gainNode.connect(audioContext.destination);

				oscillator.frequency.setValueAtTime(
					300,
					audioContext.currentTime
				);
				oscillator.frequency.exponentialRampToValueAtTime(
					150,
					audioContext.currentTime + 0.1
				);

				gainNode.gain.setValueAtTime(0.005, audioContext.currentTime);
				gainNode.gain.exponentialRampToValueAtTime(
					0.001,
					audioContext.currentTime + 0.1
				);

				oscillator.start(audioContext.currentTime);
				oscillator.stop(audioContext.currentTime + 0.1);
			} catch (error) {
				console.log("🔇 Desktop audio not available");
			}
		}
	}

	/* ===== ACCESSIBILITY ===== */

	function updateAccessibility() {
		const label = isFlipped
			? "Business card back side showing about and tech stack. Tap to flip to front."
			: "Business card front side showing contact info. Tap to flip to back.";

		businessCard.setAttribute("aria-label", label);
	}

	/* ===== SOCIAL LINKS SETUP ===== */

	function setupSocialLinks() {
		const socialLinks = document.querySelectorAll(".social-link");
		console.log(`🔗 Setting up ${socialLinks.length} social links`);

		socialLinks.forEach((link, index) => {
			// PREVENT CARD FLIP ON SOCIAL LINK INTERACTION
			link.addEventListener(
				"touchstart",
				(event) => {
					event.stopPropagation();
				},
				{ passive: false }
			);

			link.addEventListener(
				"touchend",
				(event) => {
					event.stopPropagation();
				},
				{ passive: false }
			);

			link.addEventListener("click", (event) => {
				event.stopPropagation();
				const platform = link.classList[1] || `social-${index}`;
				console.log(`📱 ${platform} clicked`);
			});

			// MOBILE TAP FEEDBACK
			if (isMobile) {
				link.addEventListener("touchstart", () => {
					link.style.transform = "scale(0.95)";
				});

				link.addEventListener("touchend", () => {
					setTimeout(() => {
						link.style.transform = "";
					}, 150);
				});
			}
		});
	}

	/* ===== TECH STACK SETUP ===== */

	function setupTechStack() {
		const techItems = document.querySelectorAll(".tech-item");
		console.log(`⚡ Setting up ${techItems.length} tech items`);

		techItems.forEach((item, index) => {
			// PREVENT CARD FLIP ON TECH ITEM INTERACTION
			item.addEventListener(
				"touchstart",
				(event) => {
					event.stopPropagation();
				},
				{ passive: false }
			);

			item.addEventListener(
				"touchend",
				(event) => {
					event.stopPropagation();
				},
				{ passive: false }
			);

			item.addEventListener("click", (event) => {
				event.stopPropagation();
				const techClass =
					Array.from(item.classList).find((c) => c !== "tech-item") ||
					`tech-${index}`;
				console.log(`💻 ${techClass} touched`);
			});

			// MOBILE TAP FEEDBACK
			if (isMobile) {
				item.addEventListener("touchstart", () => {
					item.style.transform = "scale(0.9)";
				});

				item.addEventListener("touchend", () => {
					setTimeout(() => {
						item.style.transform = "";
					}, 150);
				});
			}
		});
	}

	/* ===== IMAGE HANDLING ===== */

	function setupImageHandling() {
		const avatar = document.querySelector(".avatar");
		if (avatar) {
			avatar.addEventListener("load", () => {
				console.log("✅ Profile image loaded");
				avatar.style.objectPosition = "center 15%";
			});

			avatar.addEventListener("error", () => {
				console.warn("⚠️ pfp.png not found, using fallback");
				avatar.src =
					"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";
			});

			// CHECK IF ALREADY LOADED
			if (avatar.complete) {
				if (avatar.naturalWidth === 0) {
					console.warn("⚠️ Using fallback image");
					avatar.src =
						"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";
				} else {
					console.log("✅ Profile image cached");
					avatar.style.objectPosition = "center 15%";
				}
			}
		}
	}

	/* ===== MOBILE OPTIMIZATION ===== */

	function optimizeForMobile() {
		if (isMobile) {
			console.log("📱 Applying mobile optimizations");

			// OPTIMIZE ANIMATIONS FOR MOBILE
			businessCard.style.animationDuration = "3s";

			// PREVENT SCROLLING ON CARD
			businessCard.addEventListener(
				"touchmove",
				(event) => {
					event.preventDefault();
				},
				{ passive: false }
			);

			// PREVENT CONTEXT MENU ON MOBILE
			businessCard.addEventListener("contextmenu", (event) => {
				event.preventDefault();
			});

			// iOS SPECIFIC FIXES
			if (isIOS) {
				console.log("🍎 Applying iOS fixes");
				businessCard.style.webkitTransform = "translateZ(0)";
				businessCard.style.webkitBackfaceVisibility = "hidden";
			}
		}

		// PERFORMANCE OPTIMIZATION
		businessCard.style.willChange = "transform";

		setTimeout(() => {
			businessCard.style.willChange = "auto";
		}, 2000);
	}

	/* ===== INITIALIZATION ===== */

	function init() {
		console.log("🚀 Initializing mobile-perfect card...");

		// SET UP EVENT LISTENERS BASED ON DEVICE
		if (isMobile || isTouch) {
			console.log("👆 Setting up touch events");
			businessCard.addEventListener("touchstart", handleTouchStart, {
				passive: false,
			});
			businessCard.addEventListener("touchend", handleTouchEnd, {
				passive: false,
			});
		} else {
			console.log("🖱️ Setting up mouse events");
			businessCard.addEventListener("click", handleClick);
		}

		// KEYBOARD SUPPORT (ALWAYS)
		businessCard.addEventListener("keydown", handleKeydown);

		// ACCESSIBILITY
		businessCard.setAttribute("tabindex", "0");
		businessCard.setAttribute("role", "button");
		updateAccessibility();

		// COMPONENT SETUP
		setupSocialLinks();
		setupTechStack();
		setupImageHandling();
		optimizeForMobile();

		console.log("🎉 Mobile-perfect business card initialized!");
		console.log(
			isMobile ? "👆 Tap anywhere to flip" : "🖱️ Click anywhere to flip"
		);
	}

	/* ===== RESPONSIVE HANDLING ===== */

	let resizeTimer;
	window.addEventListener("resize", () => {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(() => {
			const width = window.innerWidth;
			console.log(`📱 Viewport: ${width}x${window.innerHeight}px`);

			// RE-OPTIMIZE FOR SIZE CHANGES
			if (width <= 768) {
				businessCard.style.animationDuration = "3s";
			} else {
				businessCard.style.animationDuration = "4s";
			}
		}, 250);
	});

	/* ===== DEBUG INFO ===== */

	console.log("🔍 Device Info:");
	console.log(`- Screen: ${window.innerWidth}x${window.innerHeight}px`);
	console.log(`- Device Pixel Ratio: ${window.devicePixelRatio}`);
	console.log(`- User Agent: ${navigator.userAgent.substring(0, 50)}...`);

	// INITIALIZE EVERYTHING
	init();

	/* ===== DEBUG FUNCTIONS ===== */

	window.debugCard = {
		flip: flipCard,
		isFlipped: () => isFlipped,
		isFlipping: () => isFlipping,
		isMobile: () => isMobile,
		reset: () => {
			businessCard.classList.remove("flipped");
			isFlipped = false;
			isFlipping = false;
			console.log("🔄 Card reset");
		},
	};

	console.log("🐛 Debug: window.debugCard available");
});

/* ===== GLOBAL MOBILE FIXES ===== */

// PREVENT DOUBLE TAP ZOOM ON iOS
let lastTouchEnd = 0;
document.addEventListener(
	"touchend",
	(event) => {
		const now = Date.now();
		if (now - lastTouchEnd <= 300) {
			event.preventDefault();
		}
		lastTouchEnd = now;
	},
	{ passive: false }
);

// PREVENT PULL TO REFRESH
let startY = 0;
document.addEventListener("touchstart", (event) => {
	startY = event.touches[0].pageY;
});

document.addEventListener(
	"touchmove",
	(event) => {
		const y = event.touches[0].pageY;
		if (y > startY && window.scrollY === 0) {
			event.preventDefault();
		}
	},
	{ passive: false }
);

// GLOBAL ERROR HANDLING
window.addEventListener("error", (event) => {
	console.error("❌ Error:", event.error?.message || event.message);
});

// ORIENTATION CHANGE HANDLING
window.addEventListener("orientationchange", () => {
	setTimeout(() => {
		console.log("📱 Orientation changed, refreshing layout");
		window.scrollTo(0, 0);
	}, 100);
});

console.log("🎴 Mobile Business Card Script Loaded Successfully!");
