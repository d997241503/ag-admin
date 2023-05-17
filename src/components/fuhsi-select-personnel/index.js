import fuhsiSelectPersonnel from './src/fuhsi-select-personnel'

fuhsiSelectPersonnel.install = function (Vue) {
  Vue.component(fuhsiSelectPersonnel.name, fuhsiSelectPersonnel)
}

export default fuhsiSelectPersonnel
