import { createTimeline, type DefaultsParams, type Timeline } from "animejs";

const baseConfig: DefaultsParams = {
	duration: 800,
	ease: "linear",
	autoplay: false,
};

export function notebook(pattern: SVGPatternElement, gElement: SVGGElement): Timeline {
	const timeline = createTimeline({ defaults: baseConfig });

	timeline.add(gElement, {
		translateX: [0, -30, -60, -90],
	});
	timeline.add(pattern, {
		rotate: [0, -5, -10, -15,],
	}, 0);

	timeline.pause();

	return timeline;
}

export function pen(pattern: SVGPatternElement, gElement: SVGGElement): Timeline {
	const timeline = createTimeline({ defaults: baseConfig });

	timeline.add(gElement, {
		translateX: [0, 2, 4, 6],
		translateY: [0, -5, -7, -9]
	});
	timeline.add(pattern, {
		rotate: [0, -5, -10, -14],
	}, 0);

	timeline.pause();

	return timeline;
}

export function calculator(pattern: SVGPatternElement, gElement: SVGGElement): Timeline {
	const timeline = createTimeline({ defaults: baseConfig });

	timeline.add(gElement, {
		translateX: [0, 8, 16, 24],
	});
	timeline.add(pattern, {
		rotate: [0, -5, -10, -15],
	}, 0);

	timeline.pause();

	return timeline;
}

export function keyboard(pattern: SVGPatternElement, gElement: SVGGElement): Timeline {
	const timeline = createTimeline({ defaults: baseConfig });

	timeline.add(gElement, {
		translateX: [0, -16, -32, -50],
		translateY: [0, -10, -20, -30],
	});
	timeline.add(pattern, {
		rotate: [0, -1, -2, -4],
	}, 0);

	timeline.pause();

	return timeline;
}

export function mouse(pattern: SVGPatternElement, gElement: SVGGElement): Timeline {
	const timeline = createTimeline({ defaults: baseConfig });

	pattern.style.transformOrigin = "center left";

	timeline.add(gElement, {
		translateX: [0, 10, 20, 30],
		translateY: [0, -60, -120, -180],
	});
	timeline.add(pattern, {
		rotate: [0, 7, 14, 22],
	}, 0);

	timeline.pause();

	return timeline;
}
