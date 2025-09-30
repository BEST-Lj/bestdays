import { Timeline } from "animejs";
import { calculator, keyboard, mouse, notebook, pen } from "./animations";
const navigationButtons = document.querySelectorAll(".program-navigation button") as NodeListOf<HTMLButtonElement>;

const animations: Record<string, Function> = {
	notebook,
	pen,
	calculator,
	keyboard,
	mouse
};

function createAnimation(btn: HTMLButtonElement, pattern: SVGPatternElement, gElem: SVGGElement, folder: SVGGElement | null) {
	const patternItem = gElem.id.replace("-g-elem", "").split("-").pop();
	if (!patternItem) return;

	const timelineFunc = animations[patternItem];
	if (!timelineFunc) return;

	const a = timelineFunc(pattern, gElem, folder) as Timeline;


	btn.addEventListener("mouseenter", () => {
		a.play();
	});

	btn.addEventListener("mouseleave", () => {
		a.reverse();
		a.resume();
	});

	document.addEventListener("DOMContentLoaded", () => {
		a.restart();
	});
}

for (let i = 0; i < navigationButtons.length; i++) {
	const btn = navigationButtons[i];

	const svgContainer = document.createElement("div");
	svgContainer.classList.add("svg-wrapper");
	btn.prepend(svgContainer);

	let svgElem: SVGSVGElement | null;

	btn.addEventListener("click", () => {
		document.location.href = `/pages/program.html?active-article=${btn.className}`
	});

	fetch(`/assets/index/${btn.className}.svg`)
		.then(res => res.text())
		.then(svgText => {
			const parser = new DOMParser();
			const doc = parser.parseFromString(svgText, "image/svg+xml");
			svgElem = doc.querySelector("svg");
			if (svgElem) {
				svgContainer.appendChild(svgElem);
			}
		}).then(() => {
			const patternElems = svgElem!.querySelectorAll("pattern") as NodeListOf<SVGPatternElement>;
			const folderGElem = svgElem!.querySelector(`#${btn.className}-folder`) as SVGGElement;

			console.log(`${btn.className}-folder`);

			for (let i = 0; i < patternElems.length; i++) {
				const pattern = patternElems[i];
				const gElem = svgElem!.querySelector(`#${pattern.id}-g-elem`) as SVGGElement;
				console.log(folderGElem);
				createAnimation(btn, pattern, gElem, i == 0 ? folderGElem : null);
			}
		});
}

