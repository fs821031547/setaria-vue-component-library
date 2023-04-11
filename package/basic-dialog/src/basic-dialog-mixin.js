export default {
  props: {
    // 是否显示对话框
    visible: Boolean,
    // 在Dialog打开时是否自动根据默认查询条件进行查询操作
    autoSearch: {
      type: Boolean,
      default: true,
    },
    appendToBody: {
      type: Boolean,
      default: false,
    },
    // nullValue: {
    //   // 返回空值的显示与隐藏
    //   type: Boolean,
    //   default: false,
    // },
    selectionType: {
      // 选取类型
      type: String,
      default: 'radio',
      validator(value) {
        return ['radio', 'checkbox'].indexOf(value) >= 0;
      },
    },
    // showClose: {
    //   // 是否显示关闭按钮
    //   type: Boolean,
    //   default: true,
    // },
    // closeOnPressEscape: {
    //   // 是否可以通过按下 ESC 关闭 Dialog
    //   type: Boolean,
    //   default: true,
    // },
    closeOnClickModal: {
      // 是否可以通过点击 modal 关闭 Dialog
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
    };
  },
  computed: {
    innerVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      },
    },
  },
};
