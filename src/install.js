import Setaria from 'setaria';
import SetariaUI from 'setaria-ui';
import locale from 'setaria-ui/lib/locale/lang/zh-CN';
import ProTable from 'setaria-ui/lib/pro-table'
import EditableProTable from 'setaria-ui/lib/editable-pro-table'
import SearchPage from '../package/search-page'
import BasicDialog from '../package/basic-dialog'
// 业务组件

// 下拉组件
import FakeSelect from '../package/select/fake-select'

const components = [
  EditableProTable,
  ProTable,
  SearchPage,
  FakeSelect,
  BasicDialog,
]

export function install(Framework) {
  return (Vue, opts) => {
    // 初始化Setaria SDK
    Vue.use(Setaria, opts);
    // 使用中文语言初始化Setaria UI
    Vue.use(SetariaUI, {
      locale,
      size: 'small',
    });

    // 初始化组件
    components.forEach((component) => {
      Vue.component(component.options.name, component);
    });
    // eslint-disable-next-line no-param-reassign
    Vue.prototype.$env = opts.env;
  };
}

export default {};
