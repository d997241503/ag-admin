<template>
	<div class="content goback-info">
		<!-- {{navObj}} -->
		<div v-if="navObj.children.length && !color">
			<div :class="'menu-item ' + matchClass(index)" v-for="(item,index) in navObj.children" :key="index" @click="handleMenu(item,index + 1)">
				<!-- {{index}} -->
				<div class="menu-text" :ref="`menuText${index + 1}`">{{item.name}}</div>
			</div>
		</div>
		<div v-else class="menu-item menu-first" :class="[color ? 'body-color' : '']" style="font-size: 18px;height: 35px;">
			<div class="menu-text">{{navObj.name}}</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				changecolor: false,
				domVal: 1
			}
		},
		props: {
			navObj: {
				type: Object
			},
			color: {
				type: String
			}
		},
		computed: {
			// 匹配样式
			matchClass() {
				return (index) => {
					if (index === 0) return "menu-first";
					if (index % 2) return "menu-other-left";
					else return "menu-other-right";
				}
			},
		},
		watch: {
			navObj(newVal, oldVal) {
				this.navObj = newVal;
			},
			color(newVal, oldVal) {
				this.navObj = newVal;
			}
		},

		mounted() {
			this.$nextTick(() => {
				// this.checkedStatus(this.domVal);
				this.init();
			})
		},

		methods: {
			// 初始化选中状态
			init() {
				this.domVal = 1;
				this.navObj.children.forEach((item, index) => {
					this.cancelStatus(index + 1);
				})
				this.checkedStatus(this.domVal);
			},

			// 同步数据到父级模块
			handleMenu(val, index) {
				if (this.domVal && index != this.domVal) this.cancelStatus(this.domVal);
				this.checkedStatus(index);
				this.domVal = index;
				this.$emit("refreshData", val);
			},
			// 选中
			checkedStatus(index) {
				if(this.$refs[`menuText${index}`] && this.$refs[`menuText${index}`][0]) this.$refs[`menuText${index}`][0].style.textDecoration = 'underline';
			},

			// 取消选中
			cancelStatus(index) {
				if(this.$refs[`menuText${index}`] && this.$refs[`menuText${index}`][0]) this.$refs[`menuText${index}`][0].style.textDecoration = '';
			},
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		width: 100%;
		padding: 10px 60px 10px 30px;
		background-color: #FFFFFF;
		text-align: center;
		float: left;

		.menu-item:hover {
			cursor: pointer;
		}

		.menu-first {
			background-color: #0b3b9d;
			font-size: 30px;
			letter-spacing: 2px;
			height: 80px;
			font-weight: bold;
			color: #FFFFFF;
			margin-top: 20px;
			margin-bottom: 20px;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.body-color {
			width: 110px;
    		min-width: 110px;
			background-color: #FFFFFF;
			color: #184f91;
			font-style: italic;
		}

		.menu-other-left {
			width: 47%;
			float: left;
			height: 80px;
			margin-bottom: 20px;
			background-color: #E4E4E4;
			font-size: 20px;
			color: #D92927;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.menu-other-right {
			width: 47%;
			float: right;
			height: 80px;
			// line-height: 80px;
			margin-bottom: 20px;
			background-color: #E4E4E4;
			font-size: 20px;
			color: #D92927;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>
