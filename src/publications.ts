import { animate, svg } from "animejs";
import publicationsData from "./json/publications.json";
const publications = document.querySelector(".publications") as HTMLDivElement;
const proceedings = document.querySelector(".proceedings") as HTMLDivElement;
const pdfView = document.querySelector("#pdf-view") as HTMLIFrameElement;
const pdfWrapper = document.getElementById("pdf-wrapper")!;
const pdfContainer = document.querySelector("#pdf-container") as HTMLDivElement;
const loadingIndicator = document.querySelector(".pdf-loading-indicator") as HTMLElement;

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

const canvas = document.getElementById("pdf-canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

const renderPDF = async (url: string, scale = 1.0) => {
	const loadingTask = window['pdfjsLib'].getDocument(url);
	const pdf = await loadingTask.promise;

	const totalPages = pdf.numPages;
	let currentPageNum = 1;

	const prevBtn = document.querySelector(".pdf-prev-btn") as HTMLButtonElement;
	const nextBtn = document.querySelector(".pdf-next-btn") as HTMLButtonElement;
	const pageInfo = document.querySelector(".pdf-pages-info") as HTMLSpanElement;
	let currentScale = 1;
	let pdfContainerRect = pdfContainer.getBoundingClientRect();
	let canvasRect = canvas.getBoundingClientRect();

	let isDragging = false;
	let startX = 0;
	let startY = 0;
	let translateX = 0;
	let translateY = 0;

	let isTouch = false;
	let initialDistance = 0;
	let initialScale = 1;
	let touchStartX = 0;
	let touchStartY = 0;

	let leftEdgeX = pdfContainerRect.left - canvasRect.left;
	const isMobile = /iPhone||Android/i.test(navigator.userAgent);
	let startScale = 1;
	const topEdge = 0;

	let currentRenderTask: any = null;
	let isRendering = false;
	prevBtn.disabled = true;

	const renderPage = async (pageNum: number) => {
		try {
			if (currentRenderTask) {
				currentRenderTask.cancel();
				currentRenderTask = null;
			}

			if (isRendering) {
				return;
			}

			isRendering = true;

			ctx?.clearRect(0, 0, canvas.width, canvas.height);
			const page = await pdf.getPage(pageNum);

			let viewport = page.getViewport({ scale: 1 });
			const isComplexPDF = viewport.width > 1500 || viewport.width > viewport.height * 1.3;

			let baseScale: number;
			if (isComplexPDF) {
				baseScale = isMobile ? 0.5 : 1.0;
			} else {
				baseScale = isMobile ? 1.2 : 2.0;
			}
			viewport = page.getViewport({ scale: baseScale });

			const maxCanvasSize = isMobile ? 4096 : 8192;
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
			};
			currentRenderTask = page.render(renderContext);
			await currentRenderTask.promise;
			currentRenderTask = null;

			pageInfo.textContent = `${pageNum} / ${totalPages}`;
			prevBtn.disabled = pageNum === 1;
			nextBtn.disabled = pageNum === totalPages;

			translateX = 0;
			touchStartX = 0;
			translateY = 0;
			touchStartY = 0;
			currentScale = 1;
			requestAnimationFrame(() => {
				canvasRect = canvas.getBoundingClientRect();
				pdfContainerRect = pdfContainer.getBoundingClientRect();
				const scaleToFitWidth = pdfContainerRect.width / canvasRect.width;
				const scaleToFitHeight = pdfContainerRect.height / canvasRect.height;
				startScale = Math.min(scaleToFitWidth, scaleToFitHeight);
				currentScale = startScale;
				leftEdgeX = pdfContainerRect.left - canvasRect.left;
				pdfWrapper.style.transform = `translate(0px, 0px) scale(${currentScale})`;
			});
		}
		catch (error: any) {
			if (error.name === 'RenderingCancelledException') {
				console.log(`Rendering cancelled for page ${pageNum}`);
				return;
			}
			console.error(`Failed to render page ${pageNum}:`, error);
		}
		finally {
			isRendering = false;
			currentRenderTask = null;
			if (loadingIndicator) {
				loadingIndicator.style.display = 'none';
			}
		}
	};

	const getDistance = (touch1: Touch, touch2: Touch) => {
		const dx = touch1.clientX - touch2.clientX;
		const dy = touch1.clientY - touch2.clientY;
		return Math.sqrt(dx * dx + dy * dy);
	};

	const getCenter = (touch1: Touch, touch2: Touch) => {
		return {
			x: (touch1.clientX + touch2.clientX) / 2,
			y: (touch1.clientY + touch2.clientY) / 2
		};
	};

	prevBtn.addEventListener('click', async () => {
		if (currentPageNum == 1) return;
		if (currentRenderTask) {
			currentRenderTask.cancel();
			currentRenderTask = null;
		}
		isRendering = false;
		loadingIndicator.style.display = 'block';

		const carAnimation = animate('.car', {
			ease: 'linear',
			duration: 5000,
			loop: true,
			...svg.createMotionPath('path')
		});

		animate(svg.createDrawable('path'), {
			draw: '0 1',
			ease: 'linear',
			duration: 5000,
			loop: true
		});

		currentPageNum--;

		await renderPage(currentPageNum);
	});

	nextBtn.addEventListener('click', async () => {
		if (currentPageNum >= totalPages) return;
		if (currentRenderTask) {
			currentRenderTask.cancel();
			currentRenderTask = null;
		}
		loadingIndicator.style.display = 'block';
		const carAnimation = animate('.car', {
			ease: 'linear',
			duration: 5000,
			loop: true,
			...svg.createMotionPath('path')
		});

		animate(svg.createDrawable('path'), {
			draw: '0 1',
			ease: 'linear',
			duration: 5000,
			loop: true
		});

		isRendering = false;
		currentPageNum++;
		await renderPage(currentPageNum);
	});

	const keyboardHandler = (e: KeyboardEvent) => {
		if (isRendering) return;

		if (e.key === 'ArrowLeft' && currentPageNum > 1) {
			currentPageNum--;
			renderPage(currentPageNum);
		} else if (e.key === 'ArrowRight' && currentPageNum < totalPages) {
			currentPageNum++;
			renderPage(currentPageNum);
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
		if (currentRenderTask) {
			currentRenderTask.cancel();
			currentRenderTask = null;
		}
		isRendering = false;
		loadingTask.destroy();
		ctx?.clearRect(0, 0, canvas.width, canvas.height);

		document.removeEventListener("wheel", wheelEventHandler);
		document.removeEventListener('keydown', keyboardHandler);
		canvas.innerHTML = "";

		translateX = 0;
		touchStartX = 0;
		translateY = 0;
		touchStartY = 0;
		currentScale = 1;
	});

	pdfView.addEventListener("show.bs.modal", () => {
		translateX = 0;
		touchStartX = 0;
		translateY = 0;
		touchStartY = 0;
		currentScale = 1;
		canvasRect = canvas.getBoundingClientRect();
		pdfContainerRect = pdfContainer.getBoundingClientRect();
		leftEdgeX = pdfContainerRect.left - canvasRect.left;
		pdfWrapper.style.transform = `translate(0px, 0px) scale(1)`;
	});

	canvas.addEventListener("wheel", (e) => {
		if (!e.ctrlKey) return;
		e.stopPropagation();
		e.preventDefault();

		canvasRect = canvas.getBoundingClientRect();
		const offsetX = e.clientX - canvasRect.left;
		const offsetY = e.clientY - canvasRect.top;

		const zoomFactor = 1.1;
		const scaleChange = e.deltaY < 0 ? zoomFactor : 1 / zoomFactor;

		const newScale = Math.min(Math.max(currentScale * scaleChange, startScale), 3);
		if (newScale === currentScale) return;

		const dx = offsetX - (offsetX * newScale / currentScale);
		const dy = offsetY - (offsetY * newScale / currentScale);

		leftEdgeX *= newScale / currentScale;

		if (canvasRect.width > pdfContainerRect.width) {
			translateX = Math.min(Math.max(translateX + dx, leftEdgeX - canvasRect.width + pdfContainerRect.width), leftEdgeX);
		}
		else {
			translateX = Math.max(Math.min(translateX + dx, leftEdgeX - canvasRect.width + pdfContainerRect.width), leftEdgeX);
		}

		if (canvasRect.height > pdfContainerRect.height) {
			translateY = Math.min(Math.max(translateY + dy, topEdge - canvasRect.height + pdfContainerRect.height), 0);
		}
		else {
			translateY = Math.max(Math.min(translateY + dy, topEdge - canvasRect.height + pdfContainerRect.height), 0);
		}

		currentScale = newScale;

		pdfWrapper.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`;
	}, { passive: false });
	canvas.addEventListener("touchstart", (e) => {
		e.preventDefault();
		isTouch = true;

		if (e.touches.length === 1) {
			isDragging = true;
			touchStartX = e.touches[0].clientX;
			touchStartY = e.touches[0].clientY;
		} else if (e.touches.length === 2) {
			isDragging = false;
			initialDistance = getDistance(e.touches[0], e.touches[1]);
			initialScale = currentScale;
		}
	}, { passive: false });

	let touchMoveTimeout: NodeJS.Timeout | null = null;
	canvas.addEventListener("touchmove", (e) => {
		e.preventDefault();
		if (touchMoveTimeout) clearTimeout(touchMoveTimeout);

		touchMoveTimeout = setTimeout(() => {
			if (e.touches.length === 1 && isDragging) {
				canvasRect = canvas.getBoundingClientRect();

				const dx = e.touches[0].clientX - touchStartX;
				const dy = e.touches[0].clientY - touchStartY;

				let newTranslateX: number;
				let newTranslateY: number;

				if (canvasRect.width > pdfContainerRect.width) {
					newTranslateX = Math.min(Math.max(translateX + dx, leftEdgeX - canvasRect.width + pdfContainerRect.width), leftEdgeX);
				}
				else {
					newTranslateX = Math.max(Math.min(translateX + dx, leftEdgeX - canvasRect.width + pdfContainerRect.width), leftEdgeX);
				}

				if (canvasRect.height > pdfContainerRect.height) {
					newTranslateY = Math.min(Math.max(translateY + dy, topEdge - canvasRect.height + pdfContainerRect.height), 0);
				}
				else {
					newTranslateY = Math.max(Math.min(translateY + dy, topEdge - canvasRect.height + pdfContainerRect.height), 0);
				}

				pdfWrapper.style.transform = `translate(${newTranslateX}px, ${newTranslateY}px) scale(${currentScale})`;

			} else if (e.touches.length === 2) {
				const currentDistance = getDistance(e.touches[0], e.touches[1]);
				const scaleChange = currentDistance / initialDistance;
				const newScale = Math.min(Math.max(initialScale * scaleChange, startScale), 3);

				if (newScale === currentScale) return
				canvasRect = canvas.getBoundingClientRect();
				const center = getCenter(e.touches[0], e.touches[1]);
				const offsetX = center.x - canvasRect.left;
				const offsetY = center.y - canvasRect.top;

				const dx = offsetX - (offsetX * newScale / currentScale);
				const dy = offsetY - (offsetY * newScale / currentScale);

				leftEdgeX *= newScale / currentScale;

				if (canvasRect.width > pdfContainerRect.width) {
					translateX = Math.min(Math.max(translateX + dx, leftEdgeX - canvasRect.width + pdfContainerRect.width), leftEdgeX);
				}
				else {
					translateX = Math.max(Math.min(translateX + dx, leftEdgeX - canvasRect.width + pdfContainerRect.width), leftEdgeX);
				}

				if (canvasRect.height > pdfContainerRect.height) {
					translateY = Math.min(Math.max(translateY + dy, topEdge - canvasRect.height + pdfContainerRect.height), 0);
				}
				else {
					translateY = Math.max(Math.min(translateY + dy, topEdge - canvasRect.height + pdfContainerRect.height), 0);
				}

				currentScale = newScale;
				pdfWrapper.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`;
			}
		}, 16);
	}, { passive: false });

	canvas.addEventListener("touchend", (e) => {
		e.preventDefault();

		if (e.touches.length === 0) {
			if (!isDragging) return;
			canvasRect = canvas.getBoundingClientRect();

			if (canvasRect.width > pdfContainerRect.width) {
				translateX = Math.min(Math.max(translateX + (e.changedTouches[0].clientX - touchStartX), leftEdgeX - canvasRect.width + pdfContainerRect.width), leftEdgeX);
			}
			else {
				translateX = Math.max(Math.min(translateX + (e.changedTouches[0].clientX - touchStartX), leftEdgeX - canvasRect.width + pdfContainerRect.width), leftEdgeX);
			}

			if (canvasRect.height > pdfContainerRect.height) {
				translateY = Math.min(Math.max(translateY + (e.changedTouches[0].clientY - touchStartY), topEdge - canvasRect.height + pdfContainerRect.height), 0);
			}
			else {
				translateY = Math.max(Math.min(translateY + (e.changedTouches[0].clientY - touchStartY), topEdge - canvasRect.height + pdfContainerRect.height), 0);
			}

			isDragging = false;
			isTouch = false;
		} else if (e.touches.length === 1) {
			isDragging = true;
			touchStartX = e.touches[0].clientX;
			touchStartY = e.touches[0].clientY;
		}
	}, { passive: false });

	canvas.addEventListener("mousedown", (e) => {
		isDragging = true;
		startX = e.clientX;
		startY = e.clientY;
	});

	window.addEventListener("mousemove", (e) => {
		if (!isDragging) return;
		canvasRect = canvas.getBoundingClientRect();

		const dx = e.clientX - startX;
		const dy = e.clientY - startY;

		let newTranslateX: number;
		let newTranslateY: number;
		if (canvasRect.width > pdfContainerRect.width) {
			newTranslateX = Math.min(Math.max(translateX + dx, leftEdgeX - canvasRect.width + pdfContainerRect.width), leftEdgeX);
		}
		else {
			newTranslateX = Math.max(Math.min(translateX + dx, leftEdgeX - canvasRect.width + pdfContainerRect.width), leftEdgeX);
		}

		if (canvasRect.height > pdfContainerRect.height) {
			newTranslateY = Math.min(Math.max(translateY + dy, topEdge - canvasRect.height + pdfContainerRect.height), 0);
		}
		else {
			newTranslateY = Math.max(Math.min(translateY + dy, topEdge - canvasRect.height + pdfContainerRect.height), 0);
		}

		pdfWrapper.style.transform = `translate(${newTranslateX}px, ${newTranslateY}px) scale(${currentScale})`;
	});

	window.addEventListener("mouseup", (e) => {
		if (!isDragging) return;
		isDragging = false;
		canvasRect = canvas.getBoundingClientRect();

		if (canvasRect.width > pdfContainerRect.width) {
			translateX = Math.min(Math.max(translateX + e.clientX - startX, leftEdgeX - canvasRect.width + pdfContainerRect.width), leftEdgeX);
		}
		else {
			translateX = Math.max(Math.min(translateX + e.clientX - startX, leftEdgeX - canvasRect.width + pdfContainerRect.width), leftEdgeX);
		}

		if (canvasRect.height > pdfContainerRect.height) {
			translateY = Math.min(Math.max(translateY + e.clientY - startY, topEdge - canvasRect.height + pdfContainerRect.height), 0);
		}
		else {
			translateY = Math.max(Math.min(translateY + e.clientY - startY, topEdge - canvasRect.height + pdfContainerRect.height), 0);
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

for (const publication of publicationsData) {
	const div = document.createElement("div") as HTMLDivElement;
	div.className = publication.type;
	div.style.backgroundImage = `url(${publication.asset})`;

	const aspectRatio = publication.width && publication.height
		? publication.width / publication.height
		: 4 / 3;
	div.style.aspectRatio = `${aspectRatio}`;
	div.setAttribute("data-bs-toggle", "modal");
	div.setAttribute("data-bs-target", "#pdf-view");

	div.addEventListener("click", () => {
		renderPDF(publication.pdf, 1.0);
		loadingIndicator.style.display = 'block';

		animate(svg.createDrawable('path'), {
			draw: '0 1',
			ease: 'linear',
			duration: 5000,
			loop: true
		});
		pdfWrapper.style.transform = `scale(1)`;
		canvas.style.display = "block";
	});

	if (publication.type === "publication") {
		publications.appendChild(div);
	} else {
		proceedings.appendChild(div);
	}
}
