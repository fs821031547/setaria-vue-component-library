import FakeSelect from './src/fake-select.vue';

/* istanbul ignore next */
FakeSelect.install = function install(Vue) {
  Vue.component(FakeSelect.options.name, FakeSelect);
};

export default FakeSelect;
