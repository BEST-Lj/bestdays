import { startLoadingAnimation } from "./animations";
import { Globals } from "./globals";
import { renderPage } from "./pdf-render";
import { getCenter, getDistance } from "./utils";

export function canvasMouseZoom(e: WheelEvent) {
	if (!e.ctrlKey || Globals.pdfRenderProps.containerRect == null || Globals.pdfRenderProps.pdfLeftEdgeX == null) return;
	e.stopPropagation();
	e.preventDefault();

	Globals.pdfRenderProps.canvasRect = Globals.canvas.getBoundingClientRect();
	const offsetX = e.clientX - Globals.pdfRenderProps.canvasRect.left;
	const offsetY = e.clientY - Globals.pdfRenderProps.canvasRect.top;

	const zoomFactor = 1.1;
	const scaleChange = e.deltaY < 0 ? zoomFactor : 1 / zoomFactor;

	const newScale = Math.min(Math.max(Globals.pdfRenderProps.currScale * scaleChange, Globals.pdfRenderProps.startScale), 3);
	if (newScale === Globals.pdfRenderProps.currScale) return;

	const dx = offsetX - (offsetX * newScale / Globals.pdfRenderProps.currScale);
	const dy = offsetY - (offsetY * newScale / Globals.pdfRenderProps.currScale);

	Globals.pdfRenderProps.pdfLeftEdgeX *= newScale / Globals.pdfRenderProps.currScale;

	const newXPos = Globals.pdfMouseProps.translateX + dx;
	const minXPos = Globals.pdfRenderProps.pdfLeftEdgeX - Globals.pdfRenderProps.canvasRect.width + Globals.pdfRenderProps.containerRect.width;

	if (Globals.pdfRenderProps.canvasRect.width > Globals.pdfRenderProps.containerRect.width) {
		Globals.pdfMouseProps.translateX = Math.min(Math.max(newXPos, minXPos), Globals.pdfRenderProps.pdfLeftEdgeX);
	}
	else {
		Globals.pdfMouseProps.translateX = Math.max(Math.min(newXPos, minXPos), Globals.pdfRenderProps.pdfLeftEdgeX);
	}

	const newYPos = Globals.pdfMouseProps.translateY + dy;
	const minYPos = Globals.pdfRenderProps.topEdge - Globals.pdfRenderProps.canvasRect.height + Globals.pdfRenderProps.containerRect.height;

	if (Globals.pdfRenderProps.canvasRect.height > Globals.pdfRenderProps.containerRect.height) {
		Globals.pdfMouseProps.translateY = Math.min(Math.max(newYPos, minYPos), 0);
	}
	else {
		Globals.pdfMouseProps.translateY = Math.max(Math.min(newYPos, minYPos), 0);
	}

	Globals.pdfRenderProps.currScale = newScale;

	Globals.renderHTMLElements.pdfWrapper.style.transform = `translate(${Globals.pdfMouseProps.translateX}px, ${Globals.pdfMouseProps.translateY}px) scale(${Globals.pdfRenderProps.currScale})`;
}

export function pdfTouchDrag(e: TouchEvent) {
	if (Globals.pdfRenderProps.containerRect == null || Globals.pdfRenderProps.pdfLeftEdgeX == null) return;

	Globals.pdfRenderProps.canvasRect = Globals.canvas.getBoundingClientRect();

	const dx = e.touches[0].clientX - Globals.pdfTouchProps.touchStartX;
	const dy = e.touches[0].clientY - Globals.pdfTouchProps.touchStartY;

	let newTranslateX: number;
	let newTranslateY: number;

	const newXPos = Globals.pdfMouseProps.translateX + dx;
	const minXPos = Globals.pdfRenderProps.pdfLeftEdgeX - Globals.pdfRenderProps.canvasRect.width + Globals.pdfRenderProps.containerRect.width;

	if (Globals.pdfRenderProps.canvasRect.width > Globals.pdfRenderProps.containerRect.width) {
		newTranslateX = Math.min(Math.max(newXPos, minXPos), Globals.pdfRenderProps.pdfLeftEdgeX);
	}
	else {
		newTranslateX = Math.max(Math.min(newXPos, minXPos), Globals.pdfRenderProps.pdfLeftEdgeX);
	}

	const newYPos = Globals.pdfMouseProps.translateY + dy;
	const minYPos = Globals.pdfRenderProps.pdfLeftEdgeX - Globals.pdfRenderProps.canvasRect.width + Globals.pdfRenderProps.containerRect.width;

	if (Globals.pdfRenderProps.canvasRect.height > Globals.pdfRenderProps.containerRect.height) {
		newTranslateY = Math.min(Math.max(newYPos, minYPos), 0);
	}
	else {
		newTranslateY = Math.max(Math.min(newYPos, minYPos), 0);
	}

	Globals.renderHTMLElements.pdfWrapper.style.transform = `translate(${newTranslateX}px, ${newTranslateY}px) scale(${Globals.pdfRenderProps.currScale})`;
}

