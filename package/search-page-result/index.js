import SearchPageResult from '../search-page/src/search-page-result';

/* istanbul ignore next */
SearchPageResult.install = function install(Vue) {
  Vue.component(SearchPageResult.options.name, SearchPageResult);
};

export default SearchPageResult;
