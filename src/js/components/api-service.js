const axios = require('axios');

export default class NewsApiService {
  constructor() {
    this.KEY = '30074653-21ce3b3057d55da5e0a16da3c';
    this.searchQuery = '';
    this.page = 1;
    this.image_type = 'photo';
    this.orientation = 'horizontal';
    this.safesearch = true;
    this.per_page = 40;
  }

  async fatchArticles(opt) {
    try {
      const response = await axios.get(
        `https://pixabay.com/api/?key=${this.KEY}&q=${this.searchQuery}&image_type=${this.image_type}&orientation=${this.orientation}&safesearch=${this.safesearch}&per_page=${this.per_page}&page=${this.page}`
      );
      this.page += 1;
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    return (this.searchQuery = newQuery);
  }
}
