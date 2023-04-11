import BasicDialog from './src/basic-dialog.vue';

/* istanbul ignore next */
BasicDialog.install = (Vue) => {
  Vue.component(BasicDialog.name, BasicDialog);
};

export default BasicDialog;
