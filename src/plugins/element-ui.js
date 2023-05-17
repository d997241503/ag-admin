import Vue from 'vue'
import ElementUI, {Table} from 'element-ui'

const ElTable = (context) => {
    const renderEmpty = () => (
        <el-empty image-size={80}></el-empty>
    )
    const {scopedSlots, props, data} = context
    const empty = scopedSlots.empty
    const _context = {
        scopedSlots: {
            ...scopedSlots,
            empty: empty || renderEmpty
        },
        props: {
            ...props,
            highlightCurrentRow: false
        },
        on: data.on,
        class: data.staticClass,
        style: data.staticStyle,
        directives: data.directives,
        ref: data.ref
    }

    return (
        <Table {..._context}></Table>
    )
}


export default {
    install() {
        Vue.use(ElementUI)
        Vue.component('ElTable', ElTable)
    }
}