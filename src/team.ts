import { createTimeline } from "animejs";
import teamData26 from "./json/team.json";
import teamData25 from "./json/team25.json";
import teamData24 from "./json/team24.json";
import "./toolbar.ts"
const teamDiv26 = document.querySelector("#bdz-2026") as HTMLDivElement;
const teamDiv25 = document.querySelector("#bdz-2025") as HTMLDivElement;
const teamDiv24 = document.querySelector("#bdz-2024") as HTMLDivElement;
const toggleSlider = document.querySelector(".slider-background") as HTMLDivElement;
const toggle24 = document.getElementById("2024") as HTMLInputElement;
const toggle25 = document.getElementById("2025") as HTMLInputElement;
const toggle26 = document.getElementById("2026") as HTMLInputElement;

const joinBtn = document.querySelector("#join-btn") as HTMLButtonElement;



joinBtn.addEventListener("click", () => {
	window.open("https://docs.google.com/forms/d/e/1FAIpQLSfwvSfqM0WlfA4zWXTKv2_2HVroYr9hPaHIAUrl1V18Xw-heA/viewform", '_blank');
});

const showHideTeam = createTimeline({
	defaults: {
		duration: 200,
		ease: "linear",
		autoplay: false,
	},
});

function showTeam(active: "2024" | "2025" | "2026") {
	const sliderLeft =
		active === "2026" ? "4px" :
		active === "2025" ? "calc(33.333% + 4px)" :
		"calc(66.666% + 4px)";

	createTimeline({
		defaults: { duration: 200, ease: "linear" },
	})
		.add(toggleSlider, { left: sliderLeft }, 0)
		.add(teamDiv24, { opacity: active === "2024" ? 1 : 0 }, 0)
		.add(teamDiv25, { opacity: active === "2025" ? 1 : 0 }, 0)
		.add(teamDiv26, { opacity: active === "2026" ? 1 : 0 }, 0);

	teamDiv24.style.pointerEvents = active === "2024" ? "all" : "none";
	teamDiv25.style.pointerEvents = active === "2025" ? "all" : "none";
	teamDiv26.style.pointerEvents = active === "2026" ? "all" : "none";
}

toggle24.addEventListener("click", () => showTeam("2024"));
toggle25.addEventListener("click", () => showTeam("2025"));
toggle26.addEventListener("click", () => showTeam("2026"));


function addPersonToDiv(person: any, div: HTMLDivElement) {
	const imgDiv = document.createElement('div') as HTMLDivElement;
	const img = document.createElement('img') as HTMLImageElement;
	const labelDiv = document.createElement('div') as HTMLDivElement;
	const label = document.createElement("label") as HTMLLabelElement;

	imgDiv.className = "img-div";
	img.src = person.asset;
	img.alt = person.name;

	label.innerHTML = `${person.job}<br><b>${person.name}</b>`;

	labelDiv.className = "person-label-div";
	labelDiv.appendChild(label);

	imgDiv.appendChild(img);
	imgDiv.appendChild(labelDiv);
	div.appendChild(imgDiv);

	if (person.linkedIn) {
		imgDiv.addEventListener('click', () => {
			window.open(person.linkedIn, '_blank');
		});
		imgDiv.classList.add('has-link');
	} else {
		imgDiv.classList.remove('has-link');
	}
}

for (const person of teamData26) {
	addPersonToDiv(person, teamDiv26)
}

for (const person of teamData25) {
	addPersonToDiv(person, teamDiv25)
}

teamData24.forEach((person) => {
	addPersonToDiv(person, teamDiv24);
})
