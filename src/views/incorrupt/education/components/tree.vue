<template>
	<div class="custom-tree-container">
		<div>
			<div class="left-content left-containers goback-info">
				<div class="leader-item" v-for="(item,index) in dataList" :key="index" :ref="`leaderItem${index+1}`" @click="leaderHandle(item,index+1)">{{item.name}}</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		leftList
	} from 'api/incorrupt/education/index';
	export default {
		data() {
			return {
				changecolor: false,
				dataList: [{
					name: "全部",
					id: 0
				}],
				obj: {},
				domVal: 1
			}
		},

		created() {
			this.getList();
		},

		mounted() {
			this.$nextTick(() => {
				this.checkedStatus(this.domVal);
			});
		},

		methods: {
			// 获取列表
			getList() {
				this.listLoading = true;
				leftList()
					.then(response => {
						if (response && response.code === 0) {
							for(let i = 0; i < response.data.length; i++) {
								if(response.data[i].name !== '首页') this.dataList.push(response.data[i]);
							}
							// this.dataList.push.apply(this.dataList, response.data);
						} else {}
					}).catch(() => {})
			},

			// 点击左侧按钮展示不同信息
			leaderHandle(val, index) {
				if (this.domVal && index != this.domVal) this.cancelStatus(this.domVal);
				this.checkedStatus(index);
				this.domVal = index;
				this.obj = val;
				// 同步数据到父页面
				this.$emit('refreshData', val);
			},
			// 选中
			checkedStatus(index) {
				this.$refs[`leaderItem${index}`][0].style.backgroundColor = '#bc0000';
				this.$refs[`leaderItem${index}`][0].style.color = '#FFFFFF';
			},

			// 取消选中
			cancelStatus(index) {
				this.$refs[`leaderItem${index}`][0].style.backgroundColor = '#FFFFFF';
				this.$refs[`leaderItem${index}`][0].style.color = '#000000';
			},
		}
	};
</script>

<style lang="scss" scoped>
	.custom-tree-container {
		border: 0.0625rem solid #EAEAEA;
		width: 210px;

		/* 滚动容器 */
		.left-containers {
			max-height: 600px;
			overflow: auto;
		}

		.leader-item {
			height: 50px;
			line-height: 50px;
			text-align: center;
			border-bottom: 0.0625rem solid #EAEAEA;
			font-size: 15px;
			color: #000000;
			font-weight: 600;
			cursor: pointer
		}

		.leader-item:hover {
			background-color: #bc0000 !important;
			color: #FFFFFF !important;
		}
	}
</style>
