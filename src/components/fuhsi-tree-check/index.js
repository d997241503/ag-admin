import fuhsiTreeCheck from './src/fuhsi-tree-check'

fuhsiTreeCheck.install = function (Vue) {
  Vue.component(fuhsiTreeCheck.name, fuhsiTreeCheck)
}

export default fuhsiTreeCheck
