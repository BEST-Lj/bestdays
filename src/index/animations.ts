import type { AnimationParams } from "animejs";

const baseConfig: AnimationParams = {
	duration: 800,
	ease: "linear",
	autoplay: false,
};

export const notebook: AnimationParams = {
	...baseConfig,
	translateX: [0, -5, -10, -20],
	rotate: [0, -2, -5, -8],
};

export const pen: AnimationParams = {
	...baseConfig,
	translateX: [0, 10, 20, 30],
	rotate: [0, -4, -8, -11],
};

export const calculator: AnimationParams = {
	...baseConfig,
	translateX: [0, 2, 4, 6],
	translateY: [0, -5, -10, -10],
	rotate: [0, -4, -8, -11],
};

export const keyboard: AnimationParams = {
	...baseConfig,
	translateX: [0, -20, -35, -45],
	translateY: [0, 10, 20, 31],
	rotate: [0, -2, -4, -6],
};

export const mouse: AnimationParams = {
	...baseConfig,
	translateX: [0, 70, 140, 165],
	translateY: [0, -20, -30, -40],
	rotate: [0, 10, 20, 25],
};
