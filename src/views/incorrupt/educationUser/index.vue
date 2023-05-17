<template>
	<div class="content">
        <EducationUserVue/>
	</div>
</template>

<script>
    import EducationUserVue from './EducationUser.vue'
	export default {
        components: {EducationUserVue},
		data() {
			return {

			}
		},
		created() {
			window.open('#/educationUser')
		},
	}
</script>

<style lang="scss" scoped>

</style>
