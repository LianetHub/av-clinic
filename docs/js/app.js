"use strict";

import * as devFunctions from "./modules/functions.js";

document.addEventListener("DOMContentLoaded", function () {
	//  Fancybox
	if (typeof Fancybox !== "undefined" && Fancybox !== null) {
		Fancybox.bind("[data-fancybox]", {
			dragToClose: false,
			closeExisting: true,
		});
	}

	devFunctions.isWebp();
	devFunctions.OS();
	devFunctions.initYandexMap();
	devFunctions.mask();
	devFunctions.initDetailsTabs();
	devFunctions.initSwipers();

	// clickHandler

	document.addEventListener("click", function (e) {
		const target = e.target;
		const header = document.querySelector(".header");

		// menu
		if (target.closest(".header__menu-toggler")) {
			header.classList.toggle("open-menu");
			document.body.classList.toggle("open-mobile-menu");
		}

		if (header.classList.contains("open-menu") && target.classList.contains("menu")) {
			header.classList.remove("open-menu");
			document.body.classList.remove("open-mobile-menu");
		}

		if (target.closest(".menu__link")) {
			header.classList.remove("open-menu");
			document.body.classList.remove("open-mobile-menu");
		}

		if (document.body.classList.contains("_touch")) {
			if (target.closest(".menu__arrow")) {
				const parentItem = target.closest(".menu__item--parent");
				const arrow = target.closest(".menu__arrow");

				if (parentItem) {
					parentItem.classList.toggle("open-submenu");
					const isExpanded = parentItem.classList.contains("open-submenu");
					arrow.setAttribute("aria-expanded", isExpanded);
				}
			} else if (!target.closest(".menu__item--parent")) {
				const activeParent = document.querySelector(".menu__item--parent.open-submenu");
				if (activeParent) {
					activeParent.classList.remove("open-submenu");
					const activeArrow = activeParent.querySelector(".menu__arrow");
					if (activeArrow) activeArrow.setAttribute("aria-expanded", "false");
				}
			}
		}
	});

});
