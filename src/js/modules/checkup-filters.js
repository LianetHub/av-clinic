export function initCheckupFilters() {
	const filters = document.querySelector("[data-checkup-filters]");
	const list = document.querySelector("[data-checkup-list]");

	if (!filters || !list) return;

	const buttons = filters.querySelectorAll("[data-filter]");
	const items = list.querySelectorAll(".info-list__item");

	buttons.forEach((button) => {
		button.addEventListener("click", () => {
			const filter = button.dataset.filter;

			buttons.forEach((btn) => btn.classList.remove("active"));
			button.classList.add("active");

			items.forEach((item) => {
				const tags = (item.dataset.tags || "").split(/\s+/).filter(Boolean);
				const isVisible = filter === "all" || tags.includes(filter);
				item.hidden = !isVisible;
			});
		});
	});
}
