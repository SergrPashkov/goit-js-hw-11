import refs from './js/refs';
import galleryMarkup from './js/markup';
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix';

refs.searchForm.addEventListener('submit', handlerForm);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

let page_n = 1;
let photoSearchApi;
let openPage = 1;
let loadHitsPhoto = 0;
let totalHitsPhoto = 0;


async function handlerForm(e){
	e.preventDefault();
	page_n = 1;
	nameSearch = e.target.searchQuery.value.trim();
	photoSearchApi = await photoSearch(nameSearch, page_n);
	let {hits, totalHits} = photoSearchApi;
	totalHitsPhoto = totalHits;
	const photoSearchApiArrey = photoSearchApi.hits;

	if (photoSearchApiArrey.length === 0) {
		Notify.failure("Sorry, there are no images matching your search query. Please try again.");
		refs.container.innerHTML = '';
		document.querySelector('.load-more').classList.add('none');
		return;
	} else {
		loadHitsPhoto = hits.length
		openPage = hits.length;
		if (openPage < totalHits) {
			openPage += hits.length;
			imgup = await galleryMarkup(photoSearchApiArrey);
			refs.container.innerHTML = imgup;
			document.querySelector('.load-more').classList.remove('none');

			const lightbox = new SimpleLightbox('.photo-card a', {
				captionsData: 'alt',
				captionDelay: 250,
			});

			lightbox.refresh();
		} else {
			document.querySelector('.load-more').classList.remove('none');
		}
		Notify.success(`Hooray! We found ${totalHits} images.`)
		document.querySelector('.load-more').classList.remove('none');
			if (totalHits > 150) {
				refs.loadMoreBtn.classList.remove('isHidden');
			} 
		};
};

async function photoSearch(search, page_n) {
	try {
		const BASE_URL = 'https://pixabay.com';
		const API_KEY = '36275502-77fa3c8ce0cd0de5f36c14358';
		const resp = await fetch(`${BASE_URL}/api/?key=${API_KEY}&q=${search}&image_type=photo&orientation=horizontal&safesearch=true&per_page=150&page=${page_n}`)
		if (!resp.ok) {
			throw new Error(resp.statusText)
		}
		const data = resp.json(); 
		return data;
	} catch (e) {
		Notify.failure(`${error.message}`);
	}
}

async function loadNextPage() {
	try {
		if (openPage < totalHitsPhoto) {
			openPage += loadHitsPhoto;
			page_n += 1;
			photoSearchApi = await photoSearch(nameSearch, page_n);
		const photoSearchApiArrey = photoSearchApi.hits;
		imgup = await galleryMarkup(photoSearchApiArrey);
		refs.container.insertAdjacentHTML('beforeend', imgup);
		observer.observe(refs.loadMoreBtn);

		const lightbox = new SimpleLightbox('.photo-card a', {
			captionsData: 'alt',
			captionDelay: 250,
		});
		
		lightbox.refresh();
		} else {
		document.querySelector('.load-more').classList.add('none');
	}
	} catch (error) {
	Notify.failure(`${error.message}`);
	}
}

async function onScrollLoad(entries, _) {
	entries.forEach(entry => {  
	if (entry.isIntersecting) {
		return loadNextPage();
	}
	});
}

let options = {
	root: null,
	rootMargin: "300px",
	threshold: 1.0,
}

let observer = new IntersectionObserver(onScrollLoad, options);

async function onLoadMore() {
	return loadNextPage();
}
