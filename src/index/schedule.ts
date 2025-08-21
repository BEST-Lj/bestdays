let index = 0;
let translateStep: number

if (window.innerWidth > 1400) {
	translateStep = 30;
}
else if (window.innerWidth > 800) {
	translateStep = 25;
}
else {
	translateStep = 20;
}

const posters = document.querySelectorAll(".poster") as NodeListOf<HTMLDivElement>;
const prevBtns = document.querySelectorAll(".back") as NodeListOf<HTMLButtonElement>;
const nextBtns = document.querySelectorAll(".next") as NodeListOf<HTMLButtonElement>;

posters[index].classList.add('active');

let maxHeight: number = 0;
for (const poster of posters) {
	const index = parseInt(poster.getAttribute("index")!);

	poster.style.height = 'auto';
	poster.style.transform = `translateX(${-index * translateStep}px) scale(${index == 0 ? 1.0 : 1 - (index * 0.05)})`;

	maxHeight = Math.max(maxHeight, poster.clientHeight);

	if (index != 0) {
		poster.style.opacity = `${(1 / index) * 0.4}`;
		poster.classList.remove('active');
		poster.style.position = "absolute";
	}
}

posters.forEach(p => {
	p.style.height = maxHeight + 'px';
});

function posterOrientationSwitch(next: boolean) {
	let newIndex: number;
	for (const poster of posters) {
		const oldIndex = parseInt(poster.getAttribute("index")!);
		if (next) {
			newIndex = (oldIndex - 1 + posters.length) % posters.length;
		}
		else {
			newIndex = (oldIndex + 1) % posters.length;
		}

		poster.setAttribute("index", `${newIndex}`);

		poster.style.transform = `translateX(${-newIndex * translateStep}px) scale(${newIndex == 0 ? 1.0 : 1 - (newIndex * 0.05)})`;


		if (newIndex == 0) {
			poster.classList.add('active');
			poster.style.opacity = "";
			poster.style.position = "";
		}
		else {
			if (oldIndex == 0) {
				poster.style.opacity = `${(1 / newIndex) * 0.4} `;
				poster.classList.remove('active');
			}
			poster.style.position = "absolute";
		}
	}
}

nextBtns.forEach((btn) => btn.addEventListener("click", async () => {
	index = (index + 1) % posters.length;
	posterOrientationSwitch(true);

	resetInterval();
}));

prevBtns.forEach((btn) => btn.addEventListener("click", async () => {
	index = (index - 1 + posters.length) % posters.length;
	posterOrientationSwitch(false);

	resetInterval();
}));



function resetInterval() {
	clearInterval(intervalId);
	intervalId = setInterval(setVisiblePoster, 15000);
}

let intervalId = setInterval(setVisiblePoster, 15000);

async function setVisiblePoster() {
	posterOrientationSwitch(true)
}

