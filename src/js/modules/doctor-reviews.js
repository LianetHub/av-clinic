export function initDoctorReviews() {
	document.addEventListener("click", (e) => {
		const button = e.target.closest(".reviews__card-more");

		if (!button) return;

		const review = button.closest(".reviews__card_expandable");

		if (!review) return;

		const isExpanded = review.classList.toggle("reviews__card_expanded");

		button.setAttribute("aria-expanded", isExpanded ? "true" : "false");
	});
}
