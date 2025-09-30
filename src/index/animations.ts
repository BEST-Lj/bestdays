import { createTimeline, type DefaultsParams, type Timeline } from "animejs";

const baseConfig: DefaultsParams = {
	duration: 400,
	ease: "linear",
	autoplay: false,
};

export function notebook(pattern: SVGPatternElement, gElement: SVGGElement, folderGElem: SVGGElement | null): Timeline {
	const timeline = createTimeline({ defaults: baseConfig });

	timeline.add(gElement, {
		translateX: [0, -30, -60, -80],
	});
	timeline.add(pattern, {
		rotate: [0, -4, -8, -11],
	}, 0);
	if (folderGElem != null) {
		timeline.add(folderGElem, {
			translateY: [204, 208, 212, 216]
		}, 0)
	}

	timeline.pause();

	return timeline;
}

export function pen(pattern: SVGPatternElement, gElement: SVGGElement, folderGElem: SVGGElement | null): Timeline {
	const timeline = createTimeline({ defaults: baseConfig });
	pattern.style.transformOrigin = "center";

	timeline.add(gElement, {
		translateX: [0, 20, 40, 60],
		translateY: [0, -20, -40, -60]
	});
	timeline.add(pattern, {
		rotate: [0, -5, -10, -15],
	}, 0);
	if (folderGElem != null) {
		timeline.add(folderGElem, {
			translateY: [204, 208, 212, 216]
		}, 0)
	}

	timeline.pause();

	return timeline;
}

export function calculator(pattern: SVGPatternElement, gElement: SVGGElement, folderGElem: SVGGElement | null): Timeline {
	const timeline = createTimeline({ defaults: baseConfig });

	timeline.add(gElement, {
		translateX: [0, 3, 6, 9],
	});
	timeline.add(pattern, {
		rotate: [0, -3, -6, -9],
	}, 0);
	if (folderGElem != null) {
		timeline.add(folderGElem, {
			translateY: [204, 208, 212, 216]
		}, 0)
	}

	timeline.pause();

	return timeline;
}

export function keyboard(pattern: SVGPatternElement, gElement: SVGGElement, folderGElem: SVGGElement | null): Timeline {
	const timeline = createTimeline({ defaults: baseConfig });

	timeline.add(gElement, {
		translateX: [0, -16, -32, -50],
		translateY: [0, -10, -20, -30],
	});
	timeline.add(pattern, {
		rotate: [0, -1, -2, -4],
	}, 0);
	if (folderGElem != null) {
		timeline.add(folderGElem, {
			translateY: [204, 208, 212, 216]
		}, 0)
	}

	timeline.pause();

	return timeline;
}

export function mouse(pattern: SVGPatternElement, gElement: SVGGElement, folderGElem: SVGGElement | null): Timeline {
	const timeline = createTimeline({ defaults: baseConfig });

	pattern.style.transformOrigin = "center left";

	timeline.add(gElement, {
		translateX: [0, 10, 20, 30],
		translateY: [0, -60, -120, -180],
	});
	timeline.add(pattern, {
		rotate: [0, 7, 14, 22],
	}, 0);
	if (folderGElem != null) {
		timeline.add(folderGElem, {
			translateY: [204, 208, 212, 216]
		}, 0)
	}

	timeline.pause();

	return timeline;
}
