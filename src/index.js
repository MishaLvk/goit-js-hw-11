import NewsApiService from './js/components/api-service';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const formSearch = document.querySelector('#search-form');
const galleryContainer = document.querySelector('.gallery');
const buttonMore = document.querySelector('.load-more');
let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});
const newsApiService = new NewsApiService();
let sum = null;

formSearch.addEventListener('submit', searchImage);
buttonMore.addEventListener('click', loadMore);

async function searchImage(evt) {
  evt.preventDefault();
  sum = null;
  if (!buttonMore.classList.contains('is-hiden')) {
    buttonMore.classList.add('is-hiden');
  }
  clearGallery();

  newsApiService.query = evt.currentTarget.elements.searchQuery.value;
  newsApiService.resetPage();
  const fatchArticles = await newsApiService.fatchArticles();

  lightbox.refresh();
  if (!fatchArticles.hits.length == []) {
    renderGallery(fatchArticles);
    Notiflix.Notify.success(
      `Hooray! We found ${fatchArticles.totalHits} images.`
    );
  } else {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
}

async function loadMore() {
  renderGallery(await newsApiService.fatchArticles());
}

function renderGallery(obj) {
  const arr = obj.hits;
  imageCounter(obj);

  if (sum >= obj.totalHits) {
    Notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
    buttonMore.classList.add('is-hiden');
  }
  arr.map(
    ({
      largeImageURL,
      webformatURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => {
      const imgCard = `<div class="photo-card"><a href="${largeImageURL}">
        <div class="image-container"><img class="card-image" src="${webformatURL}" alt="${tags}" loading="lazy" /></div>
        <div class="info">
          <p class="info-item">
            <b>Likes</b> </br><span class>${likes}<span>
          </p>
          <p class="info-item">
            <b>Views</b></br><span class>${views}<span>
          </p>
          <p class="info-item">
            <b>Comments</b></br><span class>${comments}<span>
          </p>
          <p class="info-item">
            <b>Downloads</b></br><span class>${downloads}<span>
          </p>
        </div>
      </a></div>`;
      galleryContainer.insertAdjacentHTML('beforeend', imgCard);

      lightbox.refresh();
    }
  );
  if (arr.length >= newsApiService.per_page && sum < obj.totalHits) {
    buttonMore.classList.remove('is-hiden');
  }
}

function clearGallery() {
  galleryContainer.innerHTML = '';
}

function imageCounter(obj) {
  sum += obj.hits.length;
}