export function pdfTouchZoom(e: TouchEvent) {
	if (Globals.pdfRenderProps.containerRect == null || Globals.pdfRenderProps.pdfLeftEdgeX == null) return;
	const currentDistance = getDistance(e.touches[0], e.touches[1]);
	const scaleChange = currentDistance / Globals.pdfTouchProps.initialDistance;

	const maxScale = 3;
	const newScale = Math.min(
		Math.max(Globals.pdfRenderProps.currScale * scaleChange, Globals.pdfRenderProps.startScale),
		maxScale
	);

	if (newScale === Globals.pdfRenderProps.currScale)
		return;

	Globals.pdfRenderProps.canvasRect = Globals.canvas.getBoundingClientRect();
	const center = getCenter(e.touches[0], e.touches[1]);
	const offsetX = center.x - Globals.pdfRenderProps.canvasRect.left;
	const offsetY = center.y - Globals.pdfRenderProps.canvasRect.top;

	const dx = offsetX - (offsetX * newScale / Globals.pdfRenderProps.currScale);
	const dy = offsetY - (offsetY * newScale / Globals.pdfRenderProps.currScale);

	Globals.pdfRenderProps.pdfLeftEdgeX *= newScale / Globals.pdfRenderProps.currScale;

	const newXPos = Globals.pdfMouseProps.translateX + dx
	const minXPos = Globals.pdfRenderProps.pdfLeftEdgeX - Globals.pdfRenderProps.canvasRect.width + Globals.pdfRenderProps.containerRect.width;

	if (Globals.pdfRenderProps.canvasRect.width > Globals.pdfRenderProps.containerRect.width) {
		Globals.pdfMouseProps.translateX = Math.min(Math.max(newXPos, minXPos), Globals.pdfRenderProps.pdfLeftEdgeX);
	}
	else {
		Globals.pdfMouseProps.translateX = Math.max(Math.min(newXPos, minXPos), Globals.pdfRenderProps.pdfLeftEdgeX);
	}

	const newYPos = Globals.pdfMouseProps.translateY + dy
	const minYPos = Globals.pdfRenderProps.topEdge - Globals.pdfRenderProps.canvasRect.height + Globals.pdfRenderProps.containerRect.height;

	if (Globals.pdfRenderProps.canvasRect.height > Globals.pdfRenderProps.containerRect.height) {
		Globals.pdfMouseProps.translateY = Math.min(Math.max(newYPos, minYPos), 0);
	}
	else {
		Globals.pdfMouseProps.translateY = Math.max(Math.min(newYPos, minYPos), 0);
	}

	Globals.pdfRenderProps.currScale = newScale;
	Globals.renderHTMLElements.pdfWrapper.style.transform = `translate(${Globals.pdfMouseProps.translateX}px, ${Globals.pdfMouseProps.translateY}px) scale(${Globals.pdfRenderProps.currScale})`;
}

export function pdfCompleteTouchEnd(e: TouchEvent) {
	if (!Globals.pdfMouseProps.isDragging || Globals.pdfRenderProps.pdfLeftEdgeX == null || Globals.pdfRenderProps.containerRect == null) return;
	Globals.pdfRenderProps.canvasRect = Globals.canvas.getBoundingClientRect();

	const newXPos = Globals.pdfMouseProps.translateX + (e.changedTouches[0].clientX - Globals.pdfTouchProps.touchStartX);
	const minXPos = Globals.pdfRenderProps.pdfLeftEdgeX - Globals.pdfRenderProps.canvasRect.width + Globals.pdfRenderProps.containerRect.width;

	if (Globals.pdfRenderProps.canvasRect.width > Globals.pdfRenderProps.containerRect.width) {
		Globals.pdfMouseProps.translateX = Math.min(Math.max(newXPos, minXPos), Globals.pdfRenderProps.pdfLeftEdgeX);
	}
	else {
		Globals.pdfMouseProps.translateX = Math.max(Math.min(newXPos, minXPos), Globals.pdfRenderProps.pdfLeftEdgeX);
	}

	const newYPos = Globals.pdfMouseProps.translateY + (e.changedTouches[0].clientY - Globals.pdfTouchProps.touchStartY);
	const minYPos = Globals.pdfRenderProps.topEdge - Globals.pdfRenderProps.canvasRect.height + Globals.pdfRenderProps.containerRect.height;

	if (Globals.pdfRenderProps.canvasRect.height > Globals.pdfRenderProps.containerRect.height) {
		Globals.pdfMouseProps.translateY = Math.min(Math.max(newYPos, minYPos), 0);
	}
	else {
		Globals.pdfMouseProps.translateY = Math.max(Math.min(newYPos, minYPos), 0);
	}

	Globals.pdfMouseProps.isDragging = false;
	Globals.pdfTouchProps.isTouch = false;
}

