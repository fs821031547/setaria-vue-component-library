<template>
  <div
    class="remote-select-container"
    :class="{'remote-select-container__append':$slots.append}">
    <!-- filter-method -->
    <template v-if="!labelMode">
      <el-select
        ref="fakeSelect"
        :clearable="clearable"
        :disabled="disabled"
        :multiple="multiple"
        v-bind="$attrs"
        @change="onChange"
        @blur="onBlur"
        @clear="onClear"
        filterable
        v-model="innerValue">

        <el-option
          v-for="(item,index) in options"
          :key="index"
          :label="getLabelInfo(item)"
          :value="item[valueKey]"
          :disabled="getDisabledOption(item[valueKey])" />
      </el-select>
      <div
        v-if="$slots.append"
        class="remote-append">
        <slot name="append"></slot>
      </div>

    </template>
    <template v-else>
      {{ formatVal }}
    </template>
  </div>
</template>
<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'FsscFakeSelect',
  props: {
    value: {},
    labelMode: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    disabledOptions: {
      type: Array,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    labelKey: {
      type: [String, Array],
      default: 'label',
    },
    labelSeparator: {
      type: String,
      default: ' ',
    },
    valueKey: {
      type: String,
      default: 'value',
    },
    data: {
      type: Array,
      default: () => [],
    },
    formatOptionType: {
      type: String,
      default: '',
      validator(value) {
        return ['', 'string', 'int', 'boolean'].includes(value)
      },
    },
    beforeChange: {
      type: Function,
      default: () => true,
    },
  },
  data() {
    return {
    }
  },
  computed: {
    formatVal() {
      let select = null
      if (this.multiple) {
        select = this?.data?.filter(
          (row) => this.value?.includes(row[this.valueKey]),
        )
      } else {
        select = this?.data?.find(
          (row) => this.value === row[this.valueKey],
        )
      }
      if (select) {
        return this.getLabelInfo(select)
      }
      if (this.defaultValue) {
        return this.getLabelInfo(this.defaultValue)
      }
      return ''
    },
    innerValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      },
    },
    options() {
      // -- 填充一个默认值 : 避免url数据变更造成历史数据不能显示的问题
      if (
        this.defaultValue &&
        this.getLabelInfo(this.defaultValue) &&
        (!this.data || this.data.length === 0)
      ) {
        return [this.defaultValue]
      }

      return this.data
    },
  },
  watch: {
  },
  methods: {
    getDisabledOption(val) {
      return !!this.disabledOptions.find((item) => item === val)
    },
    getLabelInfo(labelItem) {
      if (Array.isArray(labelItem)) {
        if (Array.isArray(this.labelKey)) {
          return labelItem.map((item) => this.labelKey.map((key) => this.$t(item[key])).join(this.labelSeparator)).join()
        }
        return labelItem.map((item) => this.$t(item[this.labelKey])).join()
      }
      if (Array.isArray(this.labelKey)) {
        return this.labelKey.map((key) => this.$t(labelItem[key])).join(this.labelSeparator)
      }
      return this.$t(labelItem[this.labelKey])
    },
    // triggerDefaultOne() {
    //   if (this.data.length === 1 && !this.innerValue) {
    //     this.$nextTick(() => {
    //       // console.log('triggerDefaultOne', this.data[0][this.valueKey]);
    //       this.innerValue = this.data[0][this.valueKey];
    //       this.onChange(this.data[0][this.valueKey]);
    //     });
    //   }
    // },
    onChange(chagneItem) {
      const oldValue = this.innerValue

      const successCallback = () => {
        let val = chagneItem
        if (!Array.isArray(chagneItem)) {
          val = [chagneItem]
        }
        this.$emit(
          'change',
          this.data.filter((item) => val.includes(item[this.valueKey])),
        )
        this.$refs.fakeSelect && this.$refs.fakeSelect.blur()
      }
      const errorCallback = () => {
        console.log('errorCallback')
        this.innerValue = oldValue
      }
      const callbak = this.beforeChange(chagneItem, this.innerValue)
      if (callbak.then) {
        callbak
          .then(() => {
            successCallback()
          })
          .catch(() => {
            errorCallback()
          })
      } else if (callbak) {
        successCallback()
      } else {
        errorCallback()
      }
    },
    onBlur(event) {
      this.$emit('blur', event)
    },
    onClear() {
      if (['int', 'boolean'].includes(this.formatOptionType)) {
        this.innerValue = null
      }
      this.$emit('clear')
    },
  },
})
</script>
