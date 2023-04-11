export default {
  props: {
    value: { },
    backUpValue: { },
    labelMode: {
      type: Boolean,
      default: false,
    },
    isTriggerDefaultOne: {
      type: Boolean,
      default: true,
    },
    isStorage: {
      type: Boolean,
      default: true,
    },
    formatOptionType: {
      type: String,
      default: '',
      validator(value) {
        return ['', 'string', 'int', 'boolean'].includes(value);
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    disabledOptions: {
      type: Array,
      default: () => [],
    },
    beforeChange: {
      type: Function,
      default: () => true,
    },
    isClearByOptionNull: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    innerValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
  methods: {
    onChange(val) {
      this.$emit('change', val);
    },
    onBlur(event) {
      this.$emit('blur', event);
    },
    onDone(list) {
      this.$emit('done', list);
    },
    triggerDefaultOne() {
      this.$refs.remoteSelect && this.$refs.remoteSelect.triggerDefaultOne();
    },
    getOptionsList() {
      return this.$refs.remoteSelect && this.$refs.remoteSelect.getOptionsList();
    },
  },

};
