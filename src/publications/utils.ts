export function getDistance(touch1: Touch, touch2: Touch) {
	const dx = touch1.clientX - touch2.clientX;
	const dy = touch1.clientY - touch2.clientY;
	return Math.sqrt(dx * dx + dy * dy);
};

export function getCenter(touch1: Touch, touch2: Touch) {
	return {
		x: (touch1.clientX + touch2.clientX) / 2,
		y: (touch1.clientY + touch2.clientY) / 2
	};
};
