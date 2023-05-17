import tableTreeCheck from './src/table-tree-check'

tableTreeCheck.install = function (Vue) {
  Vue.component(tableTreeCheck.name, tableTreeCheck)
}

export default tableTreeCheck
