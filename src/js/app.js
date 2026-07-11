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
	devFunctions.initDirectionsPage();

	// clickHandler

	const header = document.querySelector(".header");
	const search = document.querySelector(".search");

	document.addEventListener("click", (e) => {
		const target = e.target;

		if (target.classList.contains('header__search-toggler')) {
			search.classList.toggle('open');
			document.querySelectorAll('.header__search-toggler')?.forEach(toggler => {
				toggler.classList.toggle('active')
			})
		}

		/* ---------------------------------
		   Мобильное меню
		--------------------------------- */

		if (target.closest(".header__toggler")) {
			header.classList.toggle("open-menu");
			document.body.classList.toggle("open-mobile-menu");
			return;
		}

		if (
			header.classList.contains("open-menu") &&
			target.classList.contains("header__menu")
		) {
			closeMenu();
			return;
		}

		if (target.closest(".menu__link:not(.menu__item--parent > .menu__link)")) {
			closeMenu();
		}

		/* ---------------------------------
		   Подменю только для touch
		--------------------------------- */

		if (!document.body.classList.contains("_touch")) return;

		// Первый уровень
		const menuArrow = target.closest(".menu__arrow");

		if (menuArrow) {
			e.preventDefault();

			const item = menuArrow.closest(".menu__item--parent");

			// закрываем соседние
			item.parentElement
				.querySelectorAll(".menu__item--parent.open")
				.forEach((el) => {
					if (el !== item) {
						el.classList.remove("open");
						el.querySelector(".menu__arrow")?.setAttribute("aria-expanded", "false");

						// закрываем вложенные
						el.querySelectorAll(".submenu__item--parent.open").forEach((sub) => {
							sub.classList.remove("open");
							sub.querySelector(".submenu__arrow")?.setAttribute("aria-expanded", "false");
						});
					}
				});

			item.classList.toggle("open");
			menuArrow.setAttribute(
				"aria-expanded",
				item.classList.contains("open")
			);

			return;
		}

		// Второй уровень
		const submenuArrow = target.closest(".submenu__arrow");

		if (submenuArrow) {
			e.preventDefault();

			const item = submenuArrow.closest(".submenu__item--parent");

			item.parentElement
				.querySelectorAll(".submenu__item--parent.open")
				.forEach((el) => {
					if (el !== item) {
						el.classList.remove("open");
						el.querySelector(".submenu__arrow")?.setAttribute("aria-expanded", "false");
					}
				});

			item.classList.toggle("open");

			submenuArrow.setAttribute(
				"aria-expanded",
				item.classList.contains("open")
			);

			return;
		}

		// Клик вне меню
		if (!target.closest(".menu__item--parent")) {
			header
				.querySelectorAll(".menu__item--parent.open, .submenu__item--parent.open")
				.forEach((item) => {
					item.classList.remove("open");
					item
						.querySelector(".menu__arrow, .submenu__arrow")
						?.setAttribute("aria-expanded", "false");
				});
		}
	});

	function closeMenu() {
		header.classList.remove("open-menu");
		document.body.classList.remove("open-mobile-menu");
	}

});
