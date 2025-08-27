import "./toolbar.ts"
import publicationsData from "./json/publications.json";
import { GlobalWorkerOptions } from "pdfjs-dist";
import { canvasMouseZoom, canvasTouchStart, pdfNextPage, pdfPrevPage } from "./publications/events.ts";
import { Globals } from "./publications/globals.ts";
import { initialPdfSettings, renderPDF } from "./publications/pdf-render.ts";
import { startLoadingAnimation } from "./publications/animations.ts";
const publications = document.querySelector(".publications") as HTMLDivElement;
const proceedings = document.querySelector(".proceedings") as HTMLDivElement;

GlobalWorkerOptions.workerSrc = `/assets/other/pdf.worker.mjs`;

Globals.renderHTMLElements.pdfView.addEventListener("show.bs.modal", initialPdfSettings);

Globals.canvas.addEventListener("wheel", canvasMouseZoom, { passive: false });
Globals.canvas.addEventListener("touchstart", canvasTouchStart, { passive: false });

Globals.pdfNavigationProps.prevBtn.addEventListener('click', pdfPrevPage);
Globals.pdfNavigationProps.nextBtn.addEventListener('click', pdfNextPage);

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
		startLoadingAnimation(document.querySelector("#loading-icon path")!)

		Globals.renderHTMLElements.pdfWrapper.style.transform = `scale(1)`;
		Globals.canvas.style.display = "block";
	});

	if (publication.type === "publication") {
		publications.appendChild(div);
	} else {
		proceedings.appendChild(div);
	}
});
