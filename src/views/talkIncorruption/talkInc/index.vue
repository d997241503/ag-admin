<template>
	<div class="app-container calendar-list-container nav-content">
		<div ref="searchSection" class="search-info page-info" style="padding-bottom:0;">
			<div class="search-left">
				<el-form :inline="true" :model="listQuery" @keyup.enter.native="getList()">
					<el-form-item>
						<el-input clearable placeholder="请输入事由关键字查询" maxlength="20" v-model="listQuery.reason">
						</el-input>
					</el-form-item>
					<el-form-item>
						<el-select v-model="listQuery.talkType" clearable placeholder="请选择谈话类别">
							<el-option v-for="item in talkType" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-date-picker v-model="times" type="daterange" align="right" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
						 unlink-panels range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" :picker-options="pickerOptions">
						</el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter()">查询</el-button>
						<el-button v-waves icon="search" type="primary" @click="handleReset">重置</el-button>
					</el-form-item>
					<el-form-item>
						<el-button v-if="talkInc_btn_add" class="filter-item" type="primary" v-waves icon="search" @click="addOrUpdateHandle()">新增谈话记录</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div>
				<el-button v-if="talkInc_btn_account" class="filter-item" type="primary" v-waves icon="search" @click="accountHandle()">台账</el-button>
			</div>
		</div>
		<div class="page-info" ref="pageInfo">
			<el-table :height="tableHeight" ref="table" :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
				<el-table-column label="序号" width="50px" align="center" type="index" />
				<el-table-column width="150" align="center" label="时间">
					<template slot-scope="scope">
						{{scope.row.talkTime}}
					</template>
				</el-table-column>
				<el-table-column width="200" align="center" label="地点" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{scope.row.talkPlace}}</div>
					</template>
				</el-table-column>
				<el-table-column width="200" header-align="center" align="center" label="谈话人" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span v-for="(item,index) in scope.row.talkUser" :key="index">{{item.name}}
							<span v-if="index+1 !== scope.row.talkUser.length">、</span>
						</span>
					</template>
				</el-table-column>
				<el-table-column width="230" header-align="center" align="center" label="被谈话人">
					<template slot-scope="scope">
						<el-tooltip v-if="scope.row.beTalkUser && scope.row.beTalkUser.length > 5" class="item" effect="dark" :content="getBeTalkUser(scope.row.beTalkUser)" placement="top">
							<div>
								<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" v-for="(item,index) in scope.row.beTalkUser" :key="index">
									<span v-show="index < 5">
										{{item.name}}
										<span v-if="item.position"> - {{item.position}}</span>
									</span>
								</div>
								...
							</div>
						</el-tooltip>
						<div v-else style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" v-for="(item,index) in scope.row.beTalkUser" :key="index">
							<span>
								{{item.name}}
								<span v-if="item.position"> - {{item.position}}</span>
							</span>
						</div>
					</template>
				</el-table-column>
				<!-- <el-table-column width="150" header-align="center" align="center" label="被谈话人职务">
					<template slot-scope="scope">
						<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
							<span v-for="(item,index) in scope.row.beTalkUser" :key="index">{{item.position}}
								<span v-if="index+1 !== scope.row.beTalkUser.length">、</span>
							</span>
						</div>
					</template>
				</el-table-column> -->
				<el-table-column min-width="210" header-align="center" align="center" label="事由" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{scope.row.reason}}</div>
					</template>
				</el-table-column>
				<el-table-column width="120" header-align="center" align="center" label="谈话类别">
					<template slot-scope="scope">
						{{fomatState(scope.row.talkType)}}
					</template>
				</el-table-column>
				<el-table-column width="150" header-align="center" align="center" label="附件" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" v-for="(item, index) in scope.row.talkFiles" :key="index" @click="downloadHadle(item)" class="file-download">{{item | formatFile}}</div>
					</template>
				</el-table-column>
				<el-table-column width="200" header-align="center" align="center" label="谈话记录资料是否立卷存档">
					<template slot-scope="scope">
						<span v-if="scope.row.fileOrNot">是</span>
						<span v-else>否</span>
					</template>
				</el-table-column>
				<el-table-column width="220" header-align="center" align="center" label="谈话记录资料是否立卷存档备注" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span>{{scope.row.fileOrNotNote}}</span>
					</template>
				</el-table-column>
				<el-table-column fixed="right" header-align="center" align="center" width="120" label="操作">
					<template slot-scope="scope">
						<el-button v-if="talkInc_btn_edit" type="text" @click="addOrUpdateHandle(scope.row,'edit')">编辑</el-button>
						<el-button v-if="talkInc_btn_delete" type="text" @click="handleDelete(scope.row.id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination-container">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
				 :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" align="right" layout="total, sizes, prev, pager, next, jumper"
				 :total="total">
				</el-pagination>
			</div>
		</div>
		<!-- 弹窗, 新增谈话记录 -->
		<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getList"></add-or-update>
	</div>
</template>

