import { getDocument } from "pdfjs-dist";
import { Globals } from "./globals";
import { keyboardPageNavigation, hideModal, touchMove, touchEnd, mouseDown, mouseMove, mouseUp } from "./events";
import { hideLoadingAnimation } from "./animations";

export function onPdfPageLoaded(pageNum: number) {
	hideLoadingAnimation();
	Globals.pdfRenderProps.renderTask = null;
	Globals.pdfProps.isRendering = false;

	Globals.pdfNavigationProps.prevBtn.disabled = pageNum === 1;
	Globals.pdfNavigationProps.nextBtn.disabled = pageNum === Globals.pdfProps.pdf.numPages;
	Globals.pdfNavigationProps.pageInfo.textContent = `${pageNum} / ${Globals.pdfProps.pdf.numPages}`;
	Globals.pdfNavigationProps.parentDiv.style.display = "flex";

	Globals.pdfMouseProps.translateX = 0;
	Globals.pdfTouchProps.touchStartX = 0;
	Globals.pdfMouseProps.translateY = 0;
	Globals.pdfTouchProps.touchStartY = 0;
	Globals.pdfRenderProps.currScale = 1;
	Globals.renderHTMLElements.pdfWrapper.style.transform = `translate(0px, 0px) scale(1)`;

	requestAnimationFrame(() => {
		Globals.pdfRenderProps.canvasRect = Globals.canvas.getBoundingClientRect();
		Globals.pdfRenderProps.containerRect = Globals.renderHTMLElements.pdfContainer.getBoundingClientRect();

		const scaleToFitWidth = Globals.pdfRenderProps.containerRect.width / Globals.pdfRenderProps.canvasRect.width;
		const scaleToFitHeight = Globals.pdfRenderProps.containerRect.height / Globals.pdfRenderProps.canvasRect.height;

		Globals.pdfRenderProps.startScale = Math.min(scaleToFitWidth, scaleToFitHeight);
		Globals.pdfRenderProps.currScale = Globals.pdfRenderProps.startScale;
		Globals.pdfRenderProps.pdfLeftEdgeX = Globals.pdfRenderProps.containerRect.left - Globals.pdfRenderProps.canvasRect.left;
		Globals.renderHTMLElements.pdfWrapper.style.transform = `translate(0px, 0px) Globals.scale(${Globals.pdfRenderProps.currScale})`;
	});
}

export function pdfPageError(error: any) {
	if (error?.name === "RenderingCancelledException") {
	} else {
		console.error("PDF render error:", error);
	}
	Globals.pdfRenderProps.renderTask = null;
	Globals.pdfProps.isRendering = false;
}

export function initialPdfSettings() {
	Globals.pdfTouchProps.touchStartX = 0;
	Globals.pdfTouchProps.touchStartY = 0;

	Globals.pdfMouseProps.translateX = 0;
	Globals.pdfMouseProps.translateY = 0;

	Globals.pdfRenderProps.currScale = 1;

	Globals.pdfRenderProps.canvasRect = Globals.canvas.getBoundingClientRect();
	Globals.pdfRenderProps.containerRect = Globals.renderHTMLElements.pdfContainer.getBoundingClientRect();
	Globals.pdfRenderProps.pdfLeftEdgeX = Globals.pdfRenderProps.containerRect.left - Globals.pdfRenderProps.canvasRect.left;

	Globals.renderHTMLElements.pdfWrapper.style.transform = `translate(0px, 0px) scale(1)`;
}

export async function renderPDF(url: string) {
	Globals.pdfProps.task = getDocument(url);
	Globals.pdfProps.pdf = await Globals.pdfProps.task.promise;

	Globals.pdfProps.currPage = 1;

	Globals.pdfRenderProps.currScale = 1;
	Globals.pdfRenderProps.containerRect = Globals.renderHTMLElements.pdfContainer.getBoundingClientRect();
	Globals.pdfRenderProps.canvasRect = Globals.canvas.getBoundingClientRect();

	Globals.pdfTouchProps.isTouch = false;
	Globals.pdfRenderProps.startScale = 1;
	Globals.pdfRenderProps.pdfLeftEdgeX = Globals.pdfRenderProps.containerRect.left - Globals.pdfRenderProps.canvasRect.left;

	Globals.pdfRenderProps.renderTask = null;
	Globals.pdfProps.isRendering = false;
	Globals.pdfNavigationProps.prevBtn.disabled = true;

	const keyboardPageNav = (e: KeyboardEvent) => keyboardPageNavigation(e);
	document.addEventListener('keydown', keyboardPageNav);

	await renderPage(1);

	const removePageZoom = (e: WheelEvent) => {
		if (e.ctrlKey) {
			e.preventDefault();
			return false;
		}
	};

	document.addEventListener("wheel", removePageZoom, { passive: false });

	Globals.renderHTMLElements.pdfView.addEventListener("hide.bs.modal", (_) => hideModal(removePageZoom, keyboardPageNav));
	Globals.canvas.addEventListener("touchmove", touchMove, { passive: false });
	Globals.canvas.addEventListener("touchend", touchEnd, { passive: false });

	Globals.canvas.addEventListener("mousedown", mouseDown);
	window.addEventListener("mousemove", mouseMove);
	window.addEventListener("mouseup", mouseUp);
};

export async function renderPage(pageNum: number) {
	if (Globals.pdfRenderProps.renderTask) {
		Globals.pdfRenderProps.renderTask.cancel();
		Globals.pdfRenderProps.renderTask = null;
	}

	if (Globals.pdfProps.isRendering) {
		return;
	}

	Globals.pdfProps.isRendering = true;

	Globals.ctx?.clearRect(0, 0, Globals.canvas.width, Globals.canvas.height);
	const page = await Globals.pdfProps.pdf.getPage(pageNum);

	let viewport = page.getViewport({ scale: 1 });
	const isComplexPDF = viewport.width > 1500 || viewport.width > viewport.height * 1.3;

	let baseScale: number;
	if (isComplexPDF) {
		baseScale = Globals.pdfProps.isMobile ? 0.5 : 1.0;
	} else {
		baseScale = Globals.pdfProps.isMobile ? 1.2 : 2.0;
	}
	viewport = page.getViewport({ scale: baseScale });

	const maxCanvasSize = Globals.pdfProps.isMobile ? 4096 : 8192;
	if (viewport.width > maxCanvasSize || viewport.height > maxCanvasSize) {
		const scaleFactor = Math.min(maxCanvasSize / viewport.width, maxCanvasSize / viewport.height);
		const adjustedViewport = page.getViewport({ scale: baseScale * scaleFactor });
		Globals.canvas.width = adjustedViewport.width;
		Globals.canvas.height = adjustedViewport.height;
	} else {
		Globals.canvas.width = viewport.width;
		Globals.canvas.height = viewport.height;
	}

	Globals.pdfRenderProps.renderParams = {
		canvasContext: Globals.ctx!,
		viewport: viewport,
	};
	Globals.pdfRenderProps.renderTask = page.render(Globals.pdfRenderProps.renderParams);
	Globals.pdfRenderProps.renderTask.promise
		.then(() => onPdfPageLoaded(pageNum))
		.catch((err) => pdfPageError(err));
};
