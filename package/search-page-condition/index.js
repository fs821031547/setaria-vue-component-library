import SearchPageCondition from '../search-page/src/search-page-condition';

/* istanbul ignore next */
SearchPageCondition.install = function install(Vue) {
  Vue.component(SearchPageCondition.options.name, SearchPageCondition);
};

export default SearchPageCondition;
