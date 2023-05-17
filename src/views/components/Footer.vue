<template>
	<div :style="siteContentisFooter" :class="$route.matched.length == 2 && $route.matched[1].name == '首页'?'isFooter':'footer '">湘ICP备20010210号-1版权所有 ©️ 2022 长沙城市发展集团有限公司</div>
</template>

<script>
	import { mapGetters } from 'vuex';
	export default {
		computed: {
			...mapGetters([
				'permission_routers',
				'sidebar'
			]),
			siteContentisFooter() {
                return this.sidebar.opened
                        ? {
                            'padding-right': '230px',
                            'padding-left': '230px'
                        }
                        : {
                            "padding-right": '35px',
                            "padding-left": '35px'
                        }
			}
		},
	}
</script>

<style scoped>
	.footer {
		width: 100%;
		height: 40px;
		line-height: 40px;
		background-color: #222222 !important;
		color: #ffffff;
		font-size: 14px;
		text-align: center;
		position: absolute;
		left: 0px;
		z-index: 1001;
		/* position: absolute;
		bottom: 0;
		left: 0;
		z-index: 1032; */
		/* z-index: 1001; */
		/* box-shadow: 0 10px 10px #e3e2e8;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none; */
	}
	.isFooter {
		width: 100%;
		height: 40px;
		line-height: 40px;
		background-color: #222222 !important;
		color: #ffffff;
		font-size: 14px;
		text-align: center;
		z-index: 1022;
		position: fixed;
	}
</style>
