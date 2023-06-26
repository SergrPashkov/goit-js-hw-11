export default function galleryMarkup(data) {
  return data
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `
        <div class="photo-card">
          <a class="photo-card-link" href="${largeImageURL}">
            <img class='photo-card-image' src="${webformatURL}" alt="${tags}" loading="lazy" />
          </a>
            <div class="info">
              <p class="info-item info-item1">
                <b>Likes: <br>  </b><span>${likes}</span>
              </p>
              <p class="info-item">
                <b>Views: <br></b><span>${views}</span>
              </p>
              <p class="info-item">
                <b>Comments: <br></b><span>${comments}</span>
              </p>
              <p class="info-item">
                <b>Downloads: <br></b><span>${downloads}</span>
              </p>
            </div>
          </div>
        `
    )
    .join('');
}