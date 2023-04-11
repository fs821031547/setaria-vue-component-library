import _ from 'lodash';
import { Message } from 'setaria';
import Vue from 'vue';
import { isBlank } from '@/util/cain';
import { COMMON_TABLE_PROPS, EDIT_TABLE_PROPS } from '@/constant/table-props';
import SearchPageCondition from './search-page-condition';
import SearchPageResult from './search-page-result';

function getSchemaByKeyArray(schema, arr) {
  const ret = {};
  if (schema && schema.properties && arr.length > 0) {
    arr.forEach((key) => {
      if (typeof key === 'string') {
        if (schema.properties[key] === undefined) {
          console.log('当前使用的Schema为', schema);
          console.error(new Message('SYCOM012E', [key]).getMessage());
        }
        ret[key] = schema.properties[key];
      } else {
        ret[key.key] = key;
      }
    });
  }
  return {
    properties: {
      ...ret,
    },
  };
}

const STORAGE_KEY = 'SearchPageCondition-';

export default Vue.extend({
  name: 'FsscSearchPage',
  components: {
    SearchPageCondition,
    SearchPageResult,
  },
  provide() {
    return {
      srSearchPage: this,
    };
  },
  props: {
    ...COMMON_TABLE_PROPS,
    ...EDIT_TABLE_PROPS,
    /**
     * schema
     */
    schema: {
      type: Object,
      required: true,
    },
    /**
     * 查询条件schema
     */
    conditionSchema: [Object, Array],
    /**
     * 查询条件ui-schema
     */
    conditionUiSchema: Object,
    /**
     * 查询结果schema
     */
    tableSchema: [Object, Array],
    /**
     * 查询结果ui-schema
     */
    tableUiSchema: Object,
    /**
     * 查询条件值
     */
    conditionData: Object,
    /**
     * 查询结果
     */
    tableData: Array,
    /**
     * 操作列渲染函数
     * 返回[ { key: '', label: '' } ]
     */
    rowButtons: Function,
    /**
     * 查询前处理
     */
    beforeRequest: Function,
    /**
     * 是否在组件初始化时执行查询
     */
    isInitialSearch: {
      type: Boolean,
      default: true,
    },
    /**
   * 校验规则
   */
    rules: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    /**
     * 搜索按钮点击时触发，需要返回Promise
     */
    request: Function,
    /**
     * 查询结果页号
     */
    pageNum: Number,
    /**
     * 查询结果当前页显示数据数量
     */
    pageSize: Number,
    /**
     * 查询结果每页数据可选项
     */
    pageSizes: Array,
    /**
     * 查询条件属性
     * { props: {}, attrs: {} }
     */
    conditionAttrs: {
      type: Object,
      default: () => ({ props: {}, attrs: {} }),
    },
    /**
     * 查询结果属性
     * { props: {}, attrs: {} }
     */
    tableAttrs: {
      type: Object,
      default: () => ({ props: {}, attrs: {} }),
    },
    /**
     * 首页列表选择类型
     */
    selectionType: {
      type: String,
      required: false,
      default: null,
      validator(value) {
        return ['radio', 'checkbox', ''].indexOf(value) >= 0;
      },
    },
    /**
     * 是否进行前端分页
     */
    autoPagination: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否显示分页
     */
    showPagination: {
      type: Boolean,
      default: true,
    },
    /**
     * 是否显示搜索卡片
     */
    showConditionCard: {
      type: Boolean,
      default: true,
    },
    canAdd: {
      type: Boolean,
      default: true,
    },
    /** 是否允许修改 默认true */
    canUpdate: {
      type: Boolean,
      default: true,
    },
    /** 是否允许删除 默认true */
    canDelete: {
      type: Boolean,
      default: true,
    },
    // 是否开启只读模式
    labelMode: {
      type: Boolean,
      default: true,
    },
    /**
    * 新增一行按钮点击时的回调函数，用于对新增数据进行默认值设定
    */
    beforeAddRow: Function,
    beforeUpdateRow: Function,
    // 点击对话框的表单保存按钮后执行，可返回Promise或Boolean
    save: Function,
    // 导出按钮点击时触发，需要返回Promise,如果此值为空，则不显示导出按钮
    exportData: Function,
    showControlColumn: {
      type: Boolean,
      default: true,
    },
    // 需要排序的字段
    sortItem: {
      type: Array,
      default: () => ([]),
    },
    storageSearchData: {
      type: Boolean,
      default: false,
    },
    searchTitle: {
      type: String,
      default: null,
    },
    conditionTitle: {
      type: String,
      default: null,
    },
    tableId: {
      type: String,
    },
    storageColumnSetting: {
      type: Boolean,
      default: false,
    },
    // styleType: {
    //   type: String,
    //   default: 'blur',
    // },
    virtualScroll: {
      type: Boolean,
      default: true,
    },
    controlButtonLayout: {
      type: Array,
      default: () => ['search', 'searchReset', 'collapse'],
    },
  },
  data() {
    return {
      innerConditionData: null,
      innerTableData: null,
      currentSearchCondition: null,
      settings: {
        isInitialSearch: this.isInitialSearch,
      },
      isLoading: false,
      innerPageNum: 1,
      innerPageSize: 10,
      innerPageSizes: null,
      innerOrderType: '',
      innerOrderItem: '',
      innerExpand: false,
      innerTotal: 0,
      isInitialed: false,
    };
  },
  computed: {
    showExportArea() {
      return _.isFunction(this.exportData);
    },
    innerSchema() {
      return this.schema;
    },
    innerConditionSchema() {
      const { conditionSchema, schema } = this;
      if (Array.isArray(conditionSchema)) {
        return getSchemaByKeyArray(schema, conditionSchema);
      }
      return conditionSchema;
    },
    innerTableSchema() {
      const {
        innerConditionSchema,
        schema,
        tableSchema,
      } = this;
      if (!_.isEmpty(tableSchema)) {
        if (Array.isArray(tableSchema)) {
          return {
            ...getSchemaByKeyArray(schema, tableSchema),
            ...{ required: schema.required || [] },
          };
        }
        return tableSchema;
      }
      return {
        required: schema.required || [],
        properties: {
          ..._.get(innerConditionSchema, 'properties', {}),
        },
      };
    },
    innerTabelUiSchema() {
      const { conditionUiSchema, advanceUiSchema, tableUiSchema } = this;

      const setSortFun = (uiSchema) => {
        this.sortItem.forEach((key) => {
          if (!uiSchema[key]) {
            uiSchema[key] = {};
          }

          if (!uiSchema[key]['ui:options']) {
            uiSchema[key]['ui:options'] = {};
          }
          uiSchema[key]['ui:options'] = {
            ...uiSchema[key]['ui:options'],
            ...{
              sortable: true,
            },
          };
        });
      };

      if (!_.isEmpty(tableUiSchema)) {
        const uiSchema = _.cloneDeep(tableUiSchema);
        setSortFun(uiSchema);
        return uiSchema;
      }

      const properties = {
        ..._.get(conditionUiSchema, 'properties', {}),
        ..._.get(advanceUiSchema, 'properties', {}),
      };
      setSortFun(properties);
      return properties;
    },
    backendPagination() {
      return !this.autoPagination && this.showPagination;
    },
    innerSortConfig() {
      const defaultSortConfig = {
        remote: true,
      };
      return _.assign({}, defaultSortConfig, this.sortConfig);
    },
    innerTitle() {
      const findItem = this.$store.state.base.currentUserMenuInfo.find((item) => item.url === this.$route.path);
      if (findItem) {
        return findItem?.i18nKey ? this.$t(findItem.i18nKey) : findItem.name;
      }
      return null;
    },
    conditionTitleCom() {
      if (this.conditionTitle) {
        return this.conditionTitle;
      }
      if (this.innerTitle) {
        return this.innerTitle;
      }
      return this.$t('common.condition');
    },
    searchTitleCom() {
      if (this.searchTitle) {
        return this.searchTitle;
      }
      if (!this.showConditionCard && this.innerTitle) {
        return this.innerTitle;
      }
      return this.$t('system.searchResultTitle');
    },
  },
  watch: {
    conditionData: {
      immediate: true,
      deep: true,
      handler(val) {
        this.innerConditionData = val;
      },
    },
    tableData: {
      immediate: true,
      deep: true,
      handler(val) {
        this.innerTableData = val;
      },
    },
    pageNum: {
      immediate: true,
      handler(val) {
        if (_.isNumber(val)) {
          this.innerPageNum = val;
        }
      },
    },
    pageSize: {
      immediate: true,
      handler(val) {
        if (_.isNumber(val)) {
          this.innerPageSize = val;
        }
      },
    },
    pageSizes: {
      immediate: true,
      handler(val) {
        if (_.isArray(val) && !_.isEmpty(val)) {
          this.innerPageSizes = val;
        }
      },
    },
    total: {
      immediate: true,
      handler(val) {
        this.innerTotal = val;
      },
    },
    innerConditionData: {
      deep: true,
      handler(val) {
        this.$emit('update:conditionData', val);
      },
    },
    innerTableData: {
      deep: true,
      handler(val) {
        this.$emit('update:tableData', val);
      },
    },
    innerPageNum(val) {
      this.$emit('update:page-num', val);
    },
    innerPageSize(val) {
      this.$emit('update:page-size', val);
    },
    innerTotal(val) {
      this.$emit('update:total', val);
    },

  },
  methods: {
    /**
     * 取得当前数据
     * @public
     * @returns
     */
    getTableData() {
      return this.innerTableData;
    },
    /**
     * 取得表格实例
     * @public
     * @returns
     */
    getTableRef() {
      return this.$refs.searchResultCardRef.getTableRef();
    },
    /**
     * 执行搜索
     * @public
     * @deprecated
     */
    search(isResetPager = false) {
      this.createSearchCondition();
      if (isResetPager) {
        this.innerPageNum = 1;
        this.innerPageSize = 10;
        this.innerOrderItem = '';
        this.innerOrderType = '';
      }
      return this.fetch();
    },
    reset() {
      this.$emit('clear');
    },

    initStorageSearchData() {
      if (this.storageSearchData && sessionStorage.getItem(`${STORAGE_KEY}${this.$route.path}`)) {
        const parseData = JSON.parse(sessionStorage.getItem(`${STORAGE_KEY}${this.$route.path}`));
        this.innerConditionData = parseData.params;
        this.innerPageNum = parseData.pageNum;
        this.innerPageSize = parseData.pageSize;
        this.innerOrderItem = parseData.orderBy?.[0].name;
        this.innerOrderType = parseData.orderBy?.[0].type;
        this.innerExpand = parseData.expand;
      }
    },
    /**
     * 组件内部搜索函数
     */
    fetch() {
      const {
        backendPagination,
        currentSearchCondition,
        innerPageNum,
        innerPageSize,
        innerOrderType,
        innerOrderItem,
        request,
        writeEnterDetailStorage,
      } = this;
      return new Promise((resolve, reject) => {
        const requestInterface = () => {
          if (request && _.isFunction(request)) {
            this.isLoading = true;
            let params = null;
            // 设置翻页信息
            if (backendPagination) {
              params = {
                params: currentSearchCondition,
                pageSize: innerPageSize,
                pageNum: innerPageNum,
              };
              if (!isBlank(innerOrderType) && !isBlank(innerOrderItem)) {
                params.orderBy = [{ name: innerOrderItem, type: innerOrderType.toUpperCase() }];
              }
              // this.currentSearchCondition.pageNo = innerPageNum;
              // this.currentSearchCondition.pageSize = innerPageSize;
              // if (!isBlank(innerOrderType) && !isBlank(innerOrderItem)) {
              //   this.currentSearchCondition.sortName = innerOrderItem;
              //   this.currentSearchCondition.sortType = innerOrderType;
              // }
            }
            writeEnterDetailStorage(params);
            // 执行请求
            request(params)
              .then((res) => {
                const { data } = res;
                let total = Array.isArray(data) ? data.length : 0;
                if (backendPagination) {
                  total = +data?.total;
                }
                if (_.isArray(data?.list)) {
                  this.innerTableData = [];
                  this.innerTableData = data?.list ?? [];
                  this.innerTotal = total;
                } else {
                  this.innerTableData = [];
                  this.innerTotal = 0;
                }
                this.$nextTick(() => {
                  if (this.$refs.searchResultCardRef) {
                    this.$refs.searchResultCardRef.recalculate(true);
                  }
                  this.$emit('search-success', this.innerTableData);
                });
                resolve();
              })
              .catch((e) => {
                this.isLoading = false;
                this.$emit('search-error', e);
                resolve();
                throw e;
              })
              .finally(() => {
                this.isLoading = false;
              });
          } else {
            reject(new Error('未指定request参数'));
          }
        };
        if (this.$refs.searchConditionCardRef) {
          this.$refs.searchConditionCardRef.validate((conditionValidate) => {
            if (conditionValidate) {
              requestInterface();
            } else {
              reject(new Error(this.$t('common.inputRequiredFirst')));
            }
          });
        } else {
          requestInterface();
        }
      });
    },
    triggerExport() {
      return new Promise((resolve, reject) => {
        const requestInterface = () => {
          const {
            exportData,
          } = this;

          if (exportData && _.isFunction(exportData)) {
            this.isLoading = true;
            this.createSearchCondition();
            // 执行请求
            exportData(this.currentSearchCondition)
              .then((res) => {
                this.$emit('export-success', res);
                resolve();
              })
              .catch((e) => {
                this.$emit('export-error', e);
                resolve();
                throw e;
              })
              .finally(() => {
                this.isLoading = false;
              });
          } else {
            reject(new Error('未指定exportData参数'));
            // reject(new Error(this.$t('ExportData_Parameter_Not_Specified')));
          }
        };

        if (this.$refs.searchConditionCardRef) {
          this.$refs.searchConditionCardRef.validate((conditionValidate) => {
            if (conditionValidate) {
              requestInterface();
            } else {
              reject(new Error(this.$t('common.inputRequiredFirst')));
            }
          });
        } else {
          requestInterface();
        }
      });
    },
    onRowButtonClick(key, scope) {
      this.$emit('row-button-click', key, scope);
    },
    writeEnterDetailStorage(data) {
      if (this.storageSearchData) {
        data.expand = this.innerExpand;
        sessionStorage.setItem(`${STORAGE_KEY}${this.$route.path}`, JSON.stringify(data));
      }
    },
    onClear(key) {
      this.$emit('clear', key);
      this.$nextTick(() => {
        this.search();
      });
    },
    setSelection(data, checked = true) {
      this.$refs.searchResultCardRef.setSelection(data, checked);
    },
    setAllCheckboxRow(checked = true) {
      this.$refs.searchResultCardRef.setAllCheckboxRow(checked);
    },
    handleSelectionChange(val) {
      this.$emit('selection-change', val);
    },
    getCheckboxRecords() {
      return this.$refs.searchResultCardRef.getCheckboxRecords();
    },
    clearCheckboxRow() {
      return this.$refs.searchResultCardRef.clearCheckboxRow();
    },
    getRadioRecord(isFull) {
      return this.$refs.searchResultCardRef.getRadioRecord(isFull);
    },
    clearRadioRow() {
      return this.$refs.searchResultCardRef.clearRadioRow();
    },
    createSearchCondition() {
      const {
        beforeRequest,
        innerConditionData,
      } = this;
      let params = _.cloneDeep(innerConditionData);
      if (typeof beforeRequest === 'function') {
        params = beforeRequest(params);
      }
      this.currentSearchCondition = params;
    },
    afterSubmit() {
      this.innerPageNum = 1;
      this.clearCheckboxRow();
      this.handleSelectionChange([]);
      this.createSearchCondition();
      return this.fetch();
    },
    onPageChange(val) {
      const { currentPage, pageSize } = val;
      this.innerPageNum = currentPage;
      this.innerPageSize = pageSize;
      this.$emit('page-change', val);
      this.search();
    },
    onConditionChange(key, value, model) {
      this.$emit('condition-change', key, value, model);
    },
    onSortChange(val) {
      this.innerOrderType = val.order;
      this.innerOrderItem = val.property;
      this.$emit('sort-change', this.innerTableData, val);
      // 如果为接口排序时则重置pageSize和请求操作
      if (this.innerSortConfig.remote) {
        this.innerPageNum = 1;
        this.search();
      }
    },
    onCellDblclick(val) {
      this.$emit('cell-dblclick', val);
    },
    onDialogOpen(val) {
      this.$emit('dialog-open', val);
    },
    onDialogClose(val) {
      this.$emit('dialog-close', val);
    },
    onFormExpand(val) {
      this.innerExpand = val;
    },
  },
  mounted() {
    if (!this.isInitialed) {
      this.initStorageSearchData();
      if (this.settings.isInitialSearch) {
        this.createSearchCondition();
        this.fetch();
      }
    }
    if (!this.isInitialed) {
      this.isInitialed = true;
    }
  },
  render() {
    const {
      $slots,
      $scopedSlots,
      innerConditionSchema,
      conditionUiSchema,
      schema,
      afterSubmit,
      settings,
      selectionType,
      isInitialSearch,
      innerTableSchema,
      innerTabelUiSchema,
      innerConditionData,
      innerPageNum,
      innerPageSize,
      innerPageSizes,
      innerTableData,
      isLoading,
      innerTotal,
      rowButtons,
      onRowButtonClick,
      handleSelectionChange,
      onClear,
      onPageChange,
      onDialogOpen,
      onCellDblclick,
      onConditionChange,
      onSortChange,
      onDialogClose,
      showConditionCard,
      tableAttrs,
      maxHeight,
      canAdd,
      canUpdate,
      canDelete,
      canUpdateRow,
      canDeleteRow,
      showFooter,
      footerMethod,
      labelMode,
      beforeAddRow,
      beforeUpdateRow,
      save,
      showExportArea,
      triggerExport,
      showControlColumn,
      innerSortConfig,
      columnWidth,
      controlColumnWidth,
      rules,
      searchTitleCom,
      conditionTitleCom,
      showPagination,
      showOverflow,
      tableId,
      storageColumnSetting,
      checkboxConfig,
      radioConfig,
      forceEditOnRow,
      isReserve,
      rowKey,
      // styleType,
      virtualScroll,
      tableSchema,
      onFormExpand,
      innerExpand,
      showColumnSetting,
      controlButtonLayout,
      maxEditOnRow,
    } = this;
    const $t = this.$t.bind(this);
    settings.isInitialSearch = isInitialSearch;
    if (_.isEmpty(schema)) {
      // TODO 加载中提示
      return null;
    }

    const inputEvent = (val) => {
      this.innerConditionData = val;
    };

    const cls = ['fssc-search-page'];
    // console.log(tableAttrs);
    return (
      <div class={cls}>

        {showConditionCard ? (
          <search-page-condition
          ref="searchConditionCardRef"
            advance-schema={innerConditionSchema}
            advance-ui-schema={conditionUiSchema}
            value={innerConditionData}
            after-submit={afterSubmit}
            scopedSlots={$scopedSlots}
            expand={innerExpand}
            title={conditionTitleCom}
            control-button-layout={controlButtonLayout}
            on-clear={onClear}
            on-input={inputEvent}
            on-change={onConditionChange}
            on-expandChange={onFormExpand}
          />
        ) : null}
        {/*
               */}
        <search-page-result
          ref="searchResultCardRef"
          {...tableAttrs}
          schema={innerTableSchema}
          table-schema={tableSchema}
          ui-schema={innerTabelUiSchema}
          selection-type={selectionType}
          rules={rules}
          total={innerTotal}
          page-num={innerPageNum}
          page-size={innerPageSize}
          page-sizes={innerPageSizes}
          data={innerTableData}
          loading={isLoading}
          tree-config={tableAttrs.attrs.treeConfig} // 补偿参数丢失问题
          scopedSlots={$scopedSlots}
          row-buttons={rowButtons}
          selectionChange={handleSelectionChange}
          on-page-change={onPageChange}
          on-dialog-open={onDialogOpen}
          on-dialog-close={onDialogClose}
          on-row-button-click={onRowButtonClick}
          on-sort-change={onSortChange}
          on-cell-dblclick={onCellDblclick}
          label-mode={labelMode}
          before-add-row={beforeAddRow}
          before-update-row={beforeUpdateRow}
          sort-config={innerSortConfig}
          max-height={maxHeight}
          save={save}
          can-add={canAdd}
          can-update={canUpdate}
          can-delete={canDelete}
          can-update-row={canUpdateRow}
          can-delete-row={canDeleteRow}
          column-width={columnWidth}
          control-column-width={controlColumnWidth}
          show-footer={showFooter}
          footer-method={footerMethod}
          show-control-column={showControlColumn}
          show-column-setting={showColumnSetting}
          show-pagination={showPagination}
          title={searchTitleCom}
          show-overflow={showOverflow}
          table-id={tableId}
          storage-column-setting={storageColumnSetting}
          checkbox-config={checkboxConfig}
          radio-config={radioConfig}
          force-edit-on-row={forceEditOnRow}
          is-reserve={isReserve}
          row-key={rowKey}
          max-edit-on-row={maxEditOnRow}
          virtual-scroll={virtualScroll}
        >
          {$slots.create ? <template slot="create">{$slots.create}</template> : null}
          {<template slot="batchControl">
            {$slots.batchControl ? $slots.batchControl : null}
            {showExportArea ? (
              <el-button
              type="text"
              class="export-btn"
              on-click={triggerExport}>{$t('common.export')}</el-button>
            ) : null}
          </template>}
        </search-page-result>
      </div>
    );
  },
});