export function pdfTouchZoomToDrag(e: TouchEvent) {
	Globals.pdfMouseProps.isDragging = true;
	Globals.pdfTouchProps.touchStartX = e.touches[0].clientX;
	Globals.pdfTouchProps.touchStartY = e.touches[0].clientY;
}

export function canvasTouchStart(e: TouchEvent) {
	e.preventDefault();
	Globals.pdfTouchProps.isTouch = true;

	if (e.touches.length === 1) {
		Globals.pdfMouseProps.isDragging = true;
		Globals.pdfTouchProps.touchStartX = e.touches[0].clientX;
		Globals.pdfTouchProps.touchStartY = e.touches[0].clientY;
	} else if (e.touches.length === 2) {
		Globals.pdfMouseProps.isDragging = false;
		Globals.pdfTouchProps.initialDistance = getDistance(e.touches[0], e.touches[1]);
	}
}

export async function keyboardPageNavigation(event: KeyboardEvent) {
	if (event.key === 'ArrowLeft' && Globals.pdfProps.currPage > 1) {
		pdfPrevPage();
	}
	else if (event.key === 'ArrowRight' && Globals.pdfProps.currPage < Globals.pdfProps.pdf.numPages) {
		pdfNextPage();
	}
}

export function hideModal(
	removePageZoom: (e: WheelEvent) => false | undefined,
	keyboardPageNav: (e: KeyboardEvent) => Promise<void>) {
	if (Globals.pdfRenderProps.renderTask) {
		Globals.pdfRenderProps.renderTask.cancel();
		Globals.pdfRenderProps.renderTask = null;
	}
	Globals.pdfProps.isRendering = false;
	Globals.pdfProps.task.destroy();
	Globals.ctx?.clearRect(0, 0, Globals.canvas.width, Globals.canvas.height);

	document.removeEventListener("wheel", removePageZoom);
	document.removeEventListener('keydown', keyboardPageNav);
	Globals.canvas.innerHTML = "";

	Globals.pdfTouchProps.isTouch = false;
	Globals.pdfRenderProps.currScale = 1;

	Globals.pdfMouseProps.translateX = 0;
	Globals.pdfTouchProps.touchStartX = 0;
	Globals.pdfMouseProps.translateY = 0;
	Globals.pdfTouchProps.touchStartY = 0;

	Globals.pdfNavigationProps.parentDiv.style.display = "none";
}

export async function pdfPrevPage() {
	if (Globals.pdfProps.currPage == 1) return;

	if (Globals.pdfRenderProps.renderTask) {
		Globals.pdfRenderProps.renderTask.cancel();
		Globals.pdfRenderProps.renderTask = null;
	}
	startLoadingAnimation(document.querySelector("#loading-icon path")!)

	Globals.pdfProps.isRendering = false;
	Globals.pdfProps.currPage--;

	await renderPage(Globals.pdfProps.currPage);
}

export async function pdfNextPage() {
	if (Globals.pdfProps.currPage >= Globals.pdfProps.pdf.numPages) return;

	if (Globals.pdfRenderProps.renderTask) {
		Globals.pdfRenderProps.renderTask.cancel();
		Globals.pdfRenderProps.renderTask = null;
	}
	startLoadingAnimation(document.querySelector("#loading-icon path")!)

	Globals.pdfProps.isRendering = false;
	Globals.pdfProps.currPage++;
	await renderPage(Globals.pdfProps.currPage);
}

export function touchMove(e: TouchEvent) {
	e.preventDefault();
	if (Globals.touchMoveTimeout) clearTimeout(Globals.touchMoveTimeout);

	Globals.touchMoveTimeout = setTimeout(() => {
		if (e.touches.length === 2) {
			pdfTouchZoom(e);
		}
		else if (e.touches.length === 1 && Globals.pdfMouseProps.isDragging) {
			pdfTouchDrag(e);
		}
	}, 16);
}

export function touchEnd(e: TouchEvent) {
	e.preventDefault();
	if (e.touches.length === 0) {
		pdfCompleteTouchEnd(e);
	} else if (e.touches.length === 1) {
		pdfTouchZoomToDrag(e)
	}
}

