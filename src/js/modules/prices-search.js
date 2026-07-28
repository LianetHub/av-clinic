export function initPricesSearch() {
	const page = document.querySelector(".prices-page");

	if (!page) return;

	const form = page.querySelector(".prices-page__search");
	const input = page.querySelector(".prices-page__search-input");
	const clearBtn = page.querySelector(".prices-page__search-clear");
	const list = page.querySelector(".prices-page__list");

	if (!form || !input || !list) return;

	const categories = list.querySelectorAll(".prices-page__category");
	const empty = document.createElement("p");

	empty.className = "prices-page__empty";
	empty.hidden = true;
	empty.setAttribute("role", "status");
	empty.textContent = "По вашему запросу ничего не найдено";
	list.after(empty);

	list.querySelectorAll(".price__item-name").forEach((el) => {
		el.dataset.originalName = el.textContent;
	});

	const normalize = (value) => value.trim().toLowerCase().replace(/\s+/g, " ");

	const escapeHtml = (value) =>
		value
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;");

	const highlightMatch = (text, query) => {
		if (!query) return escapeHtml(text);

		const lowerText = text.toLowerCase();
		let result = "";
		let start = 0;
		let index = lowerText.indexOf(query, start);

		while (index !== -1) {
			result += escapeHtml(text.slice(start, index));
			result += `<b>${escapeHtml(text.slice(index, index + query.length))}</b>`;
			start = index + query.length;
			index = lowerText.indexOf(query, start);
		}

		result += escapeHtml(text.slice(start));

		return result;
	};

	const resetSlideStyles = (el) => {
		el.classList.remove("_slide");
		el.style.removeProperty("height");
		el.style.removeProperty("padding-top");
		el.style.removeProperty("padding-bottom");
		el.style.removeProperty("margin-top");
		el.style.removeProperty("margin-bottom");
		el.style.removeProperty("overflow");
		el.style.removeProperty("transition-duration");
		el.style.removeProperty("transition-property");
	};

	const setCategoryOpen = (category, open) => {
		const toggle = category.querySelector("[data-spoller]");
		const body = category.querySelector(".prices-page__body");

		if (!toggle || !body) return;

		toggle.classList.toggle("_active", open);
		body.hidden = !open;
		resetSlideStyles(body);
	};

	const updateClearBtn = () => {
		if (!clearBtn) return;
		clearBtn.hidden = !input.value;
	};

	const filter = () => {
		const query = normalize(input.value);
		let totalVisible = 0;

		updateClearBtn();

		categories.forEach((category) => {
			const items = category.querySelectorAll(".price__item");
			let visibleInCategory = 0;

			items.forEach((item) => {
				const nameEl = item.querySelector(".price__item-name");
				const name = nameEl?.dataset.originalName || nameEl?.textContent || "";
				const isMatch = !query || normalize(name).includes(query);

				item.hidden = !isMatch;

				if (!nameEl) return;

				if (query && isMatch) {
					nameEl.innerHTML = highlightMatch(name, query);
				} else {
					nameEl.textContent = name;
				}

				if (isMatch) visibleInCategory += 1;
			});

			const hasMatches = visibleInCategory > 0;

			category.hidden = Boolean(query) && !hasMatches;
			totalVisible += visibleInCategory;

			if (query && hasMatches) {
				setCategoryOpen(category, true);
			} else if (!query) {
				setCategoryOpen(category, false);
			}
		});

		empty.hidden = !(query && totalVisible === 0);
	};

	form.addEventListener("submit", (e) => {
		e.preventDefault();
		filter();
	});

	input.addEventListener("input", filter);

	clearBtn?.addEventListener("click", () => {
		input.value = "";
		filter();
		input.focus();
	});

	form.addEventListener("click", (e) => {
		if (e.target.closest(".prices-page__search-input, .prices-page__search-clear")) return;
		input.focus();
	});
}
