import teamData from "./json/team.json";
const teamDiv = document.querySelector(".team-div") as HTMLDivElement;

let lastScrollTop = 0;
const navbar = document.querySelector('.navbar') as HTMLDivElement;
const mobileNavbar = document.querySelector('.mobile-navbar') as HTMLDivElement;
const mobileNavbarBtn = document.querySelector("#phone-menu-btn") as HTMLButtonElement;
const container = document.querySelector(".container-fluid") as HTMLDivElement;

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
for (const person of teamData) {
	const outerDiv = document.createElement('div');
	const imgDiv = document.createElement('div');
	const img = document.createElement('img');
	const label = document.createElement('label');

	outerDiv.className = 'team';
	imgDiv.className = 'img-wrapper';
	img.className = 'person-image';
	img.src = person.asset;
	img.alt = person.name;

	label.innerHTML = `${person.job}<br><b>${person.name}</b>`;

	imgDiv.appendChild(img);
	outerDiv.appendChild(imgDiv);
	outerDiv.appendChild(label);
	teamDiv.appendChild(outerDiv);


	if (person.linkedIn.length == 0) {
		imgDiv.addEventListener("mouseenter", () => {
			imgDiv.style.border = "3px solid var(--main-blue)";
		});
	}
	else {
		outerDiv.addEventListener('click', () => {
			window.open(person.linkedIn);
		});
	}
}
