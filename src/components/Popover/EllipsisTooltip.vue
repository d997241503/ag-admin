<script>
    export default {
        name:'',
        props: {
            content: String
        },
        data() {
            this.timer = null
            this.isShow = false
            return {
                ellipsis: false
            }
        },
        methods: {
            onEnter(e) {
                const {scrollWidth, offsetWidth} = e.target
                if (scrollWidth !== offsetWidth) {
                    this.timer = setTimeout(() => {
                        this.ellipsis = true
                    }, 500);
                }
            },
            onLeave() {
                clearTimeout(this.timer)
                this.ellipsis = false
            }
        },
        beforeDestroy() {
            clearTimeout(this.timer)
        },
        render() {
            const {staticClass, staticStyle} = this.$vnode.data
            const {ellipsis, content, $attrs} = this
            return (
                <el-tooltip placement="top" manual={true} value={ellipsis} content={content} props={$attrs}>
                    <span
                        class={staticClass + ' text-ellipsis-1'}
                        style={staticStyle}
                        onMouseenter={this.onEnter}
                        onMouseleave={this.onLeave}
                    >
                        {content}
                    </span>
                </el-tooltip>
            )
        }
    }
</script>

<style lang="scss" scoped>
    
</style>