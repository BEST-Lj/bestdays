import type { TransitionProps } from "./types";

let lastScrollTop = 0;
let index = 0;
const navbar = document.querySelector('.navbar') as HTMLDivElement;
const mobileNavbar = document.querySelector('.mobile-navbar') as HTMLDivElement;
const mobileNavbarBtn = document.querySelector("#phone-menu-btn") as HTMLButtonElement;
const container = document.querySelector(".container-fluid") as HTMLDivElement;
const chemIcon = document.querySelector(".chem-icon") as HTMLElement;
const isMobile = window.innerWidth < 1100;

mobileNavbarBtn.addEventListener("click", () => {
	if (mobileNavbar.style.display == "none") {
		mobileNavbar.style.display = "block";
		container.style.display = "none";
	}
	else {
		mobileNavbar.style.display = "none";
		container.style.display = "block";
	}
});

for (const aElem of mobileNavbar.children as HTMLCollectionOf<HTMLLinkElement>) {
	aElem.addEventListener("click", () => {
		mobileNavbar.style.display = "none";
	});
}

const posters = document.querySelectorAll(".poster") as NodeListOf<HTMLDivElement>;
const prevBtns = document.querySelectorAll(".back") as NodeListOf<HTMLButtonElement>;
const nextBtns = document.querySelectorAll(".next") as NodeListOf<HTMLButtonElement>;
posters[index].classList.add('active');

let transitionProps: TransitionProps;

function iconOffEdgeTransitionEnd() {
	transitionProps.element.removeEventListener("transitionend", transitionProps.event);
	transitionProps.element.style.transition = transitionProps.cssTransition;

	transitionProps.element.style.left = transitionProps.coords.x!;
	transitionProps.element.style.top = transitionProps.coords.y!;

	void chemIcon.offsetWidth;
}

function waitForTransitionEnd(element: HTMLElement): Promise<void> {
	return new Promise<void>((resolve) => {
		const handler = () => {
			element.removeEventListener("transitionend", handler);
			resolve();
		};
		element.addEventListener("transitionend", handler);
	});
}

async function setBackgroundPosition(index: number, offEdge: boolean = false) {
	switch (index) {
		case 0:
			if (offEdge) {
				chemIcon.style.transition = "top 0.4s cubic-bezier(0.25, 0.25, 0.75, 1), left 0.4s cubic-bezier(0.25, 0.25, 0.75, 1)"
				chemIcon.style.left = isMobile ? "-135vw" : `-45vw`;
				chemIcon.style.top = isMobile ? "55vh" : "30vh";

				await waitForTransitionEnd(chemIcon);

				transitionProps = {
					element: chemIcon,
					coords: {
						x: isMobile ? "70vw" : "100vw",
						y: isMobile ? "-85vh" : "-55vh"
					},
					event: iconOffEdgeTransitionEnd,
					cssTransition: "top 1ms linear, left 1ms linear"
				} as TransitionProps;
				chemIcon.addEventListener("transitionend", transitionProps.event);

				await waitForTransitionEnd(chemIcon);

				transitionProps = {
					element: chemIcon,
					coords: {
						x: isMobile ? `35vw` : `65vw`,
						y: isMobile ? "-45vh" : "-35vh"
					},
					event: iconOffEdgeTransitionEnd,
					cssTransition: "top 0.8s cubic-bezier(0.25, 0.25, 0.75, 1), left 0.8s cubic-bezier(0.25, 0.25, 0.75, 1)"
				} as TransitionProps;
				chemIcon.addEventListener("transitionend", transitionProps.event);
			} else {
				chemIcon.style.left = isMobile ? `35vw` : `65vw`;
				chemIcon.style.top = isMobile ? "-45vh" : "-35vh";
			}
			break;

		case 1:
			chemIcon.style.left = isMobile ? `-20vw` : `20vw`;
			chemIcon.style.top = "-10vh";
			break;

		case 2:
			if (offEdge) {
				chemIcon.style.transition = "top 0.4s cubic-bezier(0.25, 0.25, 0.75, 1), left 0.4s cubic-bezier(0.25, 0.25, 0.75, 1)"
				chemIcon.style.left = `90vw`;
				chemIcon.style.top = isMobile ? "-85vh" : "-55vh";

				await waitForTransitionEnd(chemIcon);

				transitionProps = {
					element: chemIcon,
					coords: {
						x: isMobile ? "-105vw" : `-65vw`,
						y: isMobile ? "55vh" : "40vh"
					},
					event: iconOffEdgeTransitionEnd,
					cssTransition: "top 1ms linear, left 1ms linear"
				} as TransitionProps;
				chemIcon.addEventListener("transitionend", transitionProps.event);

				await waitForTransitionEnd(chemIcon);

				transitionProps = {
					element: chemIcon,
					coords: {
						x: isMobile ? "-65vw" : `-25vw`,
						y: isMobile ? "25vh" : "15vh"
					},
					event: iconOffEdgeTransitionEnd,
					cssTransition: "top 0.8s cubic-bezier(0.25, 0.25, 0.75, 1), left 0.8s cubic-bezier(0.25, 0.25, 0.75, 1)"
				} as TransitionProps;
				chemIcon.addEventListener("transitionend", transitionProps.event);
			} else {
				chemIcon.style.left = isMobile ? "-65vw" : `-25vw`;
				chemIcon.style.top = isMobile ? "25vh" : "15vh";
			}
			break;
	}
}

function showPoster(oldIndex: number, newIndex: number) {
	posters[oldIndex].classList.remove('active');

	setTimeout(() => {
		posters[newIndex].classList.add('active');
	}, 100);
}

nextBtns.forEach((btn) => btn.addEventListener("click", async () => {
	index = (index + 1) % posters.length;
	showPoster(index == 0 ? posters.length - 1 : index - 1, index)
	await setBackgroundPosition(index, index == 0);
	resetInterval();
}));

prevBtns.forEach((btn) => btn.addEventListener("click", async () => {
	index = (index - 1 + posters.length) % posters.length;
	showPoster(index == posters.length - 1 ? 0 : index + 1, index)
	await setBackgroundPosition(index, index == posters.length - 1);
	resetInterval();
}));

function resetInterval() {
	clearInterval(intervalId);
	intervalId = setInterval(setVisiblePoster, 15000);
}

let intervalId = setInterval(setVisiblePoster, 15000);

async function setVisiblePoster() {
	showPoster(index == 0 ? posters.length - 1 : index - 1, index)
	await setBackgroundPosition(index);
}

window.addEventListener('scroll', () => {
	const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

	if (currentScroll <= 0) {
		navbar.style.opacity = '1';
		return;
	}

	if (currentScroll > lastScrollTop && mobileNavbar.style.display != "block") {
		navbar.style.opacity = '0';
	} else {
		navbar.style.opacity = '1';
	}

	lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});
