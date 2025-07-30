import type { PDFDocumentLoadingTask, PDFDocumentProxy, RenderTask } from 'pdfjs-dist';

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

