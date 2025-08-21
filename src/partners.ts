import "./toolbar.ts"
const diamondDiv = document.querySelector(".diamond") as HTMLDivElement;
const goldDiv = document.querySelector(".gold") as HTMLDivElement;
const silverDiv = document.querySelector(".silver") as HTMLDivElement;

import partnersData from "./json/partners.json";
const modalBody = document.querySelector(".modal-body") as HTMLDivElement;
const modalHeader = document.querySelector(".modal-header") as HTMLDivElement;

for (const partnerData of partnersData) {
	const img = document.createElement('img');
	img.className = "partner";
	img.src = partnerData.asset;
	img.setAttribute("data-bs-toggle", "modal");
	img.setAttribute("data-bs-target", "#sponsor-info");

	img.addEventListener("click", () => {
		modalBody.innerHTML = partnerData.info;
		modalHeader.style.backgroundImage = `linear-gradient(var(--dark-blue), var(--dark-blue)), url(${partnerData.asset})`;
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
