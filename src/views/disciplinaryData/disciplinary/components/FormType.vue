<template>
	<div class="content-types goback-info">
		<div class="item-box containers roll-containers">
			<div class="item-info show-a-line"
				:class="{'active-item': activeIndex === index, 'not-show-line': index === formTypes.length - 1}"
				v-for="(item, index) in formTypes" :key="index" @click="handleType(index)" v-waves>
				{{item.formName}}
			</div>
		</div>
	</div>
</template>

<script>
	import {
		individualList
	} from 'api/archives/index';
	export default {
		data() {
			return {
				activeIndex: 0,
				formTypes: []
			}
		},
		
		created() {
			this.getTreeInfo();
			// // 获取表单类型
			// this.getDataDicts("oainfo").then((res) => {
			// 	this.formTypes = res;
			// });
		},

		mounted() {
			// this.getTreeInfo();
			// this.$nextTick(() => {
			// 	this.handleType(this.activeIndex);
			// })
		},

		methods: {
			handleType(index) {
				this.activeIndex = index;
				this.$emit('refreshData', this.formTypes[index],index);
			},
			
			// 获取动态表单列表
			getTreeInfo(index) {
				individualList(this.$route.query.id).then(res => {
						if (res && res.status === 200) {
							this.formTypes = res.data ? res.data : [];
							if(index) {
								this.$emit('refreshData', this.formTypes[index],index);
							} else {
								if(this.formTypes && this.formTypes[0]) this.$emit('refreshData', this.formTypes[0]);
							}
						} else {
							this.$notify({
								title: '失败',
								message: "获取动态表单列表失败",
								type: 'error',
								duration: 1000
							});
						}
					});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.item-box {
		width: 367px;
		border: 0.0625rem solid #E4E4E4;

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
			background-color: #005598;
			color: #FFFFFF;
		}
	}

	/* 滚动容器 */
	.containers {
		max-height: calc(100vh - 222px);
	}
	
	.active-item {
		// background-color: #1070E1;
		background-color: #005598;
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
</style>
