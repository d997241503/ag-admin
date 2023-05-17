<template>
  <div class="dashboard-container">
    <component v-bind:is="currentRole"> </component>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import Inspection from './inspection';
  import InspectionOrSubsidiary from './inspectionOrSubsidiary';

  export default {
    name: 'dashboard',
    components: { Inspection, InspectionOrSubsidiary },
    data() {
      return {
		currentRole: '',
		large_btn_inspection: false,
		large_btn_subsidiary: false
      }
    },
	created() {
			// 获取权限
			this.large_btn_inspection = this.elements['large:btn_inspection'];
			this.large_btn_subsidiary = this.elements['large:btn_subsidiary'];
			// this.integrityArchives_btn_inspection = false;
			this.$nextTick(() => {
				if(this.large_btn_inspection) {
					this.currentRole = 'Inspection';
				} else if(this.large_btn_subsidiary) {
					this.currentRole = 'InspectionOrSubsidiary';
				}
			})
		},
    computed: {
      ...mapGetters([
        'name',
        'avatar',
        'email',
        'introduction',
		'elements'
      ])
    }
  }
</script>
