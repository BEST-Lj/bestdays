import { animate } from "animejs";
import "./toolbar.ts"
interface articleInfo {
	shown: boolean,
	shownOrder?: number,
}

const articles = document.querySelectorAll(".article") as NodeListOf<HTMLElement>
const articleMap = new Map<HTMLElement, articleInfo>();
const navbarRect = document.querySelector(".navbar")!.getBoundingClientRect();

const scrollingElement = document.scrollingElement || document.documentElement;
let shownArticles = 0;

function moveScrollWithArticle(el: HTMLElement) {
	const rect = el.getBoundingClientRect();
	const absoluteTop = rect.top + window.scrollY;

	const scrollPos = absoluteTop - navbarRect.height - (1 / 10 * window.innerHeight);

	animate(scrollingElement, {
		scrollTop: scrollPos,
		duration: 300,
		ease: "inOutSine"
	});
}

function hideShowArticleSwitch(article: HTMLElement) {
	const articleInfo = articleMap.get(article);

	const content: HTMLDivElement = article.querySelector(".content")!;
	const arrow = article.querySelector(".arrow") as HTMLDivElement;

	if (articleInfo!.shown) {
		content.classList.remove("shown");
		arrow.classList.remove("shown");

		articleMap.get(article)!.shown = false;
		shownArticles--;
	}
	else {
		/* content.classList.add("shown");
		arrow.classList.add("shown"); */
		articleInfo!.shown = true;
		articleInfo!.shownOrder = shownArticles;
		content.classList.add("shown");
		arrow.classList.add("shown");


		shownArticles++;
		moveScrollWithArticle(article);


		/* 
		if (shownArticles < 3)
			return;
		setTimeout(() => {
			const firstArticle = firstShownArticle()!;
			hideShowArticleSwitch(firstArticle);
		}, 1500); */

	}
}

for (const article of articles) {
	articleMap.set(article, { shown: false });
	const header = article.querySelector(".header") as HTMLDivElement

	header.addEventListener("click", () => {
		hideShowArticleSwitch(article);
	});
}
