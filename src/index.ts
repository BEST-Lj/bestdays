const articlesDiv = document.querySelector(".articles") as HTMLDivElement;
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
		console.log(mobileNavbar.style.display);
		navbar.style.opacity = '0';
	} else {
		navbar.style.opacity = '1';
	}

	lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});

import articleInfo from './json/index.json';

for (const articleData of articleInfo) {
	const article = document.createElement("article");
	if (window.matchMedia("(min-width: 1030px)").matches) {
		article.style.background = `
					linear-gradient(to right,
						rgba(0, 68, 170, 1) 40%,
						transparent 100%)`;
	} else {
		article.style.background = `
					linear-gradient(to bottom,
						rgba(0, 68, 170, 1) 40%,
						transparent 100%)`;
	}

	const div = document.createElement("div") as HTMLDivElement;
	div.className = "article-content";

	const arType = document.createElement("h2") as HTMLHeadingElement;
	arType.innerText = articleData.type.toUpperCase();

	const title = document.createElement("h1") as HTMLHeadingElement;
	title.innerText = articleData.title;

	const divBody = document.createElement("div") as HTMLDivElement;
	divBody.innerHTML = articleData.body;
	divBody.className = "article-body";

	div.appendChild(arType);
	div.appendChild(title);
	div.appendChild(divBody);

	const btnDiv = document.createElement("div") as HTMLDivElement;

	btnDiv.className = "article-btn-div"

	const btnPrijavi = document.createElement("button") as HTMLButtonElement;
	const btnPreberi = document.createElement("button") as HTMLButtonElement;

	btnPrijavi.className = "btn btn-warning";
	btnPreberi.className = "btn btn-dark";

	btnPrijavi.innerText = "PRIJAVI SE";
	btnPreberi.innerText = "PREBERI VEČ";

	/* btnDiv.appendChild(btnPrijavi);
	btnDiv.appendChild(btnPreberi); */

	const img = document.createElement("img");
	img.src = articleData.asset;

	article.appendChild(div);
	div.appendChild(btnDiv);
	article.appendChild(img)
	articlesDiv.appendChild(article)
}
