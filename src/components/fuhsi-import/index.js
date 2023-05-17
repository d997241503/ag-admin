import fuhsiImport from './src/fuhsi-import'

fuhsiImport.install = function (Vue) {
  Vue.component(fuhsiImport.name, fuhsiImport)
}

export default fuhsiImport
