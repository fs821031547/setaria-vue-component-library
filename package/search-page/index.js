import SearchPage from './src/search-page';

/* istanbul ignore next */
SearchPage.install = function install(Vue) {
  Vue.component(SearchPage.options.name, SearchPage);
};

export default SearchPage;
