<template>
	<div class="content-types goback-info">
		<div v-if="$route.query.operation == 'detail' && !$route.query.status" style="padding: 0px 0px 20px 0px">
			<el-date-picker v-model="year" type="year" format="yyyy" value-format="yyyy" placeholder="选择年" style="width: 100px;" @change="yearChange" :clearable="false">
			</el-date-picker>
			<el-input style="width: 150px;" clearable class="filter-item" placeholder="请输入关键字" prefix-icon="el-icon-search"
				v-model="filterText" @input="getTreeInfo">
			</el-input>
		</div>
		<div v-else style="padding: 0px 0px 20px 0px">
			<el-input style="width: 100%;" clearable class="filter-item" placeholder="请输入关键字" prefix-icon="el-icon-search"
				v-model="filterText" @input="getTreeInfo">
			</el-input>
		</div>
		<!-- <div v-if="operation == 'oneself'" class="item-box containers roll-containers">
			<div class="item-info show-a-line"
				:class="{'active-item': activeIndex === index, 'not-show-line': index === formTypes.length - 1}"
				v-for="(item, index) in typePareChilds" :key="index" @click="handleTypeBeforeOrAfter(index)" v-waves>
				{{item.name}}
			</div>
		</div> -->
		<div class="item-box">
			<!-- <div class="item-info show-a-line"
				:class="{'active-item': activeIndex === index, 'not-show-line': index === formTypes.length - 1}"
				v-for="(item, index) in formTypes" :key="index" @click="handleType(index)" v-waves>
				{{item.formName}}
			</div> -->
			<div class="containers">
				<el-tree :data="typeData" ref="tree" draggable node-key="id" :expand-on-click-node="false" @node-click="handlePartyBranch" 
					:props="(($route.query.operation == 'detail' && !$route.query.status) || $route.query.operation == 'oneself') ? defaultProps : defaultPropsAdd" highlight-current :default-expand-all="true">
					<span class="custom-tree-node show-hide node-tab" slot-scope="{ node, data }" tabindex="1" :current-node-key="id">
						<!-- <div v-if="$route.query.operation == 'detail' && data.name !== '个人档案' && data.name !== '个人有关事项报告表'" class="node-tab">
							<el-popover trigger="hover" content="首次提报" placement="top">
								<span :class=" data.status=='2' ? 'isredMarker' : 'redMarker' " slot="reference"></span>
							</el-popover>
							<el-popover trigger="hover" content="有更新" placement="top">
								<span :class=" data.status=='1' ? 'isredMarker' : 'redMarker' " slot="reference"></span>
							</el-popover>
							<el-popover trigger="hover" content="无更新" placement="top">
								<span :class=" data.status=='0' ? 'isredMarker' : 'redMarker' " slot="reference"></span>
							</el-popover>
						</div>
						<div v-if="$route.query.operation == 'add' && data.formTypeName !== '个人档案' && data.formTypeName !== '个人有关事项报告表'" class="node-tab">
							<el-popover trigger="hover" content="首次提报" placement="top">
								<span :class=" data.status=='2' ? 'isredMarker' : 'redMarker' " slot="reference"></span>
							</el-popover>
							<el-popover trigger="hover" content="有更新" placement="top">
								<span :class=" data.status=='1' ? 'isredMarker' : 'redMarker' " slot="reference"></span>
							</el-popover>
							<el-popover trigger="hover" content="无更新" placement="top">
								<span :class=" data.status=='0' ? 'isredMarker' : 'redMarker' " slot="reference"></span>
							</el-popover>
						</div> -->
						<!-- <div v-if="data.status" class="node-tab">
							<el-tag type="info" effect="plain">
								<span v-if="data.status=='2'">首次提报</span>
								<span v-if="data.status=='1'">有更新</span>
								<span v-if="data.status=='0'">无更新</span>
							</el-tag>
						</div> -->
						<!-- <span class="custom-tree-node-content node-tab"> -->
							<i class="el-icon-folder" style="color: #DFBA49; margin-right: 5px;line-height: 22px;"></i>
							<el-tag v-if="data.status && ((operation == 'detail' && tabPosition == '我的审核' && queryStatus == '1') || (operation == 'detail' && !queryStatus))" type="info" effect="plain">
								<span v-if="data.status=='2'">首次</span>
								<span v-if="data.status=='1'">有更新</span>
								<span v-if="data.status=='0'">无更新</span>
							</el-tag>
							<el-tag v-if="operation == 'add' && tabPosition == '我的提报' && data.formVariables && (queryStatus == '2' || queryStatus == '3')" type="info" effect="plain">
								<span>已保存</span>
							</el-tag>
							<span style="width: 100%;font-size: 15px;margin-left: 5px;">{{ node.label }}
							</span>
						<!-- </span> -->
					</span>
				</el-tree>
			</div>
		</div>
		<!-- <div v-if="integrityArchives_btn_addFile && operation == 'detail'" class="item-button">
			<el-button class="filter-item" style="margin-left: 10px;" @click="addFileHandle"
			type="primary" icon="edit">新增档案</el-button>
		</div> -->
		<!-- <div v-if="!addible" class="item-box containers roll-containers">
			<div class="item-info show-a-line"
				:class="{'active-item': activeIndex === index, 'not-show-line': index === formTypes.length - 1}"
				v-for="(item, index) in formTypes" :key="index" @click="handleType(index)" v-waves>
				{{item.formName}}
			</div>
		</div> -->
		<!-- 弹窗, 新增档案 -->
		<AddFile v-if="addFileVisible" ref="addFile" @refreshDataList="getFormId"></AddFile>
	</div>
