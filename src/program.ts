import "./toolbar.ts"
import articleJson from "./json/program.json";
import { animate, type AnimationParams } from "animejs";

const articlesDiv = document.querySelector(".articles") as HTMLDivElement;

const prevArticle = document.querySelector(".prev-article") as HTMLButtonElement;
const nextArticle = document.querySelector(".next-article") as HTMLButtonElement;

function switchArticle(next: boolean) {
	for (const article of articlesDiv.children) {
		const oldIndex = parseInt(article.getAttribute("index")!);
		const articlesLen = articlesDiv.children.length;

		const newIndex = next ? (oldIndex + 1) % articlesLen : (oldIndex - 1 + articlesLen) % articlesLen;

		article.setAttribute("index", `${newIndex}`);

		if (newIndex == 0) {
			(article as HTMLElement).style.pointerEvents = "auto";
			const animation = animate(article, {
				duration: 1000,
				ease: "linear",
				autoplay: false,
				translateX: next ? [-200, -150, -100, -50, 0] : [200, 150, 100, 50, 0],
				opacity: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
			} as AnimationParams);
			animation.play();
		}
		else if (oldIndex == 0) {
			(article as HTMLElement).style.pointerEvents = "none";
			const animation = animate(article, {
				duration: 600,
				ease: "linear",
				autoplay: false,
				translateX: next ? [0, 50, 100, 150, 200] : [0, -50, -100, -150, -200],
				opacity: [0.75, 0.5, 0.25, 0, 0],
			} as AnimationParams);
			animation.play();
		}
	}
}

prevArticle.addEventListener("click", (_) => switchArticle(false));
nextArticle.addEventListener("click", (_) => switchArticle(true));

for (let i = 0; i < articleJson.length; i++) {
	const article = document.createElement("article") as HTMLDivElement;
	article.setAttribute("index", `${i}`);

	const dateDiv = document.createElement("div") as HTMLDivElement;
	dateDiv.className = "date-div";
	const date = document.createElement("h2") as HTMLElement;
	date.innerText = articleJson[i].date;
	date.className = "date";

	dateDiv.appendChild(date);

	const type = document.createElement("h5") as HTMLElement;
	type.innerText = articleJson[i].type;
	type.className = "type";

	const title = document.createElement("h1") as HTMLElement;
	title.innerText = articleJson[i].title;
	title.className = "title";

	const p = document.createElement("p") as HTMLParagraphElement;
	p.innerHTML = articleJson[i].body;
	p.className = "body";

	const buttonsDiv = document.createElement("div") as HTMLDivElement;
	buttonsDiv.className = "article-buttons";

	const readMore = document.createElement("button") as HTMLButtonElement;
	readMore.type = "button";
	readMore.className = "read-more";
	readMore.innerText = "PREBERI VEČ";

	const enroll = document.createElement("button") as HTMLButtonElement;
	enroll.type = "button";
	enroll.className = "enroll";
	enroll.innerText = "PRIJAVI SE";

	buttonsDiv.append(enroll, readMore);

	article.append(dateDiv, type, title, p, buttonsDiv);
	articlesDiv.appendChild(article);

	if (article.getAttribute("index") == "0")
		article.style.opacity = "1.0";
}

window.addEventListener("DOMContentLoaded", () => {
	const params = new URLSearchParams(window.location.search);
	const activeInd = params.get("active-article");

	if (activeInd == "1") {
		switchArticle(true);
	}
	else if (activeInd == "2") {
		switchArticle(false);
	}
});
