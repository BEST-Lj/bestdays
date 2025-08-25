import teamData from "./json/team.json";
import "./toolbar.ts"
const teamDiv = document.querySelector(".team-div") as HTMLDivElement;

for (const person of teamData) {
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
	teamDiv.appendChild(imgDiv);

	if (person.linkedIn) {
		imgDiv.addEventListener('click', () => {
			window.open(person.linkedIn, '_blank');
		});
		imgDiv.classList.add('has-link');
	} else {
		imgDiv.classList.remove('has-link');
	}
}
