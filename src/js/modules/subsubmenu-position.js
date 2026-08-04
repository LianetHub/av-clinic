export function initSubsubmenuPosition() {
	const mq = window.matchMedia("(min-width: 960px)");
	const items = document.querySelectorAll(".submenu__item--parent");

	if (!items.length) return;

	const clearInline = (sub) => {
		sub.style.left = "";
		sub.style.maxHeight = "";
		sub.style.overflowY = "";
	};

	const position = (item) => {
		const group = item.querySelector(".submenu__group");
		const arrow = item.querySelector(".submenu__arrow");
		const sub = item.querySelector(".subsubmenu");
		if (!group || !arrow || !sub || !mq.matches) return;

		sub.classList.remove("subsubmenu--align-bottom");
		clearInline(sub);

		// Сразу после стрелки (в координатах .submenu__group)
		sub.style.left = `${arrow.offsetLeft + arrow.offsetWidth}px`;

		requestAnimationFrame(() => {
			if (getComputedStyle(sub).display === "none") return;

			const pad = 12;
			const limit = window.innerHeight - pad;
			let subRect = sub.getBoundingClientRect();

			// Нижние пункты: прижимаем к низу строки, чтобы не уезжать за экран
			if (subRect.bottom > limit) {
				sub.classList.add("subsubmenu--align-bottom");
				subRect = sub.getBoundingClientRect();
			}

			if (subRect.top < pad) {
				const available =
					(sub.classList.contains("subsubmenu--align-bottom") ? subRect.bottom : limit) - pad;
				sub.style.maxHeight = `${Math.max(available, 120)}px`;
				sub.style.overflowY = "auto";
			}
		});
	};

	const reset = (item) => {
		const sub = item.querySelector(".subsubmenu");
		if (!sub) return;
		sub.classList.remove("subsubmenu--align-bottom");
		clearInline(sub);
	};

	items.forEach((item) => {
		item.addEventListener("mouseenter", () => position(item));
		item.addEventListener("mouseleave", () => reset(item));
		item.addEventListener("focusin", () => position(item));
		item.addEventListener("focusout", (e) => {
			if (!item.contains(e.relatedTarget)) reset(item);
		});
	});

	// Touch: класс .open ставится в app.js
	document.addEventListener(
		"click",
		(e) => {
			if (!mq.matches) return;

			const arrow = e.target.closest(".submenu__arrow");
			if (!arrow) return;

			const item = arrow.closest(".submenu__item--parent");
			if (!item) return;

			requestAnimationFrame(() => {
				if (item.classList.contains("open")) {
					position(item);
				} else {
					reset(item);
				}
			});
		},
		true
	);
}
