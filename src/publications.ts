import { animate, JSAnimation, svg, type DrawableSVGGeometry } from "animejs";
import publicationsData from "./json/publications.json";
import type { PDFMouseProps, PDFNavigationProps, PDFProps, PDFRenderProps, PDFTouchProps } from "./types";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import type { RenderParameters } from "pdfjs-dist/types/src/display/api";
const publications = document.querySelector(".publications") as HTMLDivElement;
const proceedings = document.querySelector(".proceedings") as HTMLDivElement;
const pdfView = document.querySelector("#pdf-view") as HTMLIFrameElement;
const pdfWrapper = document.getElementById("pdf-wrapper")!;
const pdfContainer = document.querySelector("#pdf-container") as HTMLDivElement;
const loadingIndicator = document.querySelector("#loading-icon") as HTMLElement;

let lastScrollTop = 0;
const navbar = document.querySelector('.navbar') as HTMLDivElement;
const mobileNavbar = document.querySelector('.mobile-navbar') as HTMLDivElement;
const mobileNavbarBtn = document.querySelector("#phone-menu-btn") as HTMLButtonElement;
const container = document.querySelector(".container-fluid") as HTMLDivElement;

GlobalWorkerOptions.workerSrc = `/public/assets/other/pdf.worker.mjs`;

let loadingAnimation: JSAnimation | null = null;
let loadingDrawable: DrawableSVGGeometry[] | null = null;

const pdfTouchProps = {
	isTouch: false,
	initialDistance: 0,
	touchStartX: 0,
	touchStartY: 0
} as PDFTouchProps;

const pdfMouseProps = {
	isDragging: false,
	translateX: 0,
	translateY: 0,
	startX: 0,
	startY: 0
} as PDFMouseProps;

const pdfRenderProps = {
	startScale: 1,
	currScale: 1,
	topEdge: 0,
} as PDFRenderProps;

const pdfProps = {
	isMobile: /iPhone||Android/i.test(navigator.userAgent),
	isRendering: false,
	currPage: 1,
} as PDFProps;

const pdfNavigationProps = {
	parentDiv: document.querySelector(".pdf-controls") as HTMLDivElement,
	prevBtn: document.querySelector(".pdf-prev-btn") as HTMLButtonElement,
	nextBtn: document.querySelector(".pdf-next-btn") as HTMLButtonElement,
	pageInfo: document.querySelector(".pdf-pages-info") as HTMLSpanElement,
} as PDFNavigationProps;


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

