<template>
	<div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
		<sidebar :class="sidebarClass"></sidebar>
		<div class="main-container">
			<navbar></navbar>
			<app-main></app-main>
		</div>
		<!-- <Footer ref="footer" style="background-color: #E5E5E5;"></Footer> -->
	</div>
</template>

<script>
	import Footer from 'views/components/Footer';
	import {
		Navbar,
		Sidebar,
		AppMain
	} from 'views/layout';

	export default {
		name: 'layout',
		components: {
			Navbar,
			Sidebar,
			AppMain,
			Footer
		},
		computed: {
			sidebar() {
				return this.$store.state.app.sidebar;
			},
            sidebarClass() {
                return [
                    'sidebar-container',
                    this.$route.name === '首页' ? '' : 'expend'
                ]
            }
		},
		mounted() {
			this.resetDocumentClientHeight();
		},
		methods: {
			// 重置窗口可视高度
			resetDocumentClientHeight() {
				this.$store.commit('SET_DOCUMENT_CLIENT_HEIGHT', document.documentElement['clientHeight']);
				window.onresize = () => {
					this.$store.commit('SET_DOCUMENT_CLIENT_HEIGHT', document.documentElement['clientHeight']);
				}
			}
		}
	}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/mixin.scss";

	.app-wrapper {
		@include clearfix;
		position: relative;
		// height: 100%;
		width: 100%;
		background-color: rgb(245, 245, 245);

		&.hideSidebar {
			.sidebar-container {
				width: 36px;
				overflow: inherit;
			}

			.main-container {
				// margin-left: 36px;
			}
		}

		.sidebar-container {
			height: calc(100% - 110px);
			position: fixed;
			top: 0;
			bottom: 0;
			left: 0;
			z-index: 1001;
			overflow-y: auto;

            &::-webkit-scrollbar {
                width: 4px;
                display: block;
            }
            &::-webkit-scrollbar-track {
                background: rgb(239, 239, 239);
            }
            &::-webkit-scrollbar-thumb {
                background: #dadada;
                border-radius: 2px;
            }

            &::-webkit-scrollbar-thumb:hover {
                background: #c3c3c3;
            }

            &.expend {
			    height: calc(100% - 70px);
            }
        }

		.main-container {
			min-height: 100%;
			transition: margin-left 0.28s ease-out;
			// margin-left: 210px;
			// margin-bottom: 40px;
		}
	}
</style>