export function mouseDown(e: MouseEvent) {
	Globals.pdfMouseProps.isDragging = true;
	Globals.pdfMouseProps.startX = e.clientX;
	Globals.pdfMouseProps.startY = e.clientY;
}

export function mouseMove(e: MouseEvent) {
	if (!Globals.pdfMouseProps.isDragging || Globals.pdfRenderProps.containerRect == null || Globals.pdfRenderProps.pdfLeftEdgeX == null) return;
	Globals.pdfRenderProps.canvasRect = Globals.canvas.getBoundingClientRect();

	const dx = e.clientX - Globals.pdfMouseProps.startX;
	const dy = e.clientY - Globals.pdfMouseProps.startY;

	let newTranslateX: number;
	let newTranslateY: number;
	if (Globals.pdfRenderProps.canvasRect.width > Globals.pdfRenderProps.containerRect.width) {
		newTranslateX = Math.min(Math.max(Globals.pdfMouseProps.translateX + dx, Globals.pdfRenderProps.pdfLeftEdgeX - Globals.pdfRenderProps.canvasRect.width + Globals.pdfRenderProps.containerRect.width), Globals.pdfRenderProps.pdfLeftEdgeX);
	}
	else {
		newTranslateX = Math.max(Math.min(Globals.pdfMouseProps.translateX + dx, Globals.pdfRenderProps.pdfLeftEdgeX - Globals.pdfRenderProps.canvasRect.width + Globals.pdfRenderProps.containerRect.width), Globals.pdfRenderProps.pdfLeftEdgeX);
	}

	if (Globals.pdfRenderProps.canvasRect.height > Globals.pdfRenderProps.containerRect.height) {
		newTranslateY = Math.min(Math.max(Globals.pdfMouseProps.translateY + dy, Globals.pdfRenderProps.topEdge - Globals.pdfRenderProps.canvasRect.height + Globals.pdfRenderProps.containerRect.height), 0);
	}
	else {
		newTranslateY = Math.max(Math.min(Globals.pdfMouseProps.translateY + dy, Globals.pdfRenderProps.topEdge - Globals.pdfRenderProps.canvasRect.height + Globals.pdfRenderProps.containerRect.height), 0);
	}

	Globals.renderHTMLElements.pdfWrapper.style.transform = `translate(${newTranslateX}px, ${newTranslateY}px) scale(${Globals.pdfRenderProps.currScale})`;
}

export function mouseUp(e: MouseEvent) {
	if (!Globals.pdfMouseProps.isDragging || Globals.pdfRenderProps.containerRect == null || Globals.pdfRenderProps.pdfLeftEdgeX == null) return;
	Globals.pdfMouseProps.isDragging = false;
	Globals.pdfRenderProps.canvasRect = Globals.canvas.getBoundingClientRect();

	if (Globals.pdfRenderProps.canvasRect.width > Globals.pdfRenderProps.containerRect.width) {
		Globals.pdfMouseProps.translateX = Math.min(Math.max(Globals.pdfMouseProps.translateX + e.clientX - Globals.pdfMouseProps.startX, Globals.pdfRenderProps.pdfLeftEdgeX - Globals.pdfRenderProps.canvasRect.width + Globals.pdfRenderProps.containerRect.width), Globals.pdfRenderProps.pdfLeftEdgeX);
	}
	else {
		Globals.pdfMouseProps.translateX = Math.max(Math.min(Globals.pdfMouseProps.translateX + e.clientX - Globals.pdfMouseProps.startX, Globals.pdfRenderProps.pdfLeftEdgeX - Globals.pdfRenderProps.canvasRect.width + Globals.pdfRenderProps.containerRect.width), Globals.pdfRenderProps.pdfLeftEdgeX);
	}

	if (Globals.pdfRenderProps.canvasRect.height > Globals.pdfRenderProps.containerRect.height) {
		Globals.pdfMouseProps.translateY = Math.min(Math.max(Globals.pdfMouseProps.translateY + e.clientY - Globals.pdfMouseProps.startY, Globals.pdfRenderProps.topEdge - Globals.pdfRenderProps.canvasRect.height + Globals.pdfRenderProps.containerRect.height), 0);
	}
	else {
		Globals.pdfMouseProps.translateY = Math.max(Math.min(Globals.pdfMouseProps.translateY + e.clientY - Globals.pdfMouseProps.startY, Globals.pdfRenderProps.topEdge - Globals.pdfRenderProps.canvasRect.height + Globals.pdfRenderProps.containerRect.height), 0);
	}
}
