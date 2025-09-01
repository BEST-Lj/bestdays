import type { DrawableSVGGeometry, JSAnimation } from "animejs";
import type { PDFMouseProps, PDFNavigationProps, PDFProps, PDFRenderProps, PDFTouchProps, RenderHTMLElements } from "./types.ts";

export class Globals {
	static pdfTouchProps = {
		isTouch: false,
		initialDistance: 0,
		touchStartX: 0,
		touchStartY: 0
	} as PDFTouchProps;

	static pdfMouseProps = {
		isDragging: false,
		translateX: 0,
		translateY: 0,
		startX: 0,
		startY: 0
	} as PDFMouseProps;

	static pdfRenderProps = {
		startScale: 1,
		currScale: 1,
		topEdge: 0,
	} as PDFRenderProps;

	static pdfProps = {
		isMobile: /iPhone||Android/i.test(navigator.userAgent),
		isRendering: false,
		currPage: 1,
	} as PDFProps;

	static renderHTMLElements = {
		pdfView: document.querySelector("#pdf-view") as HTMLIFrameElement,
		pdfWrapper: document.getElementById("pdf-wrapper") as HTMLDivElement,
		pdfContainer: document.querySelector("#pdf-container") as HTMLDivElement
	} as RenderHTMLElements;

	static pdfNavigationProps = {
		parentDiv: document.querySelector(".pdf-controls") as HTMLDivElement,
		prevBtn: document.querySelector(".pdf-prev-btn") as HTMLButtonElement,
		nextBtn: document.querySelector(".pdf-next-btn") as HTMLButtonElement,
		pageInfo: document.querySelector(".pdf-pages-info") as HTMLSpanElement,
	} as PDFNavigationProps;

	static loadingIndicator = document.querySelector("#loading-icon") as HTMLElement;
	static loadingAnimation: JSAnimation | null = null;
	static loadingDrawable: DrawableSVGGeometry[] | null = null;

	static canvas = document.getElementById("pdf-canvas") as HTMLCanvasElement;
	static ctx = Globals.canvas.getContext("2d");

	static touchMoveTimeout: NodeJS.Timeout | null = null;
}
