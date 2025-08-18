const diamondDiv = document.querySelector(".diamond") as HTMLDivElement;
const goldDiv = document.querySelector(".gold") as HTMLDivElement;
const silverDiv = document.querySelector(".silver") as HTMLDivElement;

import partnersData from "./json/partners.json";
const modalBody = document.querySelector(".modal-body") as HTMLDivElement;
const modalHeader = document.querySelector(".modal-header") as HTMLDivElement;

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

/* {
  "name": "DEWESoft",
  "grade": "silver",
  "info": "<p><b>Dewesoft</b> je globalno vodilni proizvajalec inovativnih rešitev za zajem in analizo podatkov, ki svoje produkte in storitve razvija in proizvaja v Sloveniji. Naše merilne rešitve uporabljajo največja svetovna podjetja iz avtomobilske, vesoljske, energetike in raziskovalnih institucij, kot so NASA, Tesla, ESA, Boeing, Daimler in številni drugi. S tehnologijo, ki postavlja nove standarde na področju testiranja in meritev, smo prisotni v več kot 50 državah sveta.</p><p>Naši produkti omogočajo uporabnikom natančen zajem in obdelavo signalov, testiranje kompleksnih sistemov ter izboljšanje kakovosti in varnosti njihovih izdelkov. Ponosni smo na dejstvo, da vse ključne komponente razvijamo sami – od strojne opreme do programske opreme – in s tem zagotavljamo vrhunsko kakovost, zanesljivost in uporabniško izkušnjo.</p><p>Dewesoft je hitro rastoče, tehnološko napredno podjetje, ki združuje več kot 400 sodelavcev po svetu, od tega več kot 200 v Sloveniji. Naši inženirji prihajajo iz področij elektrotehnike, računalništva, informatike, strojništva in sorodnih znanosti, ter aktivno sodelujejo z univerzami in raziskovalnimi institucijami doma in v tujini.</p><p>Kot podjetje, ki daje velik poudarek na inovacije in trajnostni razvoj, izvajamo številne raziskovalno-razvojne projekte, sofinancirane tudi s strani EU, in se povezujemo z mednarodnimi partnerji na področju novih tehnologij za pametno merjenje, vesoljske aplikacije in prihodnost mobilnosti.</p><p>Poleg tehnološke odličnosti gradimo tudi prijetno in spodbudno delovno okolje. Sodelavcem ponujamo priložnosti za osebni in strokovni razvoj, mentorstvo, fleksibilne oblike dela ter vključevanje v mednarodne projekte. Skrbimo tudi za dobro počutje z različnimi športnimi aktivnostmi, dogodki, zdravo prehrano in številnimi družabnimi srečanji.</p><p>Če te zanima delo v visoko tehnološkem podjetju z globalnim vplivom, ki svoje korenine ohranja v Sloveniji, te vabimo, da se nam pridružiš.</p><p>Za več informacij obišči našo <a href='https://dewesoft.com/'>www.dewesoft.com</a> ali pa nam piši na naš <a href='mailto:careers@dewesoft.com'>careers@dewesoft.com</a>",
  "asset": "/assets/partners/dewesoft_logo1.png",
  "asset_modal": "/assets/partners/dewesoft_logo2.png"
}, */



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

for (const partnerData of partnersData) {
	const img = document.createElement('img');
	img.className = "partner";
	img.src = partnerData.asset;
	img.setAttribute("data-bs-toggle", "modal");
	img.setAttribute("data-bs-target", "#sponsor-info");

	img.addEventListener("click", () => {
		modalBody.innerHTML = partnerData.info;
		modalHeader.style.backgroundImage = `linear-gradient(var(--dark-blue), var(--dark-blue)), url(${partnerData?.asset_modal ?? partnerData.asset})`;
		modalHeader.style.backgroundRepeat = "no-repeat";
		modalHeader.style.backgroundSize = "contain";
	});

	switch (partnerData.grade) {
		case "diamond": {
			img.style.borderColor = "var(--light-blue)"
			diamondDiv.appendChild(img);
			break;
		}
		case "gold": {
			img.style.borderColor = "#d4af37"
			goldDiv.appendChild(img);
			break;
		}
		default: {
			img.style.borderColor = "#c0c0c0"
			silverDiv.appendChild(img);
			break;
		}
	}
}
