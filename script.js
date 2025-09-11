/* =================================================
   PERFECT BUSINESS CARD - FINAL JAVASCRIPT
   =================================================

   Features:
   - Click-only flip animation
   - Social media tooltips
   - No double borders
   - Mobile touch support
   - Debug functions

   Edit sections:
   - Sound settings: playFlipSound function
   - Animation timing: setTimeout values
   - Debug output: console.log statements

   ================================================= */

document.addEventListener("DOMContentLoaded", () => {
	console.log("🎴 Initializing Perfect Business Card...");

	// MAIN VARIABLES
	const businessCard = document.getElementById("businessCard");
	let isFlipping = false;
	let isFlipped = false;

	// CHECK IF CARD EXISTS
	if (!businessCard) {
		console.error("❌ Business card element not found!");
		return;
	}

	// REMOVE DEFAULT FOCUS OUTLINE
	businessCard.style.outline = "none";
	businessCard.style.border = "none";

	console.log("✅ Business card element found");

	/* ===== FLIP ANIMATION FUNCTIONS ===== */

	// MAIN FLIP FUNCTION
	function flipCard() {
		if (isFlipping) {
			console.log("⏸️ Already flipping, ignoring click");
			return;
		}

		console.log(`🔄 Flipping card ${isFlipped ? "to front" : "to back"}`);

		isFlipping = true;
		isFlipped = !isFlipped;

		// ADD/REMOVE FLIP CLASS
		businessCard.classList.toggle("flipped");

		// HAPTIC FEEDBACK FOR MOBILE
		if (navigator.vibrate) {
			navigator.vibrate(40);
		}

		// PLAY FLIP SOUND
		playFlipSound();

		// RESET FLIPPING STATE AFTER ANIMATION
		setTimeout(() => {
			isFlipping = false;
			console.log("✅ Flip complete");
		}, 800); // EDIT TIMING HERE (800ms = 0.8s)

		updateAccessibility();
	}

	// CLICK HANDLER - PREVENTS DOUBLE BORDERS
	function handleCardClick(event) {
		console.log("👆 Card clicked", event.target.className);

		// DON'T FLIP IF CLICKING ON INTERACTIVE ELEMENTS
		if (
			event.target.closest(".social-link") ||
			event.target.closest(".tech-item") ||
			event.target.tagName === "A"
		) {
			console.log("🚫 Interactive element clicked, not flipping");
			return;
		}

		// REMOVE FOCUS TO PREVENT DOUBLE BORDERS
		businessCard.blur();
		event.target.blur();

		flipCard();
	}

	// KEYBOARD NAVIGATION
	function handleKeydown(event) {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			// REMOVE FOCUS TO PREVENT DOUBLE BORDERS
			businessCard.blur();
			console.log("⌨️ Keyboard flip");
			flipCard();
		}

		if (event.key === "Escape" && isFlipped) {
			console.log("🔙 Escape - flip to front");
			flipCard();
		}
	}

	/* ===== ACCESSIBILITY FUNCTIONS ===== */

	// UPDATE ACCESSIBILITY LABELS
	function updateAccessibility() {
		const label = isFlipped
			? "Business card back side showing about and tech stack. Press Enter to flip to front."
			: "Business card front side showing contact info. Press Enter to flip to back.";

		businessCard.setAttribute("aria-label", label);
	}

	/* ===== SOUND EFFECTS ===== */

	// FLIP SOUND - EDIT SOUND SETTINGS HERE
	function playFlipSound() {
		if (window.AudioContext || window.webkitAudioContext) {
			try {
				const audioContext = new (window.AudioContext ||
					window.webkitAudioContext)();
				const oscillator = audioContext.createOscillator();
				const gainNode = audioContext.createGain();

				oscillator.connect(gainNode);
				gainNode.connect(audioContext.destination);

				// SOUND FREQUENCY SETTINGS
				oscillator.frequency.setValueAtTime(
					300,
					audioContext.currentTime
				);
				oscillator.frequency.exponentialRampToValueAtTime(
					150,
					audioContext.currentTime + 0.1
				);

				// SOUND VOLUME SETTINGS (VERY QUIET)
				gainNode.gain.setValueAtTime(0.005, audioContext.currentTime); // EDIT VOLUME HERE
				gainNode.gain.exponentialRampToValueAtTime(
					0.001,
					audioContext.currentTime + 0.1
				);

				oscillator.start(audioContext.currentTime);
				oscillator.stop(audioContext.currentTime + 0.1);
			} catch (error) {
				console.log("🔇 Audio not available");
			}
		}
	}

	/* ===== SOCIAL LINKS SETUP ===== */

	// SOCIAL LINKS WITH TOOLTIPS
	function setupSocialLinks() {
		const socialLinks = document.querySelectorAll(".social-link");
		console.log(
			`🔗 Setting up ${socialLinks.length} social links with tooltips`
		);

		socialLinks.forEach((link, index) => {
			// REMOVE FOCUS OUTLINE
			link.style.outline = "none";

			// CLICK HANDLER
			link.addEventListener("click", (event) => {
				const platform = link.classList[1] || `social-${index}`;
				console.log(`📱 ${platform} clicked`);

				// REMOVE FOCUS TO PREVENT DOUBLE BORDERS
				link.blur();

				// CLICK ANIMATION
				link.style.transition = "transform 0.1s ease";
				link.style.transform = "scale(0.9)";

				setTimeout(() => {
					link.style.transform = "";
					setTimeout(() => {
						link.style.transition = "";
					}, 300);
				}, 100);
			});

			// HOVER EFFECTS
			link.addEventListener("mouseenter", () => {
				link.style.filter = "brightness(1.1)";
				console.log(
					`🔗 Showing tooltip: ${link.getAttribute("data-tooltip")}`
				);
			});

			link.addEventListener("mouseleave", () => {
				link.style.filter = "";
			});

			// PREVENT DOUBLE BORDERS ON FOCUS
			link.addEventListener("focus", () => {
				link.blur();
			});
		});
	}

	/* ===== TECH STACK SETUP ===== */

	// TECH STACK ITEMS (NO TOOLTIPS)
	function setupTechStack() {
		const techItems = document.querySelectorAll(".tech-item");
		console.log(`⚡ Setting up ${techItems.length} tech items`);

		techItems.forEach((item, index) => {
			// REMOVE FOCUS OUTLINE
			item.style.outline = "none";

			// CLICK HANDLER
			item.addEventListener("click", (event) => {
				const techClass =
					Array.from(item.classList).find((c) => c !== "tech-item") ||
					`tech-${index}`;
				console.log(`💻 ${techClass} clicked`);

				// REMOVE FOCUS TO PREVENT DOUBLE BORDERS
				item.blur();

				// CLICK ANIMATION
				item.style.transition = "transform 0.15s ease";
				item.style.transform = "scale(0.85)";

				setTimeout(() => {
					item.style.transform = "";
					setTimeout(() => {
						item.style.transition = "";
					}, 300);
				}, 150);
			});

			// HOVER EFFECTS
			item.addEventListener("mouseenter", () => {
				item.style.filter = "brightness(1.2)";
			});

			item.addEventListener("mouseleave", () => {
				item.style.filter = "";
			});

			// PREVENT DOUBLE BORDERS ON FOCUS
			item.addEventListener("focus", () => {
				item.blur();
			});
		});
	}

	/* ===== IMAGE HANDLING ===== */

	// PROFILE IMAGE SETUP WITH FALLBACK
	function setupImageHandling() {
		const avatar = document.querySelector(".avatar");
		if (avatar) {
			// IMAGE LOAD SUCCESS
			avatar.addEventListener("load", () => {
				console.log("✅ Profile image loaded successfully");
				// BETTER POSITIONING FOR HAIR VISIBILITY
				avatar.style.objectPosition = "center 15%";
			});

			// IMAGE LOAD ERROR - USE FALLBACK
			avatar.addEventListener("error", () => {
				console.warn("⚠️ pfp.png not found, using fallback");
				avatar.src =
					"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";
			});

			// CHECK IF IMAGE ALREADY LOADED (CACHED)
			if (avatar.complete) {
				if (avatar.naturalWidth === 0) {
					console.warn("⚠️ pfp.png failed to load");
					avatar.src =
						"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";
				} else {
					console.log("✅ Profile image already cached");
					// BETTER POSITIONING FOR YOUR PHOTO
					avatar.style.objectPosition = "center 15%";
				}
			}

			// AVATAR HOVER EFFECTS
			avatar.addEventListener("mouseenter", () => {
				avatar.style.filter =
					"brightness(1.15) saturate(1.1) contrast(1.05)";
			});

			avatar.addEventListener("mouseleave", () => {
				avatar.style.filter = "";
			});
		}
	}

	/* ===== PERFORMANCE OPTIMIZATION ===== */

	function optimizePerformance() {
		businessCard.style.willChange = "transform";

		businessCard.addEventListener("transitionend", () => {
			setTimeout(() => {
				businessCard.style.willChange = "auto";
			}, 100);
		});

		// OPTIMIZE ANIMATIONS FOR MOBILE
		if (window.innerWidth <= 500) {
			console.log("📱 Mobile detected - optimizing animations");
			document.documentElement.style.setProperty(
				"--animation-duration",
				"0.6s"
			);
		}
	}

	/* ===== FOCUS OUTLINE REMOVAL ===== */

	// REMOVE ALL FOCUS OUTLINES TO PREVENT DOUBLE BORDERS
	function removeFocusOutlines() {
		const style = document.createElement("style");
		style.textContent = `
            *, *:focus, *:active {
                outline: none !important;
            }
            .business-card:focus {
                outline: none !important;
            }
        `;
		document.head.appendChild(style);

		// REMOVE FOCUS FROM ANY FOCUSED ELEMENT
		document.addEventListener("focusin", (event) => {
			if (event.target !== businessCard) {
				event.target.blur();
			}
		});
	}

	/* ===== INITIALIZATION FUNCTION ===== */

	function init() {
		console.log("🚀 Initializing all components...");

		// REMOVE FOCUS OUTLINES FIRST
		removeFocusOutlines();

		// MAIN EVENT LISTENERS
		businessCard.addEventListener("click", handleCardClick);
		businessCard.addEventListener("keydown", handleKeydown);

		// PREVENT DEFAULT FOCUS BEHAVIOR
		businessCard.addEventListener("mousedown", (event) => {
			event.preventDefault();
		});

		// ACCESSIBILITY SETUP
		businessCard.setAttribute("tabindex", "0");
		businessCard.setAttribute("role", "button");
		updateAccessibility();

		// COMPONENT SETUP
		setupSocialLinks();
		setupTechStack();
		setupImageHandling();
		optimizePerformance();

		// PREVENT CONTEXT MENU DURING FLIP
		businessCard.addEventListener("contextmenu", (event) => {
			if (isFlipping) {
				event.preventDefault();
			}
		});

		/* ===== MOBILE TOUCH SUPPORT ===== */

		let touchStartTime;
		businessCard.addEventListener("touchstart", (event) => {
			touchStartTime = Date.now();
		});

		businessCard.addEventListener("touchend", (event) => {
			const touchDuration = Date.now() - touchStartTime;
			if (touchDuration < 500) {
				// QUICK TAP
				handleCardClick(event);
			}
		});

		console.log("🎉 Perfect business card initialized!");
		console.log("💡 Click anywhere on the card to flip");
		console.log("⌨️ Use Enter/Space for keyboard navigation");
		console.log("🔗 Hover over social icons to see usernames");
	}

	/* ===== RESPONSIVE ADJUSTMENTS ===== */

	let resizeTimer;
	window.addEventListener("resize", () => {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(() => {
			const width = window.innerWidth;
			console.log(`📱 Viewport: ${width}x${window.innerHeight}px`);

			// ADJUST ANIMATIONS BASED ON SCREEN SIZE
			if (width <= 400) {
				console.log("📱 Small screen optimizations applied");
				businessCard.style.animationDuration = "3s";
			} else {
				businessCard.style.animationDuration = "4s";
			}
		}, 250);
	});

	/* ===== DEBUG INFORMATION ===== */

	console.log("🔍 Card Info:");
	console.log(
		`- Dimensions: ${businessCard.offsetWidth}x${businessCard.offsetHeight}px`
	);
	console.log(`- Viewport: ${window.innerWidth}x${window.innerHeight}px`);
	console.log(
		`- Device: ${
			navigator.userAgent.includes("Mobile") ? "Mobile" : "Desktop"
		}`
	);
	console.log(`- Touch support: ${"ontouchstart" in window ? "Yes" : "No"}`);

	// INITIALIZE EVERYTHING
	init();

	/* ===== DEBUG FUNCTIONS ===== */
	// EDIT THESE FOR TESTING

	window.debugCard = {
		flip: flipCard, // Call window.debugCard.flip() to flip manually
		isFlipped: () => isFlipped, // Check if card is flipped
		isFlipping: () => isFlipping, // Check if card is currently flipping
		reset: () => {
			// Reset card to front
			businessCard.classList.remove("flipped");
			isFlipped = false;
			isFlipping = false;
			console.log("🔄 Card reset to front");
		},
	};

	console.log("🐛 Debug: Use window.debugCard for manual control");
});

/* ===== GLOBAL ERROR HANDLING ===== */

window.addEventListener("error", (event) => {
	console.error("❌ Error:", event.error?.message || event.message);
});

/* ===== PREVENT ZOOM ON DOUBLE TAP (iOS) ===== */

let lastTouchEnd = 0;
document.addEventListener(
	"touchend",
	(event) => {
		const now = new Date().getTime();
		if (now - lastTouchEnd <= 300) {
			event.preventDefault();
		}
		lastTouchEnd = now;
	},
	false
);

/* ===== ADDITIONAL FOCUS PREVENTION ===== */

document.addEventListener("DOMContentLoaded", () => {
	// REMOVE FOCUS FROM ANY ELEMENT THAT GETS FOCUSED
	document.addEventListener(
		"focus",
		(event) => {
			if (event.target.tagName !== "BODY") {
				setTimeout(() => event.target.blur(), 0);
			}
		},
		true
	);
});
