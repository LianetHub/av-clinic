function matchesCondition(el, value) {
	if (!value) return true;
	const attr = el.dataset.condition || "";
	if (!attr) return false;
	return attr === value;
}

function matchesGender(el, value) {
	if (!value) return true;
	const attr = el.dataset.gender || "";
	if (!attr) return true;
	return attr === value;
}

function getFilterValues(root) {
	return {
		condition: root.querySelector("[data-filter-condition]")?.value || "",
		format: root.querySelector("[data-filter-format]")?.value || "",
		gender: root.querySelector("[data-filter-gender]")?.value || "",
	};
}

function hasActiveFilters(values) {
	return Boolean(values.condition || values.format || values.gender);
}

function syncClearButton(root, values) {
	const clearBtn = root.querySelector("[data-checkup-clear]");
	if (!clearBtn) return;
	clearBtn.hidden = !hasActiveFilters(values);
}

function syncEmptyState(isEmpty) {
	const empty = document.querySelector("[data-checkup-empty]");
	if (!empty) return;
	empty.hidden = !isEmpty;
}

function applyCheckupFilters(root) {
	const values = getFilterValues(root);
	const { condition, format, gender } = values;

	const startBlock = document.querySelector('[data-checkup-block="start"]');
	const complexBlock = document.querySelector('[data-checkup-block="complex"]');

	const showStarts = format !== "complex";
	const showComplex = format !== "start";

	document.querySelectorAll("[data-checkup-starts] .checkup-category").forEach((category) => {
		const visible = matchesCondition(category, condition) && matchesGender(category, gender);
		category.hidden = !visible;
	});

	document.querySelectorAll("[data-checkup-list] .checkup-program").forEach((item) => {
		const visible = matchesCondition(item, condition) && matchesGender(item, gender);
		item.hidden = !visible;
	});

	let startsVisible = false;
	let complexVisible = false;

	if (startBlock) {
		const categories = startBlock.querySelectorAll(".checkup-category");
		startsVisible = showStarts && Array.from(categories).some((item) => !item.hidden);
		startBlock.hidden = !startsVisible;
	}

	if (complexBlock) {
		const items = complexBlock.querySelectorAll(".checkup-program");
		complexVisible = showComplex && Array.from(items).some((item) => !item.hidden);
		complexBlock.hidden = !complexVisible;
	}

	syncClearButton(root, values);
	syncEmptyState(hasActiveFilters(values) && !startsVisible && !complexVisible);
}

function closeCustomSelect(customSelect) {
	customSelect.classList.remove("is-open");
	const trigger = customSelect.querySelector(".checkup-filter__trigger");
	if (trigger) {
		trigger.setAttribute("aria-expanded", "false");
	}
}

function closeAllCustomSelects(except) {
	document.querySelectorAll(".checkup-filter.is-open").forEach((item) => {
		if (item !== except) closeCustomSelect(item);
	});
}

function syncCustomSelectValue(customSelect, select) {
	const value = select.value;
	const selectedOption = select.options[select.selectedIndex];
	const valueEl = customSelect.querySelector(".checkup-filter__value");
	const options = customSelect.querySelectorAll(".checkup-filter__option");

	if (valueEl) {
		valueEl.textContent = selectedOption ? selectedOption.textContent : "";
		valueEl.classList.toggle("is-placeholder", !value);
	}

	options.forEach((option) => {
		option.classList.toggle("is-active", option.dataset.value === value);
	});
}

function clearCheckupFilters(root) {
	root.querySelectorAll("select").forEach((select) => {
		select.value = "";
		const filter = select.closest(".checkup-filter");
		if (filter) {
			syncCustomSelectValue(filter, select);
		}
	});
	closeAllCustomSelects();
	applyCheckupFilters(root);
}

function enhanceCustomSelect(select, root) {
	const filter = select.closest(".checkup-filter");
	const control = select.closest(".checkup-filter__control");
	if (!filter || !control || filter.classList.contains("is-enhanced")) return;

	const placeholderOption = select.options[0];
	const placeholder = placeholderOption ? placeholderOption.textContent : "";

	const labelId = `${select.id}-label`;
	const trigger = document.createElement("button");
	trigger.type = "button";
	trigger.className = "checkup-filter__trigger";
	trigger.setAttribute("aria-haspopup", "listbox");
	trigger.setAttribute("aria-expanded", "false");
	trigger.setAttribute("aria-labelledby", labelId);
	trigger.id = `${select.id}-trigger`;

	const valueEl = document.createElement("span");
	valueEl.className = "checkup-filter__value is-placeholder";
	valueEl.textContent = placeholder;

	const icon = document.createElement("img");
	icon.className = "checkup-filter__icon";
	icon.src = "img/icons/select-chevron.svg";
	icon.alt = "";
	icon.setAttribute("aria-hidden", "true");
	icon.width = 24;
	icon.height = 24;

	trigger.append(valueEl, icon);

	const list = document.createElement("ul");
	list.className = "checkup-filter__dropdown";
	list.setAttribute("role", "listbox");
	list.setAttribute("aria-labelledby", labelId);

	Array.from(select.options).forEach((option, index) => {
		if (index === 0 && option.value === "") return;

		const item = document.createElement("li");
		item.className = "checkup-filter__option";
		item.setAttribute("role", "option");
		item.dataset.value = option.value;
		item.textContent = option.textContent;
		item.tabIndex = -1;

		item.addEventListener("click", () => {
			select.value = option.value;
			select.dispatchEvent(new Event("change", { bubbles: true }));
			syncCustomSelectValue(filter, select);
			closeCustomSelect(filter);
		});

		list.appendChild(item);
	});

	select.classList.add("checkup-filter__native");
	select.setAttribute("tabindex", "-1");
	select.setAttribute("aria-hidden", "true");

	control.append(trigger, list);
	filter.classList.add("is-enhanced");

	trigger.addEventListener("click", () => {
		const isOpen = filter.classList.contains("is-open");
		closeAllCustomSelects(filter);
		if (isOpen) {
			closeCustomSelect(filter);
		} else {
			filter.classList.add("is-open");
			trigger.setAttribute("aria-expanded", "true");
		}
	});

	select.addEventListener("change", () => {
		syncCustomSelectValue(filter, select);
		applyCheckupFilters(root);
	});

	syncCustomSelectValue(filter, select);
}

export function initCheckupFilters() {
	const root = document.querySelector("[data-checkup-filters]");
	if (!root) return;

	root.querySelectorAll("select").forEach((select) => {
		enhanceCustomSelect(select, root);
	});

	const clearBtn = root.querySelector("[data-checkup-clear]");
	if (clearBtn) {
		clearBtn.addEventListener("click", () => clearCheckupFilters(root));
	}

	document.addEventListener("click", (event) => {
		if (!event.target.closest(".checkup-filter")) {
			closeAllCustomSelects();
		}
	});

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape") {
			closeAllCustomSelects();
		}
	});

	applyCheckupFilters(root);
}
