export function initDetailsTabs() {
	const detailsSections = document.querySelectorAll(".details");

	if (!detailsSections.length) return;

	detailsSections.forEach((section) => {
		const buttons = section.querySelectorAll(".details__button");
		const tabs = section.querySelectorAll(".details__tab-block");

		buttons.forEach((button, index) => {
			button.addEventListener("click", () => {
				if (button.classList.contains("active")) return;

				buttons.forEach((btn) => btn.classList.remove("active"));
				tabs.forEach((tab) => tab.classList.remove("active"));

				button.classList.add("active");
				tabs[index]?.classList.add("active");
			});
		});
	});
}
