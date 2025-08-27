import { createAnimatable, type AnimationParams, } from "animejs";

export const articleTransition = (duration: number, left: boolean, visible: boolean, fadeOut: boolean) => {
	const translateArr = [200, 150, 100, 50, 0];
	if (fadeOut)
		translateArr.reverse();

	return {
		duration: duration,
		ease: "linear",
		autoplay: false,
		translateX: left ? translateArr.map(e => e * -1) : translateArr,
		opacity: visible ? [0, 1] : [1, 0]
	} as AnimationParams;
};

/**
 * Showing and hiding the chem icon on the interaktivne delavnice
*/
export const chemIcon1Animatable = createAnimatable(".chem-icon1", {
	right: 500,
	top: 500,
	rotate: 500,
	ease: "linear"
});

export const chemIcon1Transition = (index: number) => {
	switch (index) {
		case 0: {
			chemIcon1Animatable.right(-400);
			chemIcon1Animatable.top(-100);
			chemIcon1Animatable.rotate(0);
			break;
		}
		case 1: {
			chemIcon1Animatable.right(-1700);
			chemIcon1Animatable.top(-100);
			chemIcon1Animatable.rotate(60);
			break;
		}
		case 2: {
			chemIcon1Animatable.right(-400);
			chemIcon1Animatable.top(900);
			chemIcon1Animatable.rotate(-60);
			break;
		}
	}
}


export const chemIcon2Animatable = createAnimatable(".chem-icon2", {
	left: 500,
	top: 500,
	rotate: 500,
	ease: "linear"
});

export const chemIcon2Transition = (index: number) => {
	switch (index) {
		case 0: {
			chemIcon2Animatable.left(-2000);
			chemIcon2Animatable.top(-100);
			chemIcon2Animatable.rotate(0);
			break;
		}
		case 1: {
			chemIcon2Animatable.left(-300);
			chemIcon2Animatable.top(-100);
			chemIcon2Animatable.rotate(60);
			break;
		}
		case 2: {
			chemIcon2Animatable.left(0);
			chemIcon2Animatable.top(900);
			chemIcon2Animatable.rotate(120);
			break;
		}
	}
}


export const chipIcon1Animatable = createAnimatable(".chip-icon1", {
	left: { duration: 500, unit: "px" },
	top: { duration: 500, unit: "px" },
	ease: "linear"
});

export const chipIcon1Transition = (index: number) => {
	const chipIcon = document.querySelector(".chip-icon1") as HTMLElement;
	if (!chipIcon || !chipIcon.parentElement) return;

	const containerRect = chipIcon.parentElement.getBoundingClientRect();
	const elemRect = chipIcon.getBoundingClientRect();

	switch (index) {
		case 0: {
			chipIcon1Animatable.left(-275);
			chipIcon1Animatable.top(-175);
			break;
		}
		case 1: {
			const rightPos = containerRect.width - elemRect.width + 275;
			chipIcon1Animatable.left(rightPos);
			break;
		}
		case 2: {
			const centerHoriz = (containerRect.width / 2) - (elemRect.width / 2);
			chipIcon1Animatable.left(centerHoriz);
			chipIcon1Animatable.top(-50);
			break;
		}
	}
};
