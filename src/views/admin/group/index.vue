<template>
	<div class="app-container">
		<div class="page-content">
			<el-tabs style='margin-top:15px;' v-model="activeName">
				<el-tab-pane v-for="item in tabMapOptions" :label="item.name" :key='item.id' :name="item.code">
					<keep-alive>
						<tab-pane v-if='activeName==item.code' :type='item.id' :depType='item.type' :name='item.name' :code='item.code'></tab-pane>
					</keep-alive>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script>
	import tabPane from './components/groupDetail';
	import {
		getAllGroupTypes
	} from 'api/admin/group/index';
	export default {
		name: 'group',
		components: {
			tabPane
		},
		data() {
			return {
				tabMapOptions: [],
				activeName: 'role'
			}
		},
		created() {
			this.fetchData();
		},
		methods: {
			fetchData() {
				getAllGroupTypes().then(data => {
					this.tabMapOptions = data;
				});
			}
		}
	}
</script>

<style scoped>
	.tab-container {
		margin: 30px;
	}
</style>