const canvas = document.getElementById("pdf-canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

function startLoadingAnimation(pathElement: HTMLElement) {
	loadingIndicator.style.display = 'block';

	if (!loadingDrawable) {
		loadingDrawable = svg.createDrawable(pathElement);
	}

	if (loadingAnimation) {
		loadingAnimation.restart();
	} else {
		loadingAnimation = animate(loadingDrawable, {
			draw: '0 1',
			ease: 'inOutQuart',
			duration: 3000,
			loop: true
		});
	}
}

function hideLoadingAnimation() {
	loadingIndicator.style.display = 'none';
}

function getDistance(touch1: Touch, touch2: Touch) {
	const dx = touch1.clientX - touch2.clientX;
	const dy = touch1.clientY - touch2.clientY;
	return Math.sqrt(dx * dx + dy * dy);
};

function getCenter(touch1: Touch, touch2: Touch) {
	return {
		x: (touch1.clientX + touch2.clientX) / 2,
		y: (touch1.clientY + touch2.clientY) / 2
	};
};

function pdfPageLoaded(pageNum: number) {
	hideLoadingAnimation();
	pdfRenderProps.renderTask = null;
	pdfProps.isRendering = false;

	pdfNavigationProps.prevBtn.disabled = pageNum === 1;
	pdfNavigationProps.nextBtn.disabled = pageNum === pdfProps.pdf.numPages;
	pdfNavigationProps.pageInfo.textContent = `${pageNum} / ${pdfProps.pdf.numPages}`;
	pdfNavigationProps.parentDiv.style.display = "flex";

	pdfMouseProps.translateX = 0;
	pdfTouchProps.touchStartX = 0;
	pdfMouseProps.translateY = 0;
	pdfTouchProps.touchStartY = 0;
	pdfRenderProps.currScale = 1;
	pdfWrapper.style.transform = `translate(0px, 0px) scale(1)`;

	requestAnimationFrame(() => {
		pdfRenderProps.canvasRect = canvas.getBoundingClientRect();
		pdfRenderProps.containerRect = pdfContainer.getBoundingClientRect();

		const scaleToFitWidth = pdfRenderProps.containerRect.width / pdfRenderProps.canvasRect.width;
		const scaleToFitHeight = pdfRenderProps.containerRect.height / pdfRenderProps.canvasRect.height;

		pdfRenderProps.startScale = Math.min(scaleToFitWidth, scaleToFitHeight);
		pdfRenderProps.currScale = pdfRenderProps.startScale;
		pdfRenderProps.pdfLeftEdgeX = pdfRenderProps.containerRect.left - pdfRenderProps.canvasRect.left;
		pdfWrapper.style.transform = `translate(0px, 0px) scale(${pdfRenderProps.currScale})`;
	});
}

function pdfPageError(error: any) {
	if (error?.name === "RenderingCancelledException") {
	} else {
		console.error("PDF render error:", error);
	}
	pdfRenderProps.renderTask = null;
	pdfProps.isRendering = false;
}

function initialPdfSettings() {
	pdfTouchProps.touchStartX = 0;
	pdfTouchProps.touchStartY = 0;

	pdfMouseProps.translateX = 0;
	pdfMouseProps.translateY = 0;

	pdfRenderProps.currScale = 1;

	pdfRenderProps.canvasRect = canvas.getBoundingClientRect();
	pdfRenderProps.containerRect = pdfContainer.getBoundingClientRect();
	pdfRenderProps.pdfLeftEdgeX = pdfRenderProps.containerRect.left - pdfRenderProps.canvasRect.left;

	pdfWrapper.style.transform = `translate(0px, 0px) scale(1)`;
}

function canvasMouseZoom(e: WheelEvent) {
	if (!e.ctrlKey || pdfRenderProps.containerRect == null || pdfRenderProps.pdfLeftEdgeX == null) return;
	e.stopPropagation();
	e.preventDefault();

	pdfRenderProps.canvasRect = canvas.getBoundingClientRect();
	const offsetX = e.clientX - pdfRenderProps.canvasRect.left;
	const offsetY = e.clientY - pdfRenderProps.canvasRect.top;

	const zoomFactor = 1.1;
	const scaleChange = e.deltaY < 0 ? zoomFactor : 1 / zoomFactor;

	const newScale = Math.min(Math.max(pdfRenderProps.currScale * scaleChange, pdfRenderProps.startScale), 3);
	if (newScale === pdfRenderProps.currScale) return;

	const dx = offsetX - (offsetX * newScale / pdfRenderProps.currScale);
	const dy = offsetY - (offsetY * newScale / pdfRenderProps.currScale);

	pdfRenderProps.pdfLeftEdgeX *= newScale / pdfRenderProps.currScale;

	const newXPos = pdfMouseProps.translateX + dx;
	const minXPos = pdfRenderProps.pdfLeftEdgeX - pdfRenderProps.canvasRect.width + pdfRenderProps.containerRect.width;

	if (pdfRenderProps.canvasRect.width > pdfRenderProps.containerRect.width) {
		pdfMouseProps.translateX = Math.min(Math.max(newXPos, minXPos), pdfRenderProps.pdfLeftEdgeX);
	}
	else {
		pdfMouseProps.translateX = Math.max(Math.min(newXPos, minXPos), pdfRenderProps.pdfLeftEdgeX);
	}

	const newYPos = pdfMouseProps.translateY + dy;
	const minYPos = pdfRenderProps.topEdge - pdfRenderProps.canvasRect.height + pdfRenderProps.containerRect.height;

	if (pdfRenderProps.canvasRect.height > pdfRenderProps.containerRect.height) {
		pdfMouseProps.translateY = Math.min(Math.max(newYPos, minYPos), 0);
	}
	else {
		pdfMouseProps.translateY = Math.max(Math.min(newYPos, minYPos), 0);
	}

	pdfRenderProps.currScale = newScale;

	pdfWrapper.style.transform = `translate(${pdfMouseProps.translateX}px, ${pdfMouseProps.translateY}px) scale(${pdfRenderProps.currScale})`;
}

function pdfTouchDrag(e: TouchEvent) {
	if (pdfRenderProps.containerRect == null || pdfRenderProps.pdfLeftEdgeX == null) return;
	pdfRenderProps.canvasRect = canvas.getBoundingClientRect();

	const dx = e.touches[0].clientX - pdfTouchProps.touchStartX;
	const dy = e.touches[0].clientY - pdfTouchProps.touchStartY;

	let newTranslateX: number;
	let newTranslateY: number;

	const newXPos = pdfMouseProps.translateX + dx;
	const minXPos = pdfRenderProps.pdfLeftEdgeX - pdfRenderProps.canvasRect.width + pdfRenderProps.containerRect.width;

	if (pdfRenderProps.canvasRect.width > pdfRenderProps.containerRect.width) {
		newTranslateX = Math.min(Math.max(newXPos, minXPos), pdfRenderProps.pdfLeftEdgeX);
	}
	else {
		newTranslateX = Math.max(Math.min(newXPos, minXPos), pdfRenderProps.pdfLeftEdgeX);
	}

	const newYPos = pdfMouseProps.translateY + dy;
	const minYPos = pdfRenderProps.pdfLeftEdgeX - pdfRenderProps.canvasRect.width + pdfRenderProps.containerRect.width;

	if (pdfRenderProps.canvasRect.height > pdfRenderProps.containerRect.height) {
		newTranslateY = Math.min(Math.max(newYPos, minYPos), 0);
	}
	else {
		newTranslateY = Math.max(Math.min(newYPos, minYPos), 0);
	}

	pdfWrapper.style.transform = `translate(${newTranslateX} px, ${newTranslateY}px) scale(${pdfRenderProps.currScale})`;
}

function pdfTouchZoom(e: TouchEvent) {
	if (pdfRenderProps.containerRect == null || pdfRenderProps.pdfLeftEdgeX == null) return;
	const currentDistance = getDistance(e.touches[0], e.touches[1]);
	const scaleChange = currentDistance / pdfTouchProps.initialDistance;
	const newScale = Math.min(Math.max(pdfRenderProps.startScale * scaleChange, pdfRenderProps.startScale), 3);

	if (newScale === pdfRenderProps.currScale) return
	pdfRenderProps.canvasRect = canvas.getBoundingClientRect();
	const center = getCenter(e.touches[0], e.touches[1]);
	const offsetX = center.x - pdfRenderProps.canvasRect.left;
	const offsetY = center.y - pdfRenderProps.canvasRect.top;

	const dx = offsetX - (offsetX * newScale / pdfRenderProps.currScale);
	const dy = offsetY - (offsetY * newScale / pdfRenderProps.currScale);

	pdfRenderProps.pdfLeftEdgeX *= newScale / pdfRenderProps.currScale;

	const newXPos = pdfMouseProps.translateX + dx
	const minXPos = pdfRenderProps.pdfLeftEdgeX - pdfRenderProps.canvasRect.width + pdfRenderProps.containerRect.width;

	if (pdfRenderProps.canvasRect.width > pdfRenderProps.containerRect.width) {
		pdfMouseProps.translateX = Math.min(Math.max(newXPos, minXPos), pdfRenderProps.pdfLeftEdgeX);
	}
	else {
		pdfMouseProps.translateX = Math.max(Math.min(newXPos, minXPos), pdfRenderProps.pdfLeftEdgeX);
	}

	const newYPos = pdfMouseProps.translateY + dy
	const minYPos = pdfRenderProps.topEdge - pdfRenderProps.canvasRect.height + pdfRenderProps.containerRect.height;

	if (pdfRenderProps.canvasRect.height > pdfRenderProps.containerRect.height) {
		pdfMouseProps.translateY = Math.min(Math.max(newYPos, minYPos), 0);
	}
	else {
		pdfMouseProps.translateY = Math.max(Math.min(newYPos, minYPos), 0);
	}

	pdfRenderProps.currScale = newScale;
	pdfWrapper.style.transform = `translate(${pdfMouseProps.translateX}px, ${pdfMouseProps.translateY}px) scale(${pdfRenderProps.currScale})`;
}

function pdfCompleteTouchEnd(e: TouchEvent) {
	if (!pdfMouseProps.isDragging || pdfRenderProps.pdfLeftEdgeX == null || pdfRenderProps.containerRect == null) return;
	pdfRenderProps.canvasRect = canvas.getBoundingClientRect();

	const newXPos = pdfMouseProps.translateX + (e.changedTouches[0].clientX - pdfTouchProps.touchStartX);
	const minXPos = pdfRenderProps.pdfLeftEdgeX - pdfRenderProps.canvasRect.width + pdfRenderProps.containerRect.width;

	if (pdfRenderProps.canvasRect.width > pdfRenderProps.containerRect.width) {
		pdfMouseProps.translateX = Math.min(Math.max(newXPos, minXPos), pdfRenderProps.pdfLeftEdgeX);
	}
	else {
		pdfMouseProps.translateX = Math.max(Math.min(newXPos, minXPos), pdfRenderProps.pdfLeftEdgeX);
	}

	const newYPos = pdfMouseProps.translateY + (e.changedTouches[0].clientY - pdfTouchProps.touchStartY);
	const minYPos = pdfRenderProps.topEdge - pdfRenderProps.canvasRect.height + pdfRenderProps.containerRect.height;

	if (pdfRenderProps.canvasRect.height > pdfRenderProps.containerRect.height) {
		pdfMouseProps.translateY = Math.min(Math.max(newYPos, minYPos), 0);
	}
	else {
		pdfMouseProps.translateY = Math.max(Math.min(newYPos, minYPos), 0);
	}

	pdfMouseProps.isDragging = false;
	pdfTouchProps.isTouch = false;
}

function pdfTouchZoomToDrag(e: TouchEvent) {
	pdfMouseProps.isDragging = true;
	pdfTouchProps.touchStartX = e.touches[0].clientX;
	pdfTouchProps.touchStartY = e.touches[0].clientY;
}

pdfView.addEventListener("show.bs.modal", initialPdfSettings);

canvas.addEventListener("wheel", canvasMouseZoom, { passive: false });
canvas.addEventListener("touchstart", (e) => {
	e.preventDefault();
	pdfTouchProps.isTouch = true;

	if (e.touches.length === 1) {
		pdfMouseProps.isDragging = true;
		pdfTouchProps.touchStartX = e.touches[0].clientX;
		pdfTouchProps.touchStartY = e.touches[0].clientY;
	} else if (e.touches.length === 2) {
		pdfMouseProps.isDragging = false;
		pdfTouchProps.initialDistance = getDistance(e.touches[0], e.touches[1]);
		pdfRenderProps.startScale = pdfRenderProps.currScale;
	}
}, { passive: false });

async function renderPage(pageNum: number) {
	if (pdfRenderProps.renderTask) {
		pdfRenderProps.renderTask.cancel();
		pdfRenderProps.renderTask = null;
	}

	if (pdfProps.isRendering) {
		return;
	}

	pdfProps.isRendering = true;

	ctx?.clearRect(0, 0, canvas.width, canvas.height);
	const page = await pdfProps.pdf.getPage(pageNum);

	let viewport = page.getViewport({ scale: 1 });
	const isComplexPDF = viewport.width > 1500 || viewport.width > viewport.height * 1.3;

	let baseScale: number;
	if (isComplexPDF) {
		baseScale = pdfProps.isMobile ? 0.5 : 1.0;
	} else {
		baseScale = pdfProps.isMobile ? 1.2 : 2.0;
	}
	viewport = page.getViewport({ scale: baseScale });

	const maxCanvasSize = pdfProps.isMobile ? 4096 : 8192;
	if (viewport.width > maxCanvasSize || viewport.height > maxCanvasSize) {
		const scaleFactor = Math.min(maxCanvasSize / viewport.width, maxCanvasSize / viewport.height);
		const adjustedViewport = page.getViewport({ scale: baseScale * scaleFactor });
		canvas.width = adjustedViewport.width;
		canvas.height = adjustedViewport.height;
	} else {
		canvas.width = viewport.width;
		canvas.height = viewport.height;
	}

	const renderContext = {
		canvasContext: ctx!,
		viewport: viewport,
	} as RenderParameters;
	pdfRenderProps.renderTask = page.render(renderContext);
	pdfRenderProps.renderTask.promise
		.then(() => pdfPageLoaded(pageNum))
		.catch((err) => {
			pdfPageError(err);
		}
		);
};

pdfNavigationProps.prevBtn.addEventListener('click', async () => {
	if (pdfProps.currPage == 1) return;
	if (pdfRenderProps.renderTask) {
		pdfRenderProps.renderTask.cancel();
		pdfRenderProps.renderTask = null;
	}
	pdfProps.isRendering = false;
	startLoadingAnimation(document.querySelector("#loading-icon .animated-path")!)

	animate(svg.createDrawable('path'), {
		draw: '0 1',
		ease: 'inOutQuad',
		duration: 5000,
		loop: true
	});

	pdfProps.currPage--;

	await renderPage(pdfProps.currPage);
});

pdfNavigationProps.nextBtn.addEventListener('click', async () => {
	if (pdfProps.currPage >= pdfProps.pdf.numPages) return;
	if (pdfRenderProps.renderTask) {
		pdfRenderProps.renderTask.cancel();
		pdfRenderProps.renderTask = null;
	}
	startLoadingAnimation(document.querySelector("#loading-icon .animated-path")!)

	animate(svg.createDrawable('path'), {
		draw: '0 1',
		ease: 'inOutQuad',
		duration: 5000,
		loop: true
	});

	pdfProps.isRendering = false;
	pdfProps.currPage++;
	await renderPage(pdfProps.currPage);
});

async function renderPDF(url: string) {
	pdfProps.task = getDocument(url);
	pdfProps.pdf = await pdfProps.task.promise;

	pdfProps.currPage = 1;

	pdfRenderProps.currScale = 1;
	pdfRenderProps.containerRect = pdfContainer.getBoundingClientRect();
	pdfRenderProps.canvasRect = canvas.getBoundingClientRect();

	pdfTouchProps.isTouch = false;
	pdfRenderProps.startScale = 1;
	pdfRenderProps.pdfLeftEdgeX = pdfRenderProps.containerRect.left - pdfRenderProps.canvasRect.left;

	pdfRenderProps.renderTask = null;
	pdfProps.isRendering = false;
	pdfNavigationProps.prevBtn.disabled = true;

	const keyboardHandler = (e: KeyboardEvent) => {
		if (pdfProps.isRendering) return;

		if (e.key === 'ArrowLeft' && pdfProps.currPage > 1) {
			pdfProps.currPage--;
			renderPage(pdfProps.currPage);
		} else if (e.key === 'ArrowRight' && pdfProps.currPage < pdfProps.pdf.numPages) {
			pdfProps.currPage++;
			renderPage(pdfProps.currPage);
		}
	};

	document.addEventListener('keydown', keyboardHandler);
	await renderPage(1);

	const removePageZoom = (e: WheelEvent) => {
		if (e.ctrlKey) {
			e.preventDefault();
			return false;
		}
	}
	const wheelEventHandler = (e: WheelEvent) => removePageZoom(e);
	document.addEventListener("wheel", wheelEventHandler, { passive: false });

	pdfView.addEventListener("hide.bs.modal", () => {
		if (pdfRenderProps.renderTask) {
			pdfRenderProps.renderTask.cancel();
			pdfRenderProps.renderTask = null;
		}
		pdfProps.isRendering = false;
		pdfProps.task.destroy();
		ctx?.clearRect(0, 0, canvas.width, canvas.height);

		document.removeEventListener("wheel", wheelEventHandler);
		document.removeEventListener('keydown', keyboardHandler);
		canvas.innerHTML = "";

		pdfTouchProps.isTouch = false;
		pdfRenderProps.currScale = 1;

		pdfMouseProps.translateX = 0;
		pdfTouchProps.touchStartX = 0;
		pdfMouseProps.translateY = 0;
		pdfTouchProps.touchStartY = 0;

		pdfNavigationProps.parentDiv.style.display = "none";
	});

	let touchMoveTimeout: NodeJS.Timeout | null = null;
	canvas.addEventListener("touchmove", (e) => {
		e.preventDefault();
		if (touchMoveTimeout) clearTimeout(touchMoveTimeout);

		touchMoveTimeout = setTimeout(() => {
			if (e.touches.length === 1 && pdfMouseProps.isDragging) {
				pdfTouchDrag(e);
			} else if (e.touches.length === 2) {
				pdfTouchZoom(e);
			}
		}, 16);
	}, { passive: false });

	canvas.addEventListener("touchend", (e) => {
		e.preventDefault();
		if (e.touches.length === 0) {
			pdfCompleteTouchEnd(e);
		} else if (e.touches.length === 1) {
			pdfTouchZoomToDrag(e)
		}
	}, { passive: false });

	canvas.addEventListener("mousedown", (e) => {
		pdfMouseProps.isDragging = true;
		pdfMouseProps.startX = e.clientX;
		pdfMouseProps.startY = e.clientY;
	});

	window.addEventListener("mousemove", (e) => {
		if (!pdfMouseProps.isDragging || pdfRenderProps.containerRect == null || pdfRenderProps.pdfLeftEdgeX == null) return;
		pdfRenderProps.canvasRect = canvas.getBoundingClientRect();

		const dx = e.clientX - pdfMouseProps.startX;
		const dy = e.clientY - pdfMouseProps.startY;

		let newTranslateX: number;
		let newTranslateY: number;
		if (pdfRenderProps.canvasRect.width > pdfRenderProps.containerRect.width) {
			newTranslateX = Math.min(Math.max(pdfMouseProps.translateX + dx, pdfRenderProps.pdfLeftEdgeX - pdfRenderProps.canvasRect.width + pdfRenderProps.containerRect.width), pdfRenderProps.pdfLeftEdgeX);
		}
		else {
			newTranslateX = Math.max(Math.min(pdfMouseProps.translateX + dx, pdfRenderProps.pdfLeftEdgeX - pdfRenderProps.canvasRect.width + pdfRenderProps.containerRect.width), pdfRenderProps.pdfLeftEdgeX);
		}

		if (pdfRenderProps.canvasRect.height > pdfRenderProps.containerRect.height) {
			newTranslateY = Math.min(Math.max(pdfMouseProps.translateY + dy, pdfRenderProps.topEdge - pdfRenderProps.canvasRect.height + pdfRenderProps.containerRect.height), 0);
		}
		else {
			newTranslateY = Math.max(Math.min(pdfMouseProps.translateY + dy, pdfRenderProps.topEdge - pdfRenderProps.canvasRect.height + pdfRenderProps.containerRect.height), 0);
		}

		pdfWrapper.style.transform = `translate(${newTranslateX}px, ${newTranslateY}px) scale(${pdfRenderProps.currScale})`;
	});

	window.addEventListener("mouseup", (e) => {
		if (!pdfMouseProps.isDragging || pdfRenderProps.containerRect == null || pdfRenderProps.pdfLeftEdgeX == null) return;
		pdfMouseProps.isDragging = false;
		pdfRenderProps.canvasRect = canvas.getBoundingClientRect();

		if (pdfRenderProps.canvasRect.width > pdfRenderProps.containerRect.width) {
			pdfMouseProps.translateX = Math.min(Math.max(pdfMouseProps.translateX + e.clientX - pdfMouseProps.startX, pdfRenderProps.pdfLeftEdgeX - pdfRenderProps.canvasRect.width + pdfRenderProps.containerRect.width), pdfRenderProps.pdfLeftEdgeX);
		}
		else {
			pdfMouseProps.translateX = Math.max(Math.min(pdfMouseProps.translateX + e.clientX - pdfMouseProps.startX, pdfRenderProps.pdfLeftEdgeX - pdfRenderProps.canvasRect.width + pdfRenderProps.containerRect.width), pdfRenderProps.pdfLeftEdgeX);
		}

		if (pdfRenderProps.canvasRect.height > pdfRenderProps.containerRect.height) {
			pdfMouseProps.translateY = Math.min(Math.max(pdfMouseProps.translateY + e.clientY - pdfMouseProps.startY, pdfRenderProps.topEdge - pdfRenderProps.canvasRect.height + pdfRenderProps.containerRect.height), 0);
		}
		else {
			pdfMouseProps.translateY = Math.max(Math.min(pdfMouseProps.translateY + e.clientY - pdfMouseProps.startY, pdfRenderProps.topEdge - pdfRenderProps.canvasRect.height + pdfRenderProps.containerRect.height), 0);
		}
	});
};

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

publicationsData.forEach(publication => {
	const div = document.createElement("div") as HTMLDivElement;
	div.className = publication.type;
	div.style.backgroundImage = `url(${publication.asset})`;

	const aspectRatio = publication.width && publication.height
		? publication.width / publication.height
		: 4 / 3;
	div.style.aspectRatio = `${aspectRatio} `;
	div.setAttribute("data-bs-toggle", "modal");
	div.setAttribute("data-bs-target", "#pdf-view");

	div.addEventListener("click", () => {
		renderPDF(publication.pdf);
		startLoadingAnimation(document.querySelector("#loading-icon .animated-path")!)

		pdfWrapper.style.transform = `scale(1)`;
		canvas.style.display = "block";
	});

	if (publication.type === "publication") {
		publications.appendChild(div);
	} else {
		proceedings.appendChild(div);
	}
});
