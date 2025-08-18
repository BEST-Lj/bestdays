/* import type { TransitionProps } from "./types"; */

let lastScrollTop = 0;
let index = 0;
const mainDiv = document.querySelector('.main-div') as HTMLDivElement;
const navbar = document.querySelector('.navbar') as HTMLDivElement;
const mobileNavbar = document.querySelector('.mobile-navbar') as HTMLDivElement;
const mobileNavbarBtn = document.querySelector("#phone-menu-btn") as HTMLButtonElement;
const container = document.querySelector(".container-fluid") as HTMLDivElement;
const footer = document.querySelector(".footer") as HTMLDivElement;
/* const chemIcon = document.querySelector(".chem-icon") as HTMLElement;
const isMobile = window.innerWidth < 1100; */

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

let maxHeight: number = 0;
for (const poster of posters) {
	const index = parseInt(poster.getAttribute("index")!);
	poster.style.height = 'auto';
	maxHeight = Math.max(maxHeight, poster.clientHeight);

	poster.style.transform = `translateX(${-index * 30}px) scale(${index == 0 ? 1.0 : 1 - (index * 0.05)})`;

	if (index != 0) {
		poster.style.opacity = `${(1 / index) * 0.4}`;
		poster.classList.remove('active');
		poster.style.position = "absolute";
	}
}

const mainDivRect = mainDiv.getBoundingClientRect();
footer.style.top = mainDivRect.bottom + "px";



posters.forEach(p => {
	p.style.height = maxHeight - 10 + 'px';
});

function posterOrientationSwitch(next: boolean, translateStep = 30) {
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
