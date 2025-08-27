import type { PDFDocumentLoadingTask, PDFDocumentProxy, RenderTask } from 'pdfjs-dist';
import type { RenderParameters } from 'pdfjs-dist/types/src/display/api';

export interface PDFTouchProps {
	isTouch: boolean,
	initialDistance: number;
	touchStartX: number;
	touchStartY: number;
}

export interface PDFMouseProps {
	isDragging: boolean,
	translateX: number;
	translateY: number;
	startX: number;
	startY: number;
}

export interface PDFRenderProps {
	startScale: number;
	currScale: number;
	containerRect: DOMRect | null,
	canvasRect: DOMRect | null,
	renderTask: RenderTask | null,
	pdfLeftEdgeX: number | null,
	topEdge: number,
	renderParams: RenderParameters
}

export interface PDFProps {
	isMobile: boolean,
	task: PDFDocumentLoadingTask,
	pdf: PDFDocumentProxy
	isRendering: boolean,
	pageCount: number | null,
	currPage: number,
}

export interface PDFNavigationProps {
	parentDiv: HTMLDivElement,
	prevBtn: HTMLButtonElement,
	nextBtn: HTMLButtonElement,
	pageInfo: HTMLSpanElement,
}

export interface RenderHTMLElements {
	pdfView: HTMLIFrameElement,
	pdfWrapper: HTMLDivElement,
	pdfContainer: HTMLDivElement,
}