</template>

<script>
	import AddFile from './addFile';
	import {
		individualList,
		individualInspectionList,
		listSimple,
		hiarchivesList,
		formtreeUser
	} from 'api/archives/index';
	import {
		getForm
	} from 'api/bpm/form';
	import {
		mapGetters
	} from 'vuex';
	export default {
		data() {
			return {
				activeIndex: 0,
				formTypes: [],
				integrityArchives_btn_addFile: false,
				integrityArchives_btn_inspection: false,
				addible: true,
				formTypesIns: [],
				addFileVisible: false,
				data: {},
				operation: '',
				typePareChilds: [],
				year: new Date().getFullYear().toString(),
				name: '',
				typeData: [],
				defaultProps: {
					children: 'children',
					label: 'name'
				},
				defaultPropsAdd: {
					children: 'children',
					label: 'formTypeName'
				},
				filterText: '',
				status: undefined,
				queryStatus: '',
				tabPosition: '',
				id: undefined,
				formNum: 0
			}
		},

		components: {
			AddFile
		},

		computed: {
			...mapGetters([
				'elements'
			])
		},
		
		created() {
			this.operation = this.$route.query.operation;
			this.queryStatus = this.$route.query.status;
			this.tabPosition = this.$route.query.tabPosition;
			// 获取权限
			this.integrityArchives_btn_addFile = this.elements['integrityArchives:btn_addFile'];
			this.integrityArchives_btn_inspection = this.elements['integrityArchives:btn_inspection'];
			// if(this.operation == 'oneself') this.typePareList();
			// else this.getTreeInfo();
			// this.getHiarchivesInfo()
			// this.$nextTick(() => {
			// 	if(this.integrityArchives_btn_addFile) this.getInspectionListTreeInfo();
			// })
			this.getTreeInfo();
		},

		mounted() {
		},

		methods: {
			// 获取树结构
			getTreeInfo(taskarchivesId) {
				if(this.$route.query.operation == 'detail' && !this.$route.query.status) {
					formtreeUser({ name: this.filterText, type: '', year: this.year },this.$route.query.userId)
						.then(res => {
							if (res && res.status === 200) {
								this.typeData = res.data ? res.data : [];
								if(res.data && res.data[0]) {
									this.status = res.data[0].status;
									this.id = res.data[0].id;	
								}
								if(taskarchivesId) {
									this.$nextTick(() => {
										this.$refs.tree.setCurrentKey(taskarchivesId)
									})
								}
							} else {
								this.$notify({
									title: '失败',
									message: "获取树结构失败",
									type: 'error',
									duration: 2000
								});
							}
						});
				} else if(this.$route.query.operation == 'oneself'){
					this.typePareList();
				} else {
					individualList(this.$route.query.id).then(res => {
						if (res && res.status === 200) {
							this.typeData = res.data ? res.data : [];
							this.status = res.data[0].status;
							if(this.$route.query.formId && res.data && res.data.length) {
								for(let i = 0; i < res.data.length; i++) {
									if(this.$route.query.formId == res.data[i].id) {
										this.$emit('refreshData', '', res.data[i]);
										this.$nextTick(() => {
											this.$refs.tree.setCurrentKey(res.data[i].id)
										})
									}
								}
							} else {
								if(res.data && res.data[0]) {
									if(res.data && res.data.length == 1 && res.data[0].children && res.data[0].children.length) {
										this.formNum = res.data[0].children.length;
										for(let i = 0; i < res.data[0].children.length; i++) {
											if('个人有关事项报告表' == res.data[0].children[i].formTypeName) {
												this.formNum = this.formNum + res.data[0].children[i].children.length - 1;
												break;
											}
										}
									} else {
										this.formNum = res.data.length;
										for(let i = 0; i < res.data.length; i++) {
											if('个人有关事项报告表' == res.data[i].formTypeName) {
												this.formNum = this.formNum + res.data[i].children.length - 1;
												break;
											}
										}
									}
									// this.$emit('refreshData', '', res.data[0],'',res.data.length);
									this.$nextTick(() => {
										if(taskarchivesId) {
											if(res.data && res.data.length == 1 && res.data[0].children && res.data[0].children.length) {
												for(let i = 0; i < res.data[0].children.length; i++) {
													if(res.data[0].children[i].children && res.data[0].children[i].children.length) {
														for(let j = 0; j < res.data[0].children[i].children.length; j++) {
															if(taskarchivesId == res.data[0].children[i].children[j].id) {
																this.$emit('refreshData', '', res.data[0].children[i].children[j], '', this.formNum);
																this.$nextTick(() => {
																	this.$refs.tree.setCurrentKey(res.data[0].children[i].children[j].id)
																})
															}
														}
													} else if(taskarchivesId == res.data[0].children[i].id) {
														this.$emit('refreshData', '', res.data[0].children[i], '', this.formNum);
														this.$nextTick(() => {
															this.$refs.tree.setCurrentKey(res.data[0].children[i].id)
														})
													}
												}
											} else {
												for(let i = 0; i < res.data.length; i++) {
													if(res.data[i].children && res.data[i].children.length) {
														for(let j = 0; j < res.data[i].children.length; j++) {
															if(taskarchivesId == res.data[i].children[j].id) {
																this.$emit('refreshData', '', res.data[i].children[j], '', this.formNum);
																this.$nextTick(() => {
																	this.$refs.tree.setCurrentKey(res.data[i].children[j].id)
																})
															}
														}
													}
													if(taskarchivesId == res.data[i].id) {
														this.$emit('refreshData', '', res.data[i], '', this.formNum);
														this.$nextTick(() => {
															this.$refs.tree.setCurrentKey(res.data[i].id)
														})
													}
												}
											}
											// for(let i = 0; i < res.data.length; i++) {
											// 	if(taskarchivesId == res.data[i].id) {
											// 		this.$emit('refreshData', '', res.data[i], '', this.formNum);
											// 		this.$nextTick(() => {
											// 			this.$refs.tree.setCurrentKey(res.data[i].id)
											// 		})
											// 	}
											// }
										} else {
											this.$emit('refreshData', '', res.data[0],'',this.formNum);
											this.$refs.tree.setCurrentKey(res.data[0].id)
										}
									})
								}
							}
							// if(this.$route.query.formId) {
							// 	for(let i = 0; i < this.formTypes.length; i++) {
							// 		if(this.$route.query.formId == this.formTypes[i].id) {
							// 			this.handleType(i)
							// 		}
							// 	}
							// } else {
							// 	if(index) {
							// 		this.$emit('refreshData', this.year,this.formTypes[index],index);
							// 	} else {
							// 		if(this.formTypes && this.formTypes[0]) this.$emit('refreshData', this.year,this.formTypes[0]);
							// 	}
							// }
							// this.$nextTick(() => {
							// 	if(this.integrityArchives_btn_addFile) this.getInspectionListTreeInfo();
							// })
						} else {
							this.$notify({
								title: '失败',
								message: "获取树结构失败",
								type: 'error',
								duration: 1000
							});
						}
					});
				}
			},
			// 查重
			unique(id) {
				let ary = [];
				ary = this.formsData.filter(item => {
					return item.id == id
				})
				return ary.length ? true : false
			},
			// 同步数据到父页面
			handlePartyBranch(data) {
				// // this.$parent.getFormsData();
				// // this.$nextTick(() => {
				// 	this.$emit('refreshData', this.year, data);
				// 	// this.$emit('refreshData', this.year,data,'');
				// 	// this.getFormId(data.id,'')
				// // })
				this.id = data.id;
				if(this.$route.query.operation == 'oneself') {
					this.getFormId(data.id,'',data.formTypeType,this.formNum)
				} else if(this.$route.query.operation == 'detail' && !this.$route.query.status) {
					this.$emit('refreshData', this.year, data);
				} else {
					this.$emit('refreshData', '', data, '', this.formNum);
				}
			},
			yearChange(e) {
				this.year = e;
				// this.getHiarchivesInfo()
				this.getTreeInfo();
				this.$parent.getHiarchivesInfo(this.id,this.year);
			},
			// 表格
			typePareList() {
				listSimple({
					type: '3,4'
				}).then(res => {
						if (res && res.status === 200) {
							// this.typePareChilds = res.data ? res.data : [];
							// // if(this.typePareChilds && this.typePareChilds[0]) this.$emit('refreshData', this.typePareChilds[0]);
							// if(this.typePareChilds && this.typePareChilds[0]) this.getFormId(this.typePareChilds[0].id,0)
							this.typeData = res.data ? res.data : [];
							if(res.data && res.data[0]) {
								this.getFormId(res.data[0].id,'',res.data[0].formTypeType)
								this.$nextTick(() => {
									this.$refs.tree.setCurrentKey(res.data[0].id)
								})
							}
						} else {
							this.$notify({
								title: '失败',
								message: "获取失败",
								type: 'error',
								duration: 1000
							});
						}
					});

			},

			handleType(index) {
				this.activeIndex = index;
				this.$emit('refreshData', this.year,this.formTypes[index],index);
			},

			// 事前/事后
			handleTypeBeforeOrAfter(index) {
				this.activeIndex = index;
				this.getFormId(this.typePareChilds[index].id,index)
			},
			
			// // 获取动态表单列表
			// getTreeInfo(index) {
			// 	if(!this.$route.query.id) {
			// 		if(this.integrityArchives_btn_addFile) this.getInspectionListTreeInfo();
			// 	} else {
			// 		individualList(this.$route.query.id).then(res => {
			// 			if (res && res.status === 200) {
			// 				this.formTypes = res.data ? res.data : [];
			// 				if(this.$route.query.formId) {
			// 					for(let i = 0; i < this.formTypes.length; i++) {
			// 						if(this.$route.query.formId == this.formTypes[i].id) {
			// 							this.handleType(i)
			// 						}
			// 					}
			// 				} else {
			// 					if(index) {
			// 						this.$emit('refreshData', this.year,this.formTypes[index],index);
			// 					} else {
			// 						if(this.formTypes && this.formTypes[0]) this.$emit('refreshData', this.year,this.formTypes[0]);
			// 					}
			// 				}
			// 				this.$nextTick(() => {
			// 					if(this.integrityArchives_btn_addFile) this.getInspectionListTreeInfo();
			// 				})
			// 			} else {
			// 				this.$notify({
			// 					title: '失败',
			// 					message: "获取动态表单列表失败",
			// 					type: 'error',
			// 					duration: 1000
			// 				});
			// 			}
			// 		});
			// 	}
				
			// },

			getIndex(index) {
				this.activeIndex = index;
			},

			// // 获取纪检添加任务档案列表
			// getInspectionListTreeInfo(index) {
			// 	if(!this.$route.query.userId) return;
			// 	individualInspectionList({
			// 		userId: this.$route.query.userId,
			// 		year: this.year
			// 	},this.$route.query.id ? this.$route.query.id : this.$route.query.userId).then(res => {
			// 			if (res && res.status === 200) {
			// 				if(res.data) {
			// 					for(let i = 0; i < res.data.length; i++) {
			// 						this.formTypes.push(res.data[i])
			// 					}
			// 				}
			// 				// this.formTypes = res.data ? res.data : [];
			// 				// if(index) {
			// 				// 	this.$emit('refreshData', this.formTypes[index],index);
			// 				// } else {
			// 				// 	if(this.formTypes && this.formTypes[0]) this.$emit('refreshData', this.formTypes[0]);
			// 				// }
			// 			} else {
			// 				this.$notify({
			// 					title: '失败',
			// 					message: "获取动态表单列表失败",
			// 					type: 'error',
			// 					duration: 1000
			// 				});
			// 			}
			// 		});
			// },

			// 获取动态表单列表(纪检)
			addFileHandle() {
				this.addFileVisible = true
				this.$nextTick(() => {
					this.$refs.addFile.init();
				})
				// individualInspectionList(this.$route.query.id).then(res => {
				// 		if (res && res.status === 200) {
				// 			this.formTypesIns = res.data ? res.data : [];
				// 			this.addible = false;
				// 			// if(index) {
				// 			// 	this.$emit('refreshData', this.formTypes[index],index);
				// 			// } else {
				// 			// 	if(this.formTypes && this.formTypes[0]) this.$emit('refreshData', this.formTypes[0]);
				// 			// }
				// 		} else {
				// 			this.$notify({
				// 				title: '失败',
				// 				message: "获取动态表单列表失败",
				// 				type: 'error',
				// 				duration: 1000
				// 			});
				// 		}
				// 	});
			},

			// // 获得人员历史档案列表
			// getHiarchivesInfo(index) {
			// 	if(!this.$route.query.userId) return;
			// 	hiarchivesList({userId: this.$route.query.userId,year: this.year},this.$route.query.userId).then(res => {
			// 			if (res && res.status === 200) {
			// 				this.formTypes = res.data ? res.data : [];
			// 				if(this.$route.query.formId) {
			// 					for(let i = 0; i < this.formTypes.length; i++) {
			// 						if(this.$route.query.formId == this.formTypes[i].id) {
			// 							this.handleType(i)
			// 						}
			// 					}
			// 				} else {
			// 					if(index) {
			// 						this.$emit('refreshData', this.year,this.formTypes[index],index);
			// 					} else {
			// 						if(this.formTypes && this.formTypes[0]) this.$emit('refreshData', this.year,this.formTypes[0]);
			// 						else this.$emit('refreshData', this.year,{
			// 							actualCommitTime: '',
			// 							formConf: '',
			// 							formFields: '',
			// 							formName: '',
			// 							formVariables: '',
			// 							id: '',
			// 							lastTimeFormVariable: '',
			// 						});
			// 					}
			// 				}
			// 				this.$nextTick(() => {
			// 					if(this.integrityArchives_btn_addFile) this.getInspectionListTreeInfo();
			// 				})
			// 			} else {
			// 				this.$notify({
			// 					title: '失败',
			// 					message: "获取动态表单列表失败",
			// 					type: 'error',
			// 					duration: 1000
			// 				});
			// 			}
			// 		});
			// },

			getFormId(val,index,formTypeType,formNum) {
				getForm(val).then(response => {
					this.data = {
						...response.data,
						formConf: response.data.conf,
						formFields: response.data.fields,
						formName: response.data.name,
					}
					if(this.operation == 'oneself') {
						this.$emit('refreshData', '',this.data,formTypeType,formNum);
					} else {
						this.formTypes.push(this.data)
						this.activeIndex = this.formTypes.length-1;
						this.$emit('refreshData', this.year,this.data,this.formTypes.length-1,this.data.type);
					}
					// this.form = {
					// 	id: data.id,
					// 	name: data.name,
					// 	status: data.status,
					// 	remark: data.remark,
					// 	type: data.type
					// }
					// let jsonData = {
					// 	config: undefined,
					// 	list: []
					// }
					// jsonData.config = JSON.parse(data.conf);
					// data.fields.forEach(item => {
					// 	jsonData.list.push(JSON.parse(item));
					// })
					// this.$refs.kfd.handleSetData(jsonData);
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.item-box {
		width: 278px;
		// border: 0.0625rem solid #E4E4E4;

		.item-info {
			height: 45px;
			line-height: 45px;
			border-bottom: 0.0625rem solid #E4E4E4;
			padding: 0 18px;
			font-size: 18px;
		}

		.item-info:hover {
			cursor: pointer;
			// background-color: #1070E1;
			background-color: #bc0000;
			color: #FFFFFF;
		}

		>>> .el-tree-node__content {
			height: 46px;
		}
		
		.node-tab {
			// margin-left: 20px;
			// margin-top: 20px;

			// .redMarker {
			// 	width: 8px;
			// 	height: 8px;
			// 	border: 2px solid #fe4800;
			// 	border-radius: 4px;
			// }

			// text-align: right;

			>>> .el-tag {
				height: 25px;
				line-height: 25px;
				font-size: 10px;
				// opacity: 0.4;
			}

			>>> .el-tag--plain.el-tag--info {
				background-color: #fff4ee;
				border-color: #fd7311;
				color: #fd7311;
			}
		}

		.redMarker {
			display: inline-block;
			width: 10px;
			height: 10px;
			border: 1px solid rgb(184, 181, 181);
			border-radius: 5px;
			margin-right: 5px;
		}

		.isredMarker {
			display: inline-block;
			width: 10px;
			height: 10px;
			border: 1px solid rgb(184, 181, 181);
			background-color: #bc0000;
			border-radius: 5px;
			margin-right: 5px;
		}
	}

	/* 滚动容器 */
	.containers {
		// max-height: calc(100vh - 222px);
		overflow: auto;
		height: calc(100vh - 330px);

		>>> .el-tree {
			width: fit-content;
		}

		>>> .el-tree__empty-block {
			width: 250px;
		}

		// &::-webkit-scrollbar {
		// 	width: 4px;
		// 	height: 4px;
		// 	display: block;
		// }
		// &::-webkit-scrollbar-track {
		// 	background: rgb(239, 239, 239);
		// }
		// &::-webkit-scrollbar-thumb {
		// 	background: #dadada;
		// 	border-radius: 2px;
		// }

		// &::-webkit-scrollbar-thumb:hover {
		// 	background: #c3c3c3;
		// }

		// &.expend {
		// 	height: calc(100% - 70px);
		// }
	}
	
	.active-item {
		// background-color: #1070E1;
		background-color: #bc0000;
		color: #FFFFFF;
	}


	.show-a-line {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.not-show-line {
		border: 0 !important;
	}

	.item-button {
		margin-top: 20px;
	}

	.custom-tree-node {
		flex: 1;
		display: flex;
		align-items: center;
		/* justify-content: space-between; */
		font-size: 14px;
		padding-right: 8px;
		/* font-family: "楷体" !important; */
		/* Helvetica Neue, Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif */
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.custom-tree-node-content {
		// flex: 1;
		display: flex;
		// align-items: center;
		// justify-content: space-between;
		// font-size: 14px;
		// padding-right: 8px;
		// white-space: nowrap;
		// overflow: hidden;
		// text-overflow: ellipsis;
		// /* font-family: "楷体" !important; */
		// /* Helvetica Neue, Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif */

		// span {
		// 	overflow: hidden;
		// 	white-space: nowrap;
		// 	text-overflow: ellipsis;
		// }
	}
</style>
