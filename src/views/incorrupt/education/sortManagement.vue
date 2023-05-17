<template>
	<div class="tier-page">
		<!-- <div @click="goBack()" class="go-back-img">
			<img src="~@/assets/img/go_back.png" alt="返回"></img>
		</div> -->
		<div class="page-title">{{$route.name}}</div>
		<el-divider></el-divider>
		<div style="width: 80%;margin: 0 auto;text-align: right;">
			<el-button v-if="educationManager_btn_add_category_first" class="filter-item" type="primary" v-waves icon="search" @click="handleFirstSort()">一级类别</el-button>
			<el-button v-if="educationManager_btn_add_category_second" class="filter-item" type="primary" v-waves icon="search" @click="handleSecondSort()">二级分类</el-button>
		</div>
		<div style="width: 80%;margin: 20px auto;">
			<el-table :height="tableHeight" ref="table" :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
				<el-table-column align="center" label="一级类别">
					<template slot-scope="scope">
						<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{scope.row.name}}</div>
					</template>
				</el-table-column>
				<el-table-column align="center" label="属性" width="120">
					<template slot-scope="scope">
						<span>{{fomatProperty(scope.row.type)}}</span>
					</template>
				</el-table-column>
				<el-table-column width="100px" align="center" label="展示顺序">
					<template slot-scope="scope">
						<span>{{scope.row.sort}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="二级分类">
					<template slot-scope="scope">
						<div v-if="scope.row.type === '0'">
							<div v-if="scope.row.children && scope.row.children.length">
								<span v-for="(item,index) in scope.row.children" :key="index">{{item.name}}<span v-show="index < scope.row.children.length - 1">、</span></span>
							</div>
							<div v-else>
								<!-- <el-button type="text" size="mini" style="font-size: 13px;">+ 添加</el-button> -->
								-
							</div>
						</div>
						<div v-else>/</div>
					</template>
				</el-table-column>
				<el-table-column width="100px" align="center" label="文章数量">
					<template slot-scope="scope">
						<span v-if="scope.row.count">{{scope.row.count}}</span>
						<span v-else>/</span>
					</template>
				</el-table-column>
				<el-table-column fixed="right" align="center" label="操作" width="150">
					<template slot-scope="scope">
						<el-button v-if="educationManager_btn_edit_category" size="small" type="text" @click="handleUpdate(scope.row)">修改
						</el-button>
						<el-button size="small" type="text" @click="handleDelete(scope.row)">删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<FirstSort v-if="firstSortVisible" ref="firstSort" @refreshData="getList"></FirstSort>
		<SecondSort v-if="secondSortVisible" ref="secondSort" @refreshData="getList"></SecondSort>
		<EditSort v-if="editSortVisible" ref="editSort" @refreshData="getList"></EditSort>
	</div>
</template>

<script>
	import {
		sortManagementPage,
		deleteCategory
	} from 'api/incorrupt/education/index';
	import {
		getToken
	} from 'utils/auth';
	import {
		mapGetters
	} from 'vuex';
	import FirstSort from './components/firstSort';
	import SecondSort from './components/secondSort';
	import EditSort from './components/editSort'
	import {
		toDate
	} from '@/utils'
	export default {
		name: 'honestReport',
		data() {
			return {
				listLoading: true,
				list: [],
				tableKey: 0,
				firstSortVisible: false,
				secondSortVisible: false,
				editSortVisible: false,
				properties: [{
					value: "编辑类",
					code: '0'
				}, {
					value: "链接类",
					code: '1'
				}],
				loading: false,
				educationManager_btn_add_category_first: false,
				educationManager_btn_add_category_second: false,
				educationManager_btn_edit_category: false,
			}
		},
		created() {
			// 获取列表
			this.getList();
			this.educationManager_btn_add_category_first = this.elements['educationManager:btn_add_category_first'];
			this.educationManager_btn_add_category_second = this.elements['educationManager:btn_add_category_second'];
			this.educationManager_btn_edit_category = this.elements['educationManager:btn_edit_category'];
		},
		components: {
			FirstSort,
			SecondSort,
			EditSort
		},
		computed: {
			...mapGetters([
				'elements'
			]),
			// 格式化属性
			fomatProperty() {
				// 闭包
				return (val) => {
					// 获取到对应的类型
					let label = this.properties.filter((item) => {
						return (item.code.indexOf(val) >= 0)
					});
					return label.length ? label[0].value : '';
				}
			},
		},
		methods: {
			goBack() {
				this.$router.go(-1);
			},

			// 获取数据列表
			getList() {
				this.listLoading = true;
				sortManagementPage(this.listQuery)
					.then(response => {
						if (response && response.code === 0) {
							this.list = response.data;
						} else {
						}
						this.tableLayout();
						this.listLoading = false;
					}).catch(() => {
						this.listLoading = false;
					})
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
			},

			// 打开一级类别弹窗
			handleFirstSort() {
				this.firstSortVisible = true;
				this.$nextTick(() => {
					this.$refs.firstSort.init();
				})
			},

			// 打开二级分类弹窗
			handleSecondSort() {
				this.secondSortVisible = true;
				this.$nextTick(() => {
					this.$refs.secondSort.init(this.list);
				})
			},
			// 修改
			handleUpdate(row) {
				this.editSortVisible = true;
				this.$nextTick(() => {
					this.$refs.editSort.init(row);
				})
			},

			// 删除
			handleDelete(row) {
				this.$confirm('此操作将永久删除, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					})
					.then(() => {
						deleteCategory({
								categoryId: row.categoryId
							})
							.then(res => {
								if (res && res.code === 0) {
									this.$notify({
										title: '成功',
										message: '删除成功',
										type: 'success',
										duration: 2000
									});
									this.getList();
								} else {
									this.$notify({
										title: '失败',
										message: '删除失败',
										type: 'error',
										duration: 2000
									});
								}
							}).catch(() => {
								this.$notify({
									title: '失败',
									message: '删除失败',
									type: 'error',
									duration: 2000
								});
							});;
					}).catch(() => {

					});
			}
		}
	}
</script>

<style scoped>
	.content {
		border: 0.0625rem solid #eaeaea;
		padding: 20px;
		border-radius: 10px;
	}

	.cut-line {
		font-size: 18px;
		font-weight: 600;
		border-left: 5px solid #bc0000;
		padding-left: 20px;
	}

	.page-title {
		width: 180px;
		height: 30px;
		margin: 0 auto;
		margin-bottom: -24px;
		line-height: 30px;
		background-color: #bc0000;
		color: #FFFFFF;
		font-size: 15px;
		text-align: center;
		border-radius: 5px;
	}
</style>
