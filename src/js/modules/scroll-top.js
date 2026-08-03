export function initScrollTop() {
	const button = document.querySelector(".scroll-top");
	if (!button) return;

	const threshold = 400;
	let ticking = false;

	const update = () => {
		const visible = window.scrollY > threshold;
		button.classList.toggle("is-visible", visible);
		button.setAttribute("aria-hidden", String(!visible));
		button.tabIndex = visible ? 0 : -1;
		ticking = false;
	};

	const onScroll = () => {
		if (ticking) return;
		ticking = true;
		requestAnimationFrame(update);
	};

	button.addEventListener("click", () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	});

	window.addEventListener("scroll", onScroll, { passive: true });
	update();
}
