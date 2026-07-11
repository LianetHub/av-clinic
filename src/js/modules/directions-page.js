export function initDirectionsPage() {
	const list = document.querySelector(".directions-page__list");

	if (!list) return;

	const items = list.querySelectorAll(".directions-page__item_has-subsections");
	const hoverMedia = window.matchMedia("(hover: hover)");

	const closeAll = () => {
		items.forEach((item) => {
			item.classList.remove("_open");
			item.querySelector("[data-directions-toggle]")?.setAttribute("aria-expanded", "false");
		});
	};

	const toggleItem = (item, toggle) => {
		const willOpen = !item.classList.contains("_open");

		closeAll();

		if (willOpen) {
			item.classList.add("_open");
			toggle.setAttribute("aria-expanded", "true");
		}
	};

	list.addEventListener("click", (e) => {
		if (hoverMedia.matches) return;

		const toggle = e.target.closest("[data-directions-toggle]");

		if (!toggle) return;

		e.preventDefault();

		const item = toggle.closest(".directions-page__item");

		if (!item) return;

		toggleItem(item, toggle);
	});

	hoverMedia.addEventListener("change", (event) => {
		if (event.matches) {
			closeAll();
		}
	});
}
