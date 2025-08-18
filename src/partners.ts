const diamondDiv = document.querySelector(".diamond") as HTMLDivElement;
const goldDiv = document.querySelector(".gold") as HTMLDivElement;
const silverDiv = document.querySelector(".silver") as HTMLDivElement;

import partnersData from "./json/partners.json";
const modalTitle = document.querySelector(".modal-title") as HTMLDivElement;
const modalBody = document.querySelector(".modal-body") as HTMLDivElement;
const modalHeader = document.querySelector(".modal-header") as HTMLDivElement;

let lastScrollTop = 0;
const navbar = document.querySelector('.navbar') as HTMLDivElement;
const mobileNavbar = document.querySelector('.mobile-navbar') as HTMLDivElement;
const mobileNavbarBtn = document.querySelector("#phone-menu-btn") as HTMLButtonElement;
const container = document.querySelector(".container-fluid") as HTMLDivElement;

mobileNavbarBtn.addEventListener("click", () => {
	if (mobileNavbar.style.display == "none") {
		mobileNavbar.style.display = "block";
		container.style.display = "none";
	}
	else {
		mobileNavbar.style.display = "none";
		container.style.display = "block";
	}
});


for (const aElem of mobileNavbar.children as HTMLCollectionOf<HTMLLinkElement>) {
	aElem.addEventListener("click", () => {
		mobileNavbar.style.display = "none";
	});
}


window.addEventListener('scroll', () => {
	const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

	if (currentScroll <= 0) {
		navbar.style.opacity = '1';
		return;
	}

	if (currentScroll > lastScrollTop && mobileNavbar.style.display != "block") {
		navbar.style.opacity = '0';
	} else {
		navbar.style.opacity = '1';
	}

	lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});

for (const partnerData of partnersData) {
	const img = document.createElement('img');
	img.className = "partner";
	img.src = partnerData.asset;
	img.setAttribute("data-bs-toggle", "modal");
	img.setAttribute("data-bs-target", "#sponsor-info");

	img.addEventListener("click", () => {
		modalBody.innerHTML = partnerData.info;
		modalHeader.style.backgroundImage = `linear-gradient(var(--dark-blue), var(--dark-blue)), url(${partnerData?.asset_modal ?? partnerData.asset})`;
		modalHeader.style.backgroundRepeat = "no-repeat";
		modalHeader.style.backgroundSize = "contain";
	});

	switch (partnerData.grade) {
		case "diamond": {
			img.style.borderColor = "var(--light-blue)"
			diamondDiv.appendChild(img);
			break;
		}
		case "gold": {
			img.style.borderColor = "#d4af37"
			goldDiv.appendChild(img);
			break;
		}
		default: {
			img.style.borderColor = "#c0c0c0"
			silverDiv.appendChild(img);
			break;
		}
	}
}
