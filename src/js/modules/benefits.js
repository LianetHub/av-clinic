export function initBenefits() {
	const list = document.querySelector(".benefits__list");
	if (!list) return;

	const items = [...list.querySelectorAll(".benefits__item")];
	if (!items.length) return;

	const mq = window.matchMedia("(min-width: 960px)");
	let activeIndex = -1;

	const setActive = (index) => {
		if (index === activeIndex) return;
		activeIndex = index;

		items.forEach((item, i) => {
			item.classList.toggle("active", i === index);
		});
	};

	const enable = () => {
		setActive(0);

		items.forEach((item, index) => {
			item.addEventListener("mouseenter", item._benefitsEnter = () => setActive(index));
		});
	};

	const disable = () => {
		activeIndex = -1;
		items.forEach((item) => {
			item.classList.remove("active");
			if (item._benefitsEnter) {
				item.removeEventListener("mouseenter", item._benefitsEnter);
				delete item._benefitsEnter;
			}
		});
	};

	const onChange = () => {
		if (mq.matches) {
			enable();
		} else {
			disable();
		}
	};

	onChange();
	mq.addEventListener("change", onChange);
}
