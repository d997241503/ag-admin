export default {
    data() {
        return {
            listQuery: {
                page: 1,
                limit: 10,
            },
            listLoading: true,
            list: [],
            total: 0,
            tableHeight: 500
        }
    },
    created() {
        this.getList();
    },
    methods: {
        getListApi() {
            return Promise.resolve()
        },
        getList() {
            this.listLoading = true;
            this.getListApi()
            .then(res => {
                if (res?.status === 200) {
                    this.list = res.data.rows;
                    this.total = parseInt(res.data.total);
                } else {
                    this.total = 0;
                }
                this.listLoading = false;
            }).catch(() => {
                this.listLoading = false;
            }).finally(() => {
                this.tableLayout()
            })
        },
        handleSizeChange(val) {
            this.listQuery.limit = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.listQuery.page = val;
            this.getList();
        },
        handleFilter() {
           this.listQuery.page = 1
           this.getList()
        },
        // 表格有合并单元格和fixed的时候会错位，需要获取完数据重新布局
        tableLayout(option) {
            const {searchRefName = 'searchSection', tableRefName = 'table', subtractVal = 270} = option || {}
            const minHeight = 500
            const searchHeight = this.$refs[searchRefName]?.offsetHeight || 0
            const pageHeight = window.innerHeight
            const computedHeight = pageHeight - searchHeight - subtractVal
            this.tableHeight = computedHeight > minHeight ? computedHeight : minHeight
            this.$nextTick(() => {
                this.$refs[tableRefName]?.doLayout()
            })
        }
    }
}