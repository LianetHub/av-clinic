const CARD_SLIDER_SELECTORS = [".directions__slider", ".doctors__slider", ".steps__slider", ".rates__slider", ".reviews__slider"];

function getSliderPaginationConfig(sliderEl) {
	return {
		el: sliderEl.querySelector(".swiper__pagination"),
		type: "fraction",
		renderFraction: function (currentClass, totalClass) {
			return '<span class="' + currentClass + '"></span>' + " / " + '<span class="' + totalClass + '"></span>';
		},
	};
}

function getSliderNavigationConfig(sliderEl) {
	return {
		nextEl: sliderEl.querySelector(".swiper__next"),
		prevEl: sliderEl.querySelector(".swiper__prev"),
	};
}

function getCardSliderConfig(sliderEl) {
	return {
		slidesPerView: "auto",
		speed: 600,
		spaceBetween: 16,
		pagination: getSliderPaginationConfig(sliderEl),
		navigation: getSliderNavigationConfig(sliderEl),
		breakpoints: {
			743.98: {
				slidesPerView: 2,
				spaceBetween: 24,
			},
			1199.98: {
				slidesPerView: 3,
				spaceBetween: 24,
			},
		},
	};
}

function getConditionsSliderConfig(sliderEl) {
	return {
		slidesPerView: "auto",
		speed: 600,
		spaceBetween: 16,
		pagination: getSliderPaginationConfig(sliderEl),
		navigation: getSliderNavigationConfig(sliderEl),
		breakpoints: {
			743.98: {
				slidesPerView: 2,
				spaceBetween: 24,
			},
			1199.98: {
				slidesPerView: 3,
				spaceBetween: 24,
			},
			1439.98: {
				slidesPerView: 4,
				spaceBetween: 24,
			},
		},
	};
}

function initCardSliders() {
	CARD_SLIDER_SELECTORS.forEach((selector) => {
		document.querySelectorAll(selector).forEach((sliderEl) => {
			new Swiper(sliderEl, getCardSliderConfig(sliderEl));
		});
	});
}

function initConditionsSliders() {
	document.querySelectorAll(".conditions__slider").forEach((sliderEl) => {
		new Swiper(sliderEl, getConditionsSliderConfig(sliderEl));
	});
}

function initHeroSlider() {
	if (!document.querySelector(".hero__slider")) return;

	new Swiper(".hero__slider", {
		slidesPerView: 1,
		loop: true,
		speed: 1500,
		autoplay: {
			delay: 2500,
			disableOnInteraction: false,
			stopOnLastSlide: false,
		},
		effect: "fade",
		fadeEffect: {
			crossFade: true,
		},
	});
}

function initGallerySlider() {
	const sliderEl = document.querySelector(".gallery__slider");
	if (!sliderEl) return;

	new Swiper(sliderEl, {
		slidesPerView: "auto",
		spaceBetween: 24,
		loop: true,
		speed: 15000,
		allowTouchMove: true,
		autoplay: {
			delay: 0,
			disableOnInteraction: false,
		},
	});
}

function initSpaceSlider() {
	const galleryEl = document.querySelector(".space__gallery");
	if (!galleryEl) return;

	const mainEl = galleryEl.querySelector(".space__main");
	const thumbsEl = galleryEl.querySelector(".space__thumbs");
	if (!mainEl || !thumbsEl) return;

	const thumbsSwiper = new Swiper(thumbsEl, {
		slidesPerView: "auto",
		spaceBetween: 16,
		watchSlidesProgress: true,
		breakpoints: {
			743.98: {
				spaceBetween: 24,
			},
		},
	});

	new Swiper(mainEl, {
		speed: 600,
		spaceBetween: 16,
		navigation: {
			nextEl: galleryEl.querySelector(".space__next"),
			prevEl: galleryEl.querySelector(".space__prev"),
		},
		thumbs: {
			swiper: thumbsSwiper,
		},
	});
}

export function initSwipers() {
	initHeroSlider();
	initCardSliders();
	initConditionsSliders();
	initGallerySlider();
	initSpaceSlider();
}
