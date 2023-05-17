<template>
	<div class="content">
		<div v-if="isIndex">
			<div v-if="indexList.recordValues && indexList.recordValues.length">
				<el-row :class="[!isGreater ? 'color-white' : 'color-black']" v-for="(item,index) in indexList.recordValues" :key="index">
					<div class="list-item" :class="[!isGreater ? 'color-white' : 'color-black']">
						<el-col class="item-icon" :span="1"><i class="el-icon-caret-right" :class="[!isGreater ? 'color-white' : 'color-black']"></i></el-col>
						<el-col class="item-info" :span="18">
							<div @click="handleArticle(item,'首页')">{{item.educationName}}<span v-show="item.flag === '0'"> -- {{item.deptName}}</span></div>
						</el-col>
						<el-col class="item-text" :span="5">{{item.releaseTime}}</el-col>
					</div>
				</el-row>
			</div>
			<div v-if="!indexList.recordValues && indexList.children && indexList.children.length">
				<el-row :class="[!isGreater ? 'color-white' : 'color-black']" v-for="(item,index) in indexList.children" :key="index">
					<div v-if="item.recordValues && item.recordValues.length">
						<div v-for="(items,indexs) in item.recordValues" :key="indexs">
							<div v-if="count(items)" class="list-item" :class="[!isGreater ? 'color-white' : 'color-black']">
								<el-col class="item-icon" :span="1"><i class="el-icon-caret-right" :class="[!isGreater ? 'color-white' : 'color-black']"></i></el-col>
								<el-col class="item-info" :span="18">
									<div @click="handleArticle(items,'首页')">{{items.educationName}}<span v-show="items.flag === '0'"> -- {{items.deptName}}</span></div>
								</el-col>
								<el-col class="item-text" :span="5">{{items.releaseTime}}</el-col>
							</div>
						</div>
					</div>
				</el-row>
			</div>
		</div>
		<div v-if="!isIndex">
			<el-row class="list-item" v-for="(item,index) in list" :key="index">
				<el-col class="item-icon" :span="1"><i class="el-icon-caret-right"></i></el-col>
				<el-col class="item-info" :span="20">
					<div @click="handleArticle(item)">{{item.educationName}}<span v-show="item.flag === '0'"> -- {{item.deptName}}</span></div>
				</el-col>
				<el-col class="item-text" :span="3">{{item.crtTime}}</el-col>
			</el-row>
			<el-divider></el-divider>
			<div class="pagination-container" style="margin-top: -10px;">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
				:page-sizes="[15]" :page-size="listQuery.limit" align="right" layout="total, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		clientPage
	} from 'api/incorrupt/education/index';
	export default {
		data() {
			return {
				listQuery: {
					categoryId: undefined,
					page: 1,
					limit: 10
				},
				list: [],
				total: 0,
				// 类型
				articleTypes: [{
					value: '文字条例',
					code: '0'
				}, {
					value: '图片图解',
					code: '1'
				}, {
					value: '视频',
					code: '2'
				}, {
					value: '外部链接',
					code: '3'
				}],
				// indexList: []
				counts: 0
			}
		},
		// computed: {
		// 	count(val) {
		// 		// // 闭包
		// 		// return (val) => {
		// 		// 	// 获取到对应的类型
		// 		// 	switch (val) {
		// 		// 		case '1':
		// 		// 			return "例行廉政谈话"
		// 		// 			break;
		// 		// 		case '2':
		// 		// 			return "任前廉政谈话"
		// 		// 			break;
		// 		// 		case '3':
		// 		// 			return "提醒谈话"
		// 		// 			break;
		// 		// 		case '4':
		// 		// 			return "约谈"
		// 		// 			break;
		// 		// 		case '5':
		// 		// 			return "批评教育"
		// 		// 			break;
		// 		// 		case '6':
		// 		// 			return "谈话提醒"
		// 		// 			break;
		// 		// 		default:
		// 		// 			break;
		// 		// 	}
		// 		// }
		// 	},
		// },
		props: {
			indexList: {
				type: Array
			},
			isIndex: {
				type: Boolean
			},
			isGreater: {
				type: Boolean
			}
		},
		watch: {
			indexList(newVal, oldVal) {
				this.indexList = newVal;
			},
			isIndex(newVal, oldVal) {
				this.isIndex = newVal;
			},
			isGreater(newVal, oldVal) {
				this.isGreater = newVal;
			}
		},
		// computed: {
		// 	fomatType() {
		// 		// 闭包
		// 		return (val) => {
		// 			// 获取到对应的类型
		// 			if (val == '3') return "-";
		// 			let label = this.articleTypes.filter((item) => {
		// 				return (item.code.indexOf(val) >= 0);
		// 			});
		// 			return label.length ? label[0].value : '';
		// 		}
		// 	}
		// },

		methods: {
			count(val) {
				if(val) {
					this.counts = this.counts + 1;
					if(this.counts > 5) return false;
					else return true;
				}
			},
			init(val, status, page) {
				// 判断当前一级类别是否存在子集，若有子集，取子集第一个元素id
				if (status && val.children && val.children.length) {
					this.listQuery.categoryId = val.children[0].categoryId;
				} else {
					this.listQuery.categoryId = val.categoryId;
				}
				// 初始化当前页数
				this.listQuery.page = page;
				if(!this.isIndex) this.getList();
			},

			// 点击文章
			handleArticle(val,categoryName) {
				if(categoryName) val.categoryName = categoryName;
				// 外部链接直接跳转
				if (val.educationType == '3') {
					window.open(val.files[0].value, '_blank');
				} else {
					this.$emit("refreshData", val);
				}
			},

			// 获取数据列表
			getList() {
				clientPage(this.listQuery)
					.then(response => {
						if (response && response.code === 0) {
							this.list = response.data.rows;
							this.total = parseInt(response.data.total);
						} else {
							this.total = 0;
						}
					}).catch(() => {})
			},

			handleSizeChange(val) {
				this.listQuery.limit = val;
				this.getList();
			},
			handleCurrentChange(val) {
				this.listQuery.page = val;
				this.getList();
			},
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		// background-color: #FFFFFF;
		width: 100%;
		padding: 30px 30px;

		.list-item {
			height: 20px;
			line-height: 20px;
			margin-bottom: 20px;
			font-size: 14px;
			// color: #111111;
		}

		.item-icon {
			color: #777777;
			font-size: 18px;
		}

		.item-info {
			padding-left: 10px;
		}

		.item-info:hover {
			cursor: pointer;
			color: #555555;
		}

		.item-text {
			color: #FFFFFF;
			text-align: right;
		}
	}

	.color-white {
		color: #FFFFFF;
	}

	.color-black {
		color: #111111;
	}
</style>
