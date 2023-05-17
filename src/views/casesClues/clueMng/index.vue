<template>
	<div class="app-container">
		<div class="page-info" ref="pageInfo">
            <PersonalList v-if="tabType === 'personal'" :tabType.sync="tabType"/>
			<UnitList v-else-if="'unit'" :tabType.sync="tabType"/>
		</div>
	</div>
</template>

<script>
    import PersonalList from './PersonalList.vue'
    import UnitList from './UnitList.vue'
	export default {
		name: "ClueMng",
		data() {
			return {
                tabType: 'personal'
			}
		},
		
		components: {
			UnitList, PersonalList
		}
	}
</script>

<style lang="scss" scoped>
	
</style>