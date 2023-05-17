<template>
	<section class="app-main" :style="siteContentViewHeight">
		<div :style="transitionMinViewHeight">
			<transition name="fade" mode="out-in">
				<router-view :key="key" :style="siteContentViewLeft"></router-view>
			</transition>
		</div>
		<Footer ref="footer" style="background-color: #E5E5E5;"></Footer>
		<!-- <Footer v-else ref="footer" style="background-color: #E5E5E5;padding-left: 230px;"></Footer> -->
	</section>
</template>

<script>
	import Footer from 'views/components/Footer';
	import { mapGetters } from 'vuex';
	export default {
		name: 'AppMain',
		computed: {
			...mapGetters([
				'permission_routers',
				'sidebar'
			]),
			key() {
				return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
			},
			siteContentViewHeight() {
				var height = this.$store.state.user.documentClientHeight - 60 -100;
				return {
					'minHeight': height + 'px',
					'background-color': '#F5F5F5'
				}
			},
			transitionMinViewHeight() {
				var height = this.$store.state.user.documentClientHeight - 60 -100;
				return {
					'minHeight': height + 'px',
				}
			},
			siteContentViewLeft() {
				// var left = undefined;
				if(this.sidebar.opened) {
					return {
                        'padding-left': '230px'
                    }
				} else {
					return {
                        'padding-left': '35px'
                    }
				}
			},
		},
		components: {
			Footer
		},
		created() {
		}
	}
</script>

<style scoped>
	
	.app-main {
		margin-top: 120px
	}
</style>
