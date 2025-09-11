document.addEventListener("DOMContentLoaded", () => {
	const businessCard = document.getElementById("businessCard");
	let isFlipping = false;
	let isFlipped = false;
	let touchStartTime = 0;
	let touchStartY = 0;
	let touchStartX = 0;

	const isMobile =
		/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent
		) || window.innerWidth <= 768;
	const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
	const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

	if (!businessCard) {
		return;
	}

	function flipCard() {
		if (isFlipping) {
			return;
		}

		isFlipping = true;
		isFlipped = !isFlipped;

		if (navigator.vibrate && isMobile) {
			navigator.vibrate(30);
		}

		businessCard.classList.toggle("flipped");

		if (isMobile) {
			playMobileFlipSound();
		} else {
			playFlipSound();
		}

		const duration = isMobile ? 600 : 800;
		setTimeout(() => {
			isFlipping = false;
		}, duration);

		updateAccessibility();
	}

	function handleTouchStart(event) {
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

		event.preventDefault();
	}

	function handleTouchEnd(event) {
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

		if (touchDuration < 500 && deltaX < 30 && deltaY < 30) {
			flipCard();
		}

		event.preventDefault();
	}

	function handleClick(event) {
		if (isMobile || isTouch) {
			return;
		}

		if (
			event.target.closest(".social-link") ||
			event.target.closest(".tech-item")
		) {
			return;
		}

		flipCard();
	}

	function handleKeydown(event) {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			flipCard();
		}

		if (event.key === "Escape" && isFlipped) {
			flipCard();
		}
	}

	function playMobileFlipSound() {
		const AudioContext = window.AudioContext || window.webkitAudioContext;
		if (AudioContext) {
			try {
				const audioContext = new AudioContext();

				if (audioContext.state === "suspended") {
					audioContext.resume();
				}

				const oscillator = audioContext.createOscillator();
				const gainNode = audioContext.createGain();

				oscillator.connect(gainNode);
				gainNode.connect(audioContext.destination);

				oscillator.frequency.setValueAtTime(
					250,
					audioContext.currentTime
				);
				oscillator.frequency.exponentialRampToValueAtTime(
					125,
					audioContext.currentTime + 0.08
				);

				gainNode.gain.setValueAtTime(0.003, audioContext.currentTime);
				gainNode.gain.exponentialRampToValueAtTime(
					0.0008,
					audioContext.currentTime + 0.08
				);

				oscillator.start(audioContext.currentTime);
				oscillator.stop(audioContext.currentTime + 0.08);
			} catch (error) {
				console.log("Mobile audio not available");
			}
		}
	}

	function playFlipSound() {
		const AudioContext = window.AudioContext || window.webkitAudioContext;
		if (AudioContext) {
			try {
				const audioContext = new AudioContext();

				if (audioContext.state === "suspended") {
					audioContext.resume();
				}

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
				console.log("Desktop audio not available");
			}
		}
	}

	function updateAccessibility() {
		const label = isFlipped
			? "Business card back side showing about and tech stack. Tap to flip to front."
			: "Business card front side showing contact info. Tap to flip to back.";

		businessCard.setAttribute("aria-label", label);
	}

	function setupSocialLinks() {
		const socialLinks = document.querySelectorAll(".social-link");

		socialLinks.forEach((link, index) => {
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
			});

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

	function setupTechStack() {
		const techItems = document.querySelectorAll(".tech-item");

		techItems.forEach((item, index) => {
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
			});

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

	function setupImageHandling() {
		const avatar = document.querySelector(".avatar");
		if (avatar) {
			avatar.addEventListener("load", () => {
				avatar.style.objectPosition = "center 15%";
			});

			avatar.addEventListener("error", () => {
				avatar.src =
					"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";
			});

			if (avatar.complete) {
				if (avatar.naturalWidth === 0) {
					avatar.src =
						"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";
				} else {
					avatar.style.objectPosition = "center 15%";
				}
			}
		}
	}

	function optimizeForMobile() {
		if (isMobile) {
			businessCard.style.animationDuration = "3s";

			businessCard.addEventListener(
				"touchmove",
				(event) => {
					event.preventDefault();
				},
				{ passive: false }
			);

			businessCard.addEventListener("contextmenu", (event) => {
				event.preventDefault();
			});

			if (isIOS) {
				businessCard.style.transform = "translate3d(0, 0, 0)";
				businessCard.style.webkitTransform = "translate3d(0, 0, 0)";
				businessCard.style.webkitBackfaceVisibility = "hidden";
			}
		}

		businessCard.style.willChange = "transform";

		setTimeout(() => {
			businessCard.style.willChange = "auto";
		}, 2000);
	}

	function init() {
		if (isMobile || isTouch) {
			businessCard.addEventListener("touchstart", handleTouchStart, {
				passive: false,
			});
			businessCard.addEventListener("touchend", handleTouchEnd, {
				passive: false,
			});
		} else {
			businessCard.addEventListener("click", handleClick);
		}

		businessCard.addEventListener("keydown", handleKeydown);

		businessCard.setAttribute("tabindex", "0");
		businessCard.setAttribute("role", "button");
		updateAccessibility();

		setupSocialLinks();
		setupTechStack();
		setupImageHandling();
		optimizeForMobile();
	}

	let resizeTimer;
	window.addEventListener("resize", () => {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(() => {
			const width = window.innerWidth;

			if (width <= 768) {
				businessCard.style.animationDuration = "3s";
			} else {
				businessCard.style.animationDuration = "4s";
			}
		}, 250);
	});

	init();

	window.debugCard = {
		flip: flipCard,
		isFlipped: () => isFlipped,
		isFlipping: () => isFlipping,
		isMobile: () => isMobile,
		reset: () => {
			businessCard.classList.remove("flipped");
			isFlipped = false;
			isFlipping = false;
		},
	};
});

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

window.addEventListener("error", (event) => {
	console.error("Error:", event.error?.message || event.message);
});

window.addEventListener("orientationchange", () => {
	setTimeout(() => {
		window.scrollTo(0, 0);
	}, 100);
});
