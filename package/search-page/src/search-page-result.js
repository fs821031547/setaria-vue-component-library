import _ from 'lodash';
import Vue from 'vue';
import { COMMON_TABLE_PROPS, EDIT_TABLE_PROPS } from '@/constant/table-props';

const SLOT_PREFIX = 'table.';

const STORAGE_COLUMN_PREFIX = 'STORAGE_COLUMN';

export default Vue.extend({
  name: 'FsscSearchPageResult',
  props: {
    ...EDIT_TABLE_PROPS,
    ...COMMON_TABLE_PROPS,
    value: null,
    data: null,
    total: null,
    loading: Boolean,
    treeNode: String,
    // 是否开启行多选功能
    // multipleSelection: Boolean,
    selectionChange: Function,
    isTree: {
      type: Boolean,
      required: false,
      default: false,
    },
    selectable: Function,
    // 搜索结果卡片标题
    title: {
      type: String,
      // default: '搜索结果',
      default() {
        return this.$t('system.searchResultTitle');
      },
    },
    autoPagination: Boolean,
    // 是否开启只读模式
    labelMode: {
      type: Boolean,
      default: true,
    },
    tableId: {
      type: String,
    },
    storageColumnSetting: {
      type: Boolean,
      default: false,
    },
    virtualScroll: {
      type: Boolean,
      default: true,
    },
    tableSchema: [Object, Array],
  },
  data() {
    return {
      operType: null,
      innerValue: [],
      multipleDataSelection: [],
      visibleColumnKeys: [],
      dialogStatus: false,
    };
  },
  computed: {
    innerFormAttrs() {
      return {
        ...{
          'label-position': 'top',
        },
      };
    },
    innerDialogAttrs() {
      let title = this.$t('common.edit');
      if (this.operType === 'add') {
        title = this.$t('common.add');
      }
      return {
        ...{
          // title: '编辑',
          title,
          appendToBody: true,
          width: '80%',
        },
      };
    },
    innerSchema() {
      const { schema = {} } = this;
      if (_.isEmpty(schema.properties)) {
        return schema;
      }
      // if (typeof getRowButtonList === 'function' || this.$scopedSlots[ROW_CONTROL]) {
      //   schema.properties[ROW_CONTROL] = {
      //     title: '操作',
      //   };
      // }
      return schema;
    },
    tableAttrs() {
      return {
        attrs: this.$attrs,
      };
    },
    storageColumnKey() {
      const userInfo = this.$getUserInfo();
      return [STORAGE_COLUMN_PREFIX, this.$route.path, userInfo.userNum || '', this.tableId].join('_');
    },
    innerUiSchema() {
      const res = {};

      // const changeFormItemVisible = (operItem) => {
      //   if (this.dialogStatus) {
      //     Object.keys(this?.innerSchema?.properties ?? {}).forEach((key) => {
      //       const mergeItem = {};
      //       if (typeof this.uiSchema?.[key]?.['ui:formItemHidden'] === 'boolean') {
      //         mergeItem['ui:innerHidden'] = this.uiSchema[key]['ui:hidden'] === undefined ? false : this.uiSchema[key]['ui:hidden'];
      //         mergeItem['ui:hidden'] = this.uiSchema[key]['ui:formItemHidden'];
      //       }
      //       operItem[key] = _.merge(
      //         this.uiSchema[key],
      //         mergeItem,
      //       );
      //     });
      //   } else {
      //     Object.keys(this?.innerSchema?.properties ?? {}).forEach((key) => {
      //       const mergeItem = {};
      //       if (typeof this.uiSchema?.[key]?.['ui:formItemHidden'] === 'boolean') {
      //         mergeItem['ui:hidden'] = this.uiSchema[key]['ui:innerHidden'];
      //       }
      //       operItem[key] = _.merge(
      //         this.uiSchema[key],
      //         mergeItem,
      //       );
      //     });
      //   }
      //   return operItem;
      // };
      // 处理表格右上角的列控制器内容
      // if (this.visibleColumnKeys.length) {
      //   Object.keys(this?.innerSchema?.properties ?? {}).forEach((key) => {
      //     res[key] = _.merge(
      //       {
      //         'ui:options': {
      //           visible: this.visibleColumnKeys.includes(key),
      //         },
      //       },
      //       this.uiSchema[key],
      //     );
      //   });
      //   return changeFormItemVisible(res);
      // }

      // return changeFormItemVisible(this.uiSchema);
      if (this.visibleColumnKeys.length) {
        Object.keys(this?.innerSchema?.properties ?? {}).forEach((key) => {
          res[key] = _.merge(
            {
              'ui:options': {
                visible: this.visibleColumnKeys.includes(key),
              },
            },
            this.uiSchema[key],
          );
        });
        return res;
      }

      return this.uiSchema;
    },
  },
  methods: {
    /**
     * 取得表格实例
     * @public
     * @returns
     */
    getTableRef() {
      return this.$refs.proTable;
    },
    getXTableRef() {
      return this.getTableRef().getTableRef();
    },
    handleSelectionChange(val) {
      this.multipleDataSelection = val;

      const { selectionChange } = this;
      if (selectionChange && (typeof selectionChange === 'function')) {
        selectionChange(val);
      }
    },
    setSelection(data, checked = true) {
      return this.getTableRef().setSelection(data, checked);
    },
    onRowButtonClick(key, scope) {
      this.$emit('row-button-click', key, scope);
      // return () => {
      //   this.$emit('row-button-click', key, scope);
      // };
    },
    setAllCheckboxRow(checked = true) {
      this.getTableRef().setFullCheckboxRow(checked);
    },
    getCheckboxRecords() {
      return this.getTableRef().getCheckboxRecords();
    },
    clearCheckboxRow() {
      return this.getTableRef().clearCheckboxRow();
    },
    getRadioRecord(isFull) {
      return this.getXTableRef().getRadioRecord(isFull);
    },
    clearRadioRow() {
      return this.getXTableRef().clearRadioRow();
    },
    onPageChange(val) {
      this.$emit('page-change', val);
    },
    recalculate(refull) {
      this.getTableRef().recalculate(refull);
    },
    onCurrentChange(val) {
      this.$emit('current-change', val);
    },
    onSortChange(val) {
      this.$emit('sort-change', val);
    },
    onCellDblclick(val) {
      this.$emit('cell-dblclick', val);
    },
    onDialogOpen(val) {
      this.dialogStatus = true;
      this.$emit('dialog-open', val);
    },
    onDialogClose(val) {
      this.dialogStatus = false;
      this.$emit('dialog-close', val);
    },
    onCellLinkClick() {
      if (this.getTableRef()) {
        // 搜索页面为keep-alive且点击表格行中按钮文字超过当前列的宽度，通过tooltip显示的场合，页面跳转后，tooltip不消失
        this.getTableRef().getTableActionRef().closeTooltip();
      }
    },
    beforeAddRowProxy() {
      this.operType = 'add';
      return this.beforeAddRow && this.beforeAddRow();
    },
    beforeUpdateRowProxy(item) {
      this.operType = 'update';
      return this.beforeUpdateRow && this.beforeUpdateRow(item);
    },
    async validate(key) {
      const result = await this.getTableRef().validate(true).catch((err) => err);
      if (_.isEmpty(result)) {
        return {
          key,
          valid: true,
        };
      }

      const { schema } = this;
      const errorObj = {};
      Object.values(result).forEach((errList) => {
        errList.forEach((params) => {
          const { column, rules } = params;
          rules.forEach((rule) => {
            const { title } = schema.properties[column.property];
            errorObj[column.property] = [
              {
                field: column.property,
                message: rule.message,
                title: title || column.property,
              },
            ];
          });
        });
      });
      return {
        key,
        valid: false,
        errorObj,
      };
    },
    onColumnVisibleChange(keys) {
      // if (this.storageColumnSetting && this.tableId) {
      //   this.visibleColumnKeys = keys;
      //   // 缓存设置
      //   localStorage.setItem(this.storageColumnKey, JSON.stringify(keys));
      //   // 接口设置
      //   this.$api.base.post('/tables/save', {
      //     keyList: keys.join(),
      //     tableId: this.storageColumnKey,
      //   });
      // }
    },
    onColumnVisibleReset() {
      // this.visibleColumnKeys = Object.keys(this.innerSchema?.properties ?? {});
      // this.onColumnVisibleChange(this.visibleColumnKeys);
    },
    initStorageColumn() {
      // if (this.storageColumnSetting && this.tableId) {
      //   const str = localStorage.getItem(this.storageColumnKey);
      //   if (str) {
      //     // 缓存获取
      //     let list = JSON.parse(str);
      //     // 把业务做删除的字段从历史勾选中移除
      //     list = list.filter((item) => this.tableSchema.find((item2) => item === item2));
      //     // 如果在把新附加的字段增加进来
      //     // list = [...list, ..._.xor(list, this.tableSchema)];

      //     this.visibleColumnKeys = list;
      //   } else {
      //     // 接口获取
      //     this.$api.base.get(`/tables/keylist?tableId=${this.storageColumnKey}`).then((res) => {
      //       if (res?.data?.keyList) {
      //         let list = (res?.data?.keyList).split(',');
      //         // 把业务做删除的字段从历史勾选中移除
      //         list = list.filter((item) => this.tableSchema.find((item2) => item === item2));
      //         // 如果在把新附加的字段增加进来
      //         // list = [...list, ..._.xor(list, this.tableSchema)];

      //         this.visibleColumnKeys = list;
      //         // 缓存设置
      //         localStorage.setItem(this.storageColumnKey, JSON.stringify(this.visibleColumnKeys));
      //       }
      //     });
      //   }
      // }
    },
  },
  created() {
    this.initStorageColumn();
  },
  render() {
    const {
      $slots,
      $scopedSlots,
      data,
      loading,
      handleSelectionChange,
      rowKey,
      innerSchema,
      total,
      innerUiSchema,
      // uiSchema,
      multipleSelection,
      treeNode,
      rowButtons,
      onRowButtonClick,
      selectionType,
      isTree,
      columnWidth,
      refField,
      selectable,
      tableListTransform,
      tableAttrs,
      mergeCells,
      isReserve,
      onPageChange,
      onDialogOpen,
      onDialogClose,
      pageNum,
      maxHeight,
      onCurrentChange,
      onSortChange,
      onCellDblclick,
      checkboxConfig,
      radioConfig,
      sortConfig,
      seqConfig,
      sortMethod,
      autoPagination,
      showPagination,
      controlColumnWidth,
      showExpandAllBtn,
      showCollapseAllBtn,
      defaultAllColumnSort,
      onCellLinkClick,
      onColumnVisibleChange,
      onColumnVisibleReset,
      showColumnSetting,
      rowClassName,
      innerFormAttrs,
      innerDialogAttrs,
      beforeAddRowProxy,
      beforeUpdateRowProxy,
      canAdd,
      canUpdate,
      canDelete,
      canUpdateRow,
      canDeleteRow,
      labelMode,
      save,
      rules,
      showFooter,
      footerMethod,
      showControlColumn,
      showOverflow,
      forceEditOnRow,
      virtualScroll,
      pageSize,
      pageSizes,
      title,
      tableId,
      storageColumnKey,
      maxEditOnRow,
    } = this;
    const $t = this.$t.bind(this);
    const scopedSlots = {};
    if (innerSchema && innerSchema.properties) {
      // 渲染列自定义插槽
      Object.keys($scopedSlots).forEach((key) => {
        if (key.indexOf(SLOT_PREFIX) === 0) {
          const targetKey = key.replace(SLOT_PREFIX, '');
          if (innerSchema.properties[targetKey]) {
            scopedSlots[targetKey] = (scope) => this.$scopedSlots[key](scope);
          }
        }
      });
    }
    if ($scopedSlots.modifyDialog) {
      scopedSlots.modifyDialog = this.$scopedSlots.modifyDialog;
    }
    const directives = [
      { name: 'loading', value: loading },
    ];
    const innerEditConfig = forceEditOnRow ? {
      trigger: 'manual',
    } : {};

    const innerControlColumnConfig = {
      align: 'left',
      // maxDisplayCount: 3,
    };
    const innerScrollY = virtualScroll ? null : {
      enabled: false,
    };

    return (
    <el-card collapse class="fssc-search-result-card" shadow="never">
      <template slot="header">
          <span>{ title }</span>
          <div class="fssc-search-result-card__toolbar">
            { $slots.create }
          </div>
        </template>
      <div class="fssc-search-result-card">
        <el-editable-pro-table
          class="fssc-search-result-card__table"
          ref="proTable"
          { ...tableAttrs }
          {...{ directives }}
          on-selection-change={handleSelectionChange}
          on-row-button-click={onRowButtonClick}
          on-page-change={onPageChange}
          on-dialog-open={onDialogOpen}
          on-dialog-close={onDialogClose}
          on-current-change={onCurrentChange}
          on-sort-change={onSortChange}
          on-cell-dblclick={onCellDblclick}
          on-cell-link-click={onCellLinkClick}
          on-column-visible-change={onColumnVisibleChange}
          on-column-visible-reset={onColumnVisibleReset}
          element-loading-text={$t('common.loading')}
          tableId={tableId ? storageColumnKey : null}
          column-setting-draggable={true}
          show-control-column={showControlColumn}
          form-attrs={innerFormAttrs}
          max-height={maxHeight}
          selection-type={selectionType}
          auto-pagination={autoPagination}
          show-pagination={showPagination}
          schema={innerSchema}
          ui-schema={innerUiSchema}
          row-key={rowKey}
          rules={rules}
          data={data}
          total={total}
          page-num={pageNum}
          selectable={selectable}
          multiple-selection={multipleSelection}
          tree-node={treeNode}
          row-buttons={rowButtons}
          is-tree={isTree}
          ref-field={refField}
          scopedSlots={scopedSlots}
          table-list-transform={tableListTransform}
          column-width={columnWidth}
          merge-cells={mergeCells}
          is-reserve={isReserve}
          checkbox-config={checkboxConfig}
          radio-config={radioConfig}
          sort-config={sortConfig}
          seq-config={seqConfig}
          sort-method={sortMethod}
          control-column-width={controlColumnWidth}
          show-expand-all-btn={showExpandAllBtn}
          show-collapse-all-btn={showCollapseAllBtn}
          default-all-column-sort={defaultAllColumnSort}
          show-column-setting={showColumnSetting}
          row-class-name={rowClassName}
          before-add-row={beforeAddRowProxy}
          before-update-row={beforeUpdateRowProxy}
          dialog-attrs={innerDialogAttrs}
          force-edit-on-row={forceEditOnRow}
          edit-config={innerEditConfig}
          label-mode={labelMode}
          can-add={canAdd}
          can-update={canUpdate}
          can-delete={canDelete}
          can-update-row={canUpdateRow}
          can-delete-row={canDeleteRow}
          show-footer={showFooter}
          footer-method={footerMethod}
          show-overflow={showOverflow}
          save={save}
          control-column-config={innerControlColumnConfig}
          page-size={pageSize}
          page-sizes={pageSizes}
          stripe={true}
          scroll-y={innerScrollY}
          max-edit-on-row={maxEditOnRow}
        >
          <template slot="batchControl">
            { $slots.batchControl }
          </template>
        </el-editable-pro-table>
      </div>
     </el-card>
    );
  },
});
