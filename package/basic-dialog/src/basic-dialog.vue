<template>
  <el-dialog :title="title"
    :visible.sync="innerVisible"
    :width="width"
    :append-to-body="true"
    :show-close="showClose"
    :fullscreen="fullscreen"
    :custom-class="customClass"
    :close-on-press-escape="closeOnPressEscape"
    :close-on-click-modal="closeOnClickModal"
    :dragable="true"
    :before-close="beforeClose"
    @opened="onOpened"
    @close="onClose"
    @closed="onClosed"
    class="basic-dialog"
    top="5vh">
    <template slot="title"
      v-if="$slots.title">
      <slot name="title"></slot>
    </template>

    <slot></slot>

    <template slot="footer"
      v-if="$slots.footer">
      <slot name="footer"></slot>
    </template>

  </el-dialog>
</template>
<script>
import Vue from 'vue';

export default Vue.extend({
  name: 'FsscBasicDialog',
  props: {
    visible: Boolean,
    title: String,
    width: String,
    showClose: {
      type: Boolean,
      default: true,
    },
    closeOnPressEscape: {
      type: Boolean,
      default: true,
    },
    closeOnClickModal: {
      type: Boolean,
      default: false,
    },
    fullscreen: {
      type: Boolean,
      default: false,
    },
    appendToBody: {
      type: Boolean,
      default: false,
    },
    beforeClose: {
      type: Function,
      default: (done) => {
        done();
      },
    },
    customClass: String,
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
    // innerAppendToBody() {
    //   // 优先使用当前组件的属性
    //   if (this.appendToBody) {
    //     return this.appendToBody;
    //   }
    //   return this.$parent.appendToBody;
    // },
  },
  methods: {
    onOpened() {
      this.$emit('opened');
    },
    onClosed() {
      this.$emit('closed');
    },
    onClose() {
      this.$emit('close');
    },
  },
});
</script>