<script>
	import AddOrUpdate from './addOrEdit';
	import {
		page,
		delObj
	} from 'api/talkInc/index';
	import {
		getTree
	} from 'api/admin/department/index';
	import {
		MessageBox
	} from 'element-ui';
	import {
		getByType
	} from 'api/admin/dict/index';
	import {
		mapGetters
	} from 'vuex';
	import {
		getToken
	} from 'utils/auth';
	import {
		formatFile
	} from 'utils';
	// import tableMixin from '@/mixins/table/table.mixin'
	export default {
		name: "index",
		// mixins: [tableMixin],
		data() {
			return {
				addOrUpdateVisible: false,
				list: null,
				total: null,
				listLoading: true,
				listQuery: {
					page: 1,
					limit: 10,
					talkType: undefined,
					reason: '',
					startDate: '',
					endDate: ''
				},
				talkType: [
					{label: '例行廉政谈话', value: '1'},
					{label: '任前廉政谈话', value: '2'},
					{label: '提醒谈话', value: '3'},
					{label: '约谈', value: '4'},
					{label: '批评教育', value: '5'},
					{label: '谈话提醒', value: '6'}
				],
				treeVisible: false,
				treeData: [],
				defaultProps: {
					children: 'children',
					label: 'departmentFullName'
				},
				times: [],
				tableKey: 0,
				pickerOptions: {
					shortcuts: [{
						text: '最近一周',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近一个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近三个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
							picker.$emit('pick', [start, end]);
						}
					}]
				},
				examTypes: [],
				name: '',
				query: '',
				talkInc_btn_add: false,
				talkInc_btn_edit: false,
				talkInc_btn_delete: false,
				talkInc_btn_account: false,
				tableHeight: 500
			}
		},

		filters: {
			// 格式化文件名
			formatFile(url) {
				return formatFile(url);
			}
        },

		components: {
			AddOrUpdate
		},

		computed: {
			...mapGetters([
				'elements'
			]),
			
			fomatState() {
				// 闭包
				return (val) => {
					// 获取到对应的类型
					switch (val) {
						case '1':
							return "例行廉政谈话"
							break;
						case '2':
							return "任前廉政谈话"
							break;
						case '3':
							return "提醒谈话"
							break;
						case '4':
							return "约谈"
							break;
						case '5':
							return "批评教育"
							break;
						case '6':
							return "谈话提醒"
							break;
						default:
							break;
					}
				}
			},
		},
		created() {
			// this.getDataList();
			this.getTreeInfo();
			// 获取权限
			this.talkInc_btn_add = this.elements['talkInc:btn_add'];
			this.talkInc_btn_edit = this.elements['talkInc:btn_edit'];
			this.talkInc_btn_delete = this.elements['talkInc:btn_delete'];
			this.talkInc_btn_account = this.elements['talkInc:btn_account'];
			this.$nextTick(() => {
				this.getList();
			})
		},
		methods: {
			getBeTalkUser(data) {
				if(data && data.length>5) {
					const str = []
					for(let i = 0; i < data.length; i++) {
						if(data[i].position) str.push(data[i].name + '-' + data[i].position)
						else str.push(data[i].name)
					}
					return str.toString()
				}
				// if(data.position) return data.name + '-' + data.position
				// else return data.name
			},
			// 下载文件
			downloadHadle(url) {
				window.location.href = `/api/upload/download/downloadFileByBucketName?fileUrl=${url}&token=${getToken()}&bucketName=talkinc`;
			},
			// 获取部门树
			getTreeInfo() {
				getTree()
					.then(res => {
						if (res && res.code === 0) {
							this.treeData = res.data ? res.data : [];
						} else {
							this.$notify({
								title: '失败',
								message: "获取部门树失败",
								type: 'error',
								duration: 2000
							});
						}
					});
			},
			// 获取数据列表
			getList() {
				this.listLoading = true;
				this.listQuery.startDate = this.times && this.times.length ? this.times[0] : '';
				this.listQuery.endDate = this.times && this.times.length ? this.times[1] : '';
				page(this.listQuery)
					.then(response => {
						if (response && response.status === 200) {
							this.list = response.data.rows;
							this.total = parseInt(response.data.total);
						} else {
							this.total = 0;
						}
						this.tableLayout();
						this.listLoading = false;
					}).catch(() => {
						this.listLoading = false;
					})
			},

			handleFilter() {
				this.listQuery.page = 1;
				this.getList();
			},
			handleSizeChange(val) {
				this.listQuery.limit = val;
				this.getList();
			},
			handleCurrentChange(val) {
				this.listQuery.page = val;
				this.getList();
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

			// 台账
			accountHandle() {
				this.$router.push({
					path: '/accountTalkInc',
				})
			},

			// 新增/修改
			addOrUpdateHandle(row,operation) {
				// this.$nextTick(() => {
				// 	this.$router.push({
				// 		path: '/newlytalkInc',
				// 		query: {
				// 			row: row,
				// 			operation: operation
				// 		}
				// 	})
				// })
				this.addOrUpdateVisible = true
				this.$nextTick(() => {
					// this.$refs.addOrUpdate.dataForm = row;
					this.$refs.addOrUpdate.init(row,operation);
				})
			},

			// 删除
			handleDelete(id) {
				this.$confirm('此操作将永久删除, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					})
					.then(() => {
						delObj(
								id
							)
							.then(res => {
								if (res && res.status === 200) {
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
							});
					}).catch(() => {

					});
			},
            handleReset() {
                this.listQuery = {
					page: 1,
					limit: 10,
					talkType: undefined,
					reason: '',
					startDate: '',
					endDate: ''
				}
                this.times = []
                this.getList()
            }
		}
	}
</script>

<style lang="scss" scoped>
	.search-info {
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-between;
		margin-bottom: 20px;
	}

	.page-info {
		border: 0.0625rem solid #EAEAEA;
		border-radius: 10px;
		padding: 20px;
		background-color: #FFFFFF;
	}

	.tree-info {
		position: absolute;
	}

	.file-download {
		text-decoration: underline;
	}

	.file-download:hover {
		cursor: pointer;
		color: #bc0000;
	}
</style>
