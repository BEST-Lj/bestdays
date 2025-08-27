import "./toolbar.ts"
import articleJson from "./json/program.json";
import { articleTransition, chemIcon1Transition, chemIcon2Transition, chipIcon1Transition } from "./program/animations.ts";
import { animate } from "animejs";

const articlesDiv = document.querySelector(".articles") as HTMLDivElement;

let bgAnimationIndex = 0;

const prevArticle = document.querySelector(".prev-article") as HTMLButtonElement;
const nextArticle = document.querySelector(".next-article") as HTMLButtonElement;

const scrollingElement = document.scrollingElement || document.documentElement;
const navbarRect = document.querySelector(".navbar")!.getBoundingClientRect();

function switchBG(next: boolean) {
	const articlesLen = articlesDiv.children.length;
	if (next)
		bgAnimationIndex = (bgAnimationIndex + 1) % articlesLen;
	else
		bgAnimationIndex = (bgAnimationIndex - 1 + articlesLen) % articlesLen;

	chemIcon1Transition(bgAnimationIndex);
	chemIcon2Transition(bgAnimationIndex);
	chipIcon1Transition(bgAnimationIndex);
}


function switchArticle(next: boolean): void {
	switchBG(next);
	for (const article of articlesDiv.children) {
		const oldIndex = parseInt(article.getAttribute("index")!);
		const articlesLen = articlesDiv.children.length;

		const newIndex = next ? (oldIndex + 1) % articlesLen : (oldIndex - 1 + articlesLen) % articlesLen;

		article.setAttribute("index", `${newIndex}`);
		if (newIndex == 0) {
			(article as HTMLElement).style.pointerEvents = "auto";
			/* 			switchBackground(article.className, next); */

			const animation = animate(article, articleTransition(1000, next, true, false));
			animation.play();
		}
		else if (oldIndex == 0) {
			(article as HTMLElement).style.pointerEvents = "none";
			const animation = animate(article, articleTransition(600, !next, false, true));
			animation.play();
		}
	}
}

prevArticle.addEventListener("click", (_) => switchArticle(false));
nextArticle.addEventListener("click", (_) => switchArticle(true));

for (let i = 0; i < articleJson.length; i++) {
	const article = document.createElement("article") as HTMLDivElement;
	article.setAttribute("index", `${i}`);
	article.className = `${articleJson[i].title.toLowerCase()}`.replace(" ", "-");

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

	if (article.getAttribute("index") != "1") {
		const readMore = document.createElement("button") as HTMLButtonElement;
		readMore.type = "button";
		readMore.className = "read-more";
		readMore.innerText = "PREBERI VEČ";

		readMore.addEventListener("click", (_) => {
			const redirect = article.className.replaceAll("-", "");
			document.location.href = `/pages/${redirect}.html`
		});

		const enroll = document.createElement("button") as HTMLButtonElement;
		enroll.type = "button";
		enroll.className = "enroll";
		enroll.innerText = "PRIJAVI SE";

		buttonsDiv.append(enroll, readMore);
	}

	article.append(dateDiv, type, title, p, buttonsDiv);
	articlesDiv.appendChild(article);

	if (article.getAttribute("index") == "0") {
		article.style.opacity = "1.0";
		article.style.pointerEvents = "auto";
	}
}

function scrollToArticle(article: HTMLElement) {
	const rect = article.getBoundingClientRect();
	const absoluteTop = rect.top + window.scrollY;

	const scrollPos = absoluteTop - navbarRect.height - (1 / 10 * window.innerHeight);

	const maxScroll = scrollingElement.scrollHeight - window.innerHeight;
	const clampedScrollPos = Math.min(Math.max(scrollPos, 0), maxScroll);

	animate(scrollingElement, {
		scrollTop: clampedScrollPos,
		duration: 300,
		ease: "inOutSine"
	});
}

window.addEventListener("DOMContentLoaded", () => {
	const params = new URLSearchParams(window.location.search);
	const articleClass = params.get("active-article");

	if (articleClass == "delavnice" || articleClass == null) return;

	const isMobile = window.innerWidth <= 800;
	if (isMobile) {
		console.log(articleClass);
		const article = document.querySelector(`.${articleClass}`) as HTMLDivElement;
		console.log(article);
		scrollToArticle(article);

		return;
	}
	else {
		switchArticle(articleClass == "case-study");
	}
});
