import { animate, type AnimationParams } from "animejs";
import { calculator, keyboard, mouse, notebook, pen } from "./animations";
const navigationButtons = document.querySelectorAll(".program-navigation button") as NodeListOf<HTMLButtonElement>;

const animations: Record<string, AnimationParams> = {
	notebook,
	pen,
	calculator,
	keyboard,
	mouse
};

function createAnimation(btn: HTMLButtonElement, pattern: SVGPatternElement) {
	const patternItem = pattern.id.split("-").pop();
	if (!patternItem) return;

	const params = animations[patternItem];
	if (!params) return;

	const animation = animate(pattern, { ...params });

	btn.addEventListener("mouseenter", () => {
		animation.play();
	});

	btn.addEventListener("mouseleave", () => {
		animation.reverse();
		animation.resume();
	});
}

for (let i = 0; i < navigationButtons.length; i++) {
	const btn = navigationButtons[i];

	const svgContainer = document.createElement("div");
	svgContainer.classList.add("svg-wrapper");
	btn.prepend(svgContainer);

	let svgElem: SVGSVGElement | null;

	btn.addEventListener("click", () => {
		document.location.href = `/pages/program.html?active-article=${i}`
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
			for (const pattern of patternElems) {
				createAnimation(btn, pattern);
			}
		});
}

