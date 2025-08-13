let lastScrollTop = 0;
let index = 0;
const navbar = document.querySelector('.navbar') as HTMLDivElement;
const mobileNavbar = document.querySelector('.mobile-navbar') as HTMLDivElement;
const mobileNavbarBtn = document.querySelector("#phone-menu-btn") as HTMLButtonElement;
const container = document.querySelector(".container-fluid") as HTMLDivElement;
const html = document.querySelector("html") as HTMLElement;

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

function setBackgroundPosition(index: number, offEdge: boolean = false) {
	switch (index) {
		case 0:
			if (offEdge) {
				html.style.backgroundPosition = `calc(100% - 100vw) calc(0% + 75vh), center`;

				setTimeout(() => {
					html.style.transition = "none";
					html.style.backgroundPosition = `calc(100% + 100vw) calc(100% - 50vh), center`;

					void html.offsetWidth;

					html.style.transition = "background-position 0.8s cubic-bezier(0.25, 0.25, 0.75, 1)";
					html.style.backgroundPosition = `calc(100% + 40vw) 65%, center`;
				}, 400);
			}
			else {
				html.style.backgroundPosition = `calc(100% + 40vw) 65%, center`;
			}
			break;
		case 1:
			html.style.backgroundPosition = `calc(100% + 5vw) 35%, center`;
			break;
		case 2:
			if (offEdge) {
				html.style.backgroundPosition = `calc(100% + 100vw) calc(100% - 50vh), center`;

				setTimeout(() => {
					html.style.transition = "none";
					html.style.backgroundPosition = `calc(100% - 100vw) calc(0% + 75vh), center`;

					void html.offsetWidth;

					html.style.transition = "background-position 0.8s cubic-bezier(0.25, 0.25, 0.75, 1)";
					html.style.backgroundPosition = `calc(100% - 35vw) 10%, center`;
				}, 400);
			}
			else {
				html.style.backgroundPosition = `calc(100% - 35vw) 0%, center`;
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

nextBtns.forEach((btn) => btn.addEventListener("click", () => {
	index = (index + 1) % posters.length;
	showPoster(index == 0 ? posters.length - 1 : index - 1, index)
	setBackgroundPosition(index, index == 0);
	resetInterval();
}));

prevBtns.forEach((btn) => btn.addEventListener("click", () => {
	index = (index - 1 + posters.length) % posters.length;
	showPoster(index == posters.length - 1 ? 0 : index + 1, index)
	setBackgroundPosition(index, index == posters.length - 1);
	resetInterval();
}));

function resetInterval() {
	clearInterval(intervalId);
	intervalId = setInterval(setVisiblePoster, 15000);
}

let intervalId = setInterval(setVisiblePoster, 15000);

function setVisiblePoster() {
	showPoster(index == 0 ? posters.length - 1 : index - 1, index)
	setBackgroundPosition(index);
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
