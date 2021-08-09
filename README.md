# setaria-vue-component-library

> 为应用系统业务框架开发场景而生的基于Setaria的Vue工程模板

## ✨ 在线预览

https://setariajs.github.io/setaria-vue-component-library/#/component/installation

## 📒 目录介绍

```
├── docs                   组件文档存放路径
│   ├── demo               
│   │   └── **.md          组件文档示例
│   ├── demo-style               
│   │   └── index.scss     组件文档示例样式
│   └── nav.config.json    组件菜单配置
├── src                    组件主目录
│   ├── config             全局配置
│   │   ├── http           服务调用公共配置
│   │   ├── message        消息配置
│   │   └── route          路由公共配置
│   ├── constant           常量定义
│   ├── mixin              组件混入逻辑
│   ├── service            公共服务
│   ├── store              Vuex公共状态管理
│   ├── util               公共业务逻辑
│   ├── install.js         公共业务框架安装器
│   └── lib.js             框架入口
├── style                  全局样式
├── .browserslistrc.js     浏览器 配置
├── .eslintrc.js           eslint 配置
└── tsconfig.json          typescript 配置
```

## 🤖 命令介绍

| 名称                    | 描述           | 备注                                                                 |
| ----------------------- | -------------- | -------------------------------------------------------------------- |
| `yarn start`         | 项目启动       | 框架开发和文档开发在一起 |
| `yarn build:lib`          | 框架打包       | -                                                                    |
| `yarn build:demo` | 框架示例打包 | -                                                                    |
| `yarn deploy`      | 框架示例部署至github       | -                                                                    |

# Feature

- [X] install
- [X] example
- [X] scss
- [X] umd
- [X] gh-page deploy
- [ ] test

## License

MIT