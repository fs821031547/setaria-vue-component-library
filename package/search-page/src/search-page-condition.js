import _ from 'lodash';
import Vue from 'vue';

const SLOT_PREFIX = 'condition.';

export default Vue.extend({
  name: 'FsscSearchPageCondition',
  props: {
    value: null,
    normalSchema: Object,
    normalUiSchema: Object,
    advanceSchema: Object,
    advanceUiSchema: Object,
    afterSubmit: Function,
    expand: Boolean,
    title: String,
    controlButtonLayout: {
      type: Array,
      default: () => ['search', 'searchReset', 'collapse'],
    },
  },
  data() {
    return {
      innerValue: null,
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.innerValue = val || {};
      },
    },
    innerValue(val) {
      this.$emit('input', val);
    },
  },
  methods: {
    validate(callback) {
      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.validate(callback);
      });
    },
    innerAfterSubmit() {
      return this.afterSubmit();
    },
    onClear(key) {
      this.$emit('clear', key);
    },
    onChange(key, value, model) {
      this.$emit('change', key, value, model);
    },
    onExpand(value) {
      this.$emit('expandChange', value);
    },
    onSubmit(event) {
      // 阻止表单的默认提交行为
      if (event) {
        if (event.stopPropagation) {
          event.stopPropagation();
        }
        if (event.preventDefault) {
          event.preventDefault();
        }
      }
    },
  },
  render() {
    const {
      $scopedSlots,
      normalSchema,
      advanceSchema,
      advanceUiSchema,
      expand,
      innerValue,
      innerAfterSubmit,
      title,
      controlButtonLayout,
      onClear,
      onChange,
      onSubmit,
      onExpand,

    } = this;
    const scopedSlots = {};
    // 设置默认值
    if (normalSchema && _.isEmpty(normalSchema)) {
      normalSchema.properties = {};
    }
    if (advanceSchema && _.isEmpty(advanceSchema)) {
      advanceSchema.properties = {};
    }
    if (!_.isEmpty($scopedSlots)) {
      Object.keys($scopedSlots).forEach((key) => {
        if (key.indexOf(SLOT_PREFIX) === 0) {
          const targetKey = key.replace(SLOT_PREFIX, '');
          scopedSlots[targetKey] = $scopedSlots[key];
        }
      });
      // 自定义按钮插槽
      if ($scopedSlots.conditionControlButtons) {
        scopedSlots.controlButtons = $scopedSlots.conditionControlButtons;
      }
    }
    const onInput = (val) => {
      this.innerValue = val;
    };
    const componentAttrs = {
      props: {
        model: innerValue,
      },
    };
    // const controlButtonLayout = ['collapse', 'search', 'searchReset'];
    return (
      // backdrop-filter: blur(5px);
      // control-button-layout={controlButtonLayout}
      <el-card class="fssc-search-condition-card" header={title}>
        <el-pro-form
          { ...componentAttrs }
          ref="form"
          type="queryFilter"
          label-position="top"
          label-suffix=":"
          control-button-layout={controlButtonLayout}
          columns={3}
          expand={expand}
          schema={advanceSchema}
          ui-schema={advanceUiSchema}
          after-submit={innerAfterSubmit}
          scopedSlots={scopedSlots}
          on-input={onInput}
          on-clear={onClear}
          on-change={onChange}
          on-expandChange={onExpand}
          nativeOnSubmit={onSubmit}
        ></el-pro-form>
      </el-card>
    );
  },
});
