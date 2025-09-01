import { createTimeline } from "animejs";
import teamData25 from "./json/team.json";
import teamData24 from "./json/team24.json";
import "./toolbar.ts"
const teamDiv25 = document.querySelector("#bdz-2025") as HTMLDivElement;
const teamDiv24 = document.querySelector("#bdz-2024") as HTMLDivElement;
const toggleSlider = document.querySelector(".slider-background") as HTMLDivElement;
const toggle24 = document.getElementById("2024") as HTMLInputElement;
const toggle25 = document.getElementById("2025") as HTMLInputElement;

const showHideTeam = createTimeline({
	defaults: {
		duration: 200,
		ease: "linear",
		autoplay: false,
	},
});

showHideTeam.add(toggleSlider, { left: "50%" }, 0);
showHideTeam.add(teamDiv25, { opacity: [1, 0] }, 0);
showHideTeam.add(teamDiv24, { opacity: [0, 1] }, 0);
showHideTeam.pause();

toggle24.addEventListener("click", () => {
	showHideTeam.play();
});

toggle25.addEventListener("click", () => {
	showHideTeam.reverse();
	showHideTeam.resume();
});


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

for (const person of teamData25) {
	addPersonToDiv(person, teamDiv25)
}

teamData24.forEach((person) => {
	addPersonToDiv(person, teamDiv24);
})
