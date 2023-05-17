<template>
	<div class="app-container calendar-list-container nav-content">
        <!-- <div class="search-info page-info" style="padding-bottom:0;">
            <div class="page-title">
				<el-popover class="input-item" v-model="popoverVisibel" trigger="click" v-loading="loading">
					<el-tree style="min-width: 350px;" ref="treeData" :props="defaultProps" :load="loadNode" lazy
						:default-expanded-keys="[index]" node-key="id" :expand-on-click-node="false" class="roll-containers">
							<span class="custom-tree-node" slot-scope="{ node, data }" @click="handleCheckChange(data)">
								<span
									v-bind:class="{'el-icon-user-solid': !node.isLeaf, 'el-icon-user': node.level > 2}">&nbsp;{{ node.label }}
								</span>
							</span>
						</el-tree>
					<el-select v-model="deptName" placeholder="请选择部门" class="input-item" style="width: 200%;" slot="reference"
						ref="selectIt" @focus="closeIt" clearable @clear="deptClear">
					</el-select>
				</el-popover>
			</div>
        </div> -->
		<div ref="searchSection" class="search-info page-info" style="padding-bottom:0;">
			<div class="search-left">
				<el-form :inline="true" :model="listQuery" @keyup.enter.native="getList()">
					<el-form-item>
						<el-popover class="input-item" v-model="popoverVisibel" trigger="click" v-loading="loading">
							<el-tree style="min-width: 350px;" ref="treeData" :props="defaultProps" :data="treeData"
								:default-expanded-keys="[index]" node-key="id" :expand-on-click-node="false" class="roll-containers">
									<span class="custom-tree-node" slot-scope="{ node, data }" @click="handleCheckChange(data)">
										<span
											v-bind:class="{'el-icon-user-solid': !node.isLeaf, 'el-icon-user': node.level > 1}">&nbsp;{{ node.label }}
										</span>
									</span>
								</el-tree>
							<el-select v-model="deptName" placeholder="请选择单位" class="input-item" slot="reference"
								ref="selectIt" @focus="closeIt" clearable @clear="deptClear">
							</el-select>
						</el-popover>
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
						<el-input clearable placeholder="请输入谈话人关键字查询" v-model="listQuery.talkUserName" style="width: 220px;">
						</el-input>
					</el-form-item>
					<el-form-item>
						<el-input clearable placeholder="请输入被谈话人关键字查询" v-model="listQuery.beTalkUserName" style="width: 220px;">
						</el-input>
					</el-form-item>
					<el-form-item>
						<el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter()">查询</el-button>
                        <el-button v-waves icon="search" type="primary" @click="handleReset">重置</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
		<div class="page-info" ref="pageInfo">
			<el-table :height="tableHeight" ref="table" :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
				<el-table-column label="序号" width="50px" type="index" />
				<el-table-column width="120" align="center" label="时间">
					<template slot-scope="scope">
						{{scope.row.talkTime}}
					</template>
				</el-table-column>
				<el-table-column width="200" align="center" label="地点" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{scope.row.talkPlace}}</div>
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="center" label="谈话人" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span v-for="(item,index) in scope.row.talkUser" :key="index">{{item.name}}
							<span v-if="index+1 !== scope.row.talkUser.length">、</span>
						</span>
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="center" min-width="250" label="被谈话人">
					<template slot-scope="scope">
						<!-- <div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" v-for="(item,index) in scope.row.beTalkUser" :key="index">{{item.name}}
							<span v-if="item.position"> - {{item.position}}</span>
						</div> -->
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
				<el-table-column header-align="center" align="center" label="事由" :show-overflow-tooltip="true">
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
			</el-table>
			<div class="pagination-container">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
				 :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" align="right" layout="total, sizes, prev, pager, next, jumper"
				 :total="total">
				</el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		pageAccount
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
	import tableMixin from '@/mixins/table/table.mixin'
	export default {
		name: "index",
		mixins: [tableMixin],
		data() {
			return {
				popoverVisibel: false,
				loading: true,
				list: null,
				total: null,
				listLoading: true,
				listQuery: {
					page: 1,
					limit: 10,
					talkType: undefined,
					deptId: undefined,
					startDate: '',
					endDate: '',
					talkUserName: '',
					beTalkUserName: ''
				},
				deptName: '',
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
				index: 0,
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
				query: ''
			}
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
		filters: {
			// 格式化文件名
			formatFile(url) {
				return formatFile(url);
			}
        },
		created() {
			// this.getDataList();
			this.getTreeInfo();
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
			},
			// 下载文件
			downloadHadle(url) {
				window.location.href = `/api/upload/download/downloadFileByBucketName?fileUrl=${url}&token=${getToken()}&bucketName=talkinc`;
			},
			// 获取部门树
			getTreeInfo() {
				// getTree()
				// 	.then(res => {
				// 		if (res && res.code === 0) {
				// 			// this.treeData = res.data ? res.data : [];
				// 			for(let i = 0; i < res.data.length; i++) {
				// 				this.treeData.push({label: res.data[i].departmentFullName,value: res.data[i].id})
				// 			}
				// 			this.treeData = res.data.map(item => { return {label: res.data.departmentFullName,
				// 				value: res.data.id}})
				// 		} else {
				// 			this.$notify({
				// 				title: '失败',
				// 				message: "获取部门树失败",
				// 				type: 'error',
				// 				duration: 2000
				// 			});
				// 		}
				// 	});
				// let val = null
				// val = getTree().then( res => {
				// 		if (res.code !== 0) {
				// 			return this.$message.error(res.msg)
				// 		}
				// 		return res.data ? res.data : [];
				// 	}).catch(() => {
				// 		return []
				// 	});
				// return Promise.resolve(val);
				getTree({
							departmentAttribute: '1'
						})
					.then(res => {
						if (res && res.code === 0) {
							this.treeData = res.data ? res.data : [];
							this.loading = false;
						} else {
							this.$notify({
								title: '失败',
								message: "获取部门树失败",
								type: 'error',
								duration: 2000
							});
							this.loading = false;
						}
					});
			},
			// loadNode(node, resolve) {
			// 	if (node.level === 0) {
			// 		this.getTreeInfo().then((res) => {
			// 			this.treeData = res;
			// 			this.loading = false;
			// 			return resolve(res);
			// 		}).catch(() => {
			// 			this.loading = false;
			// 		});
			// 	}

			// 	if (node.level > 1) {
			// 		this.partyId = node.data.id
			// 		this.getTreeInfo().then((res) => {
			// 			return resolve(res);
			// 		});
			// 	}

			// 	if (node.level === 1) {
			// 		this.partyId = node.data.id;
			// 		this.getTreeInfo().then((res) => {
			// 			return resolve(res);
			// 		});
			// 	}
			// },
			// 隐藏下拉框
			closeIt() {
				this.$refs.selectIt.blur();
			},
			deptClear(e) {
				this.listQuery.deptId = undefined;
			},
			// 选择部门
			handleCheckChange(data) {
				this.listQuery.deptId = data.id;
				this.deptName = data.departmentFullName;
				this.popoverVisibel = false;
			},
			// 获取数据列表
			getList() {
				this.listLoading = true;
				this.listQuery.startDate = this.times && this.times.length ? this.times[0] : '';
				this.listQuery.endDate = this.times && this.times.length ? this.times[1] : '';
				pageAccount(this.listQuery)
					.then(response => {
						if (response && response.status === 200) {
							this.list = response.data.rows;
							this.total = parseInt(response.data.total);
						} else {
							this.total = 0;
						}
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
            handleReset() {
                this.listQuery = {
					page: 1,
					limit: 10,
					talkType: undefined,
					deptId: undefined,
					startDate: '',
					endDate: '',
					talkUserName: '',
					beTalkUserName: ''
				}
                this.deptName = ''
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

    .page-title {
		width: 180px;
		height: 30px;
		margin: 0 auto;
		margin-bottom: 20px;
		line-height: 30px;
		background-color: #bc0000;
		color: #FFFFFF;
		font-size: 15px;
		text-align: center;
		border-radius: 5px;
	}

	.file-download {
		text-decoration: underline;
	}

	.file-download:hover {
		cursor: pointer;
		color: #888888;
	}
</style>
xv