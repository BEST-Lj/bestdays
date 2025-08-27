import { animate, svg } from "animejs";
import { Globals } from "./globals";

export function startLoadingAnimation(pathElement: HTMLElement) {
	Globals.loadingIndicator.style.display = 'block';

	if (!Globals.loadingDrawable) {
		Globals.loadingDrawable = svg.createDrawable(pathElement);
	}

	if (Globals.loadingAnimation) {
		Globals.loadingAnimation.restart();
	} else {
		Globals.loadingAnimation = animate(Globals.loadingDrawable, {
			draw: '0 1',
			ease: 'inOutQuart',
			duration: 3000,
			loop: true
		});
	}
}

export function hideLoadingAnimation() {
	Globals.loadingIndicator.style.display = 'none';
}
