export function initBenefitsScroll() {
	const section = document.querySelector(".benefits");
	if (!section) return;

	const sticky = section.querySelector(".benefits__sticky");
	const items = [...section.querySelectorAll(".benefits__list .benefits__item")];

	if (!sticky || !items.length) return;

	const mq = window.matchMedia("(min-width: 960px)");
	let activeIndex = -1;
	let ticking = false;

	const setActive = (index) => {
		if (index === activeIndex) return;
		activeIndex = index;

		items.forEach((item, i) => {
			item.classList.toggle("active", i === index);
		});
	};

	const getHeaderOffset = () => {
		const header = document.querySelector(".header");
		return header ? header.offsetHeight : 0;
	};

	const container = section.querySelector(".benefits__container");

	const updateScrollLength = () => {
		if (!mq.matches) {
			container?.style.removeProperty("--benefits-scroll-length");
			return;
		}

		const stickyHeight = sticky.offsetHeight;
		const perItem = Math.max(window.innerHeight * 0.2, 140);
		const total = stickyHeight + perItem * (items.length - 1);
		container?.style.setProperty("--benefits-scroll-length", `${total}px`);
	};

	const onScroll = () => {
		if (!mq.matches || !container) return;

		const rect = container.getBoundingClientRect();
		const stickyHeight = sticky.offsetHeight;
		const scrollable = Math.max(container.offsetHeight - stickyHeight, 1);
		const headerOffset = getHeaderOffset();
		const scrolled = Math.min(Math.max(headerOffset - rect.top, 0), scrollable);
		const progress = scrolled / scrollable;
		const index = Math.min(items.length - 1, Math.floor(progress * items.length + 0.001));

		setActive(index);
	};

	const onScrollRaf = () => {
		if (ticking) return;
		ticking = true;
		requestAnimationFrame(() => {
			onScroll();
			ticking = false;
		});
	};

	const onResize = () => {
		updateScrollLength();

		if (mq.matches) {
			onScroll();
		} else {
			activeIndex = -1;
			items.forEach((item) => item.classList.remove("active"));
		}
	};

	updateScrollLength();
	setActive(0);
	onScroll();

	window.addEventListener("scroll", onScrollRaf, { passive: true });
	window.addEventListener("resize", onResize);
	mq.addEventListener("change", onResize);
}
