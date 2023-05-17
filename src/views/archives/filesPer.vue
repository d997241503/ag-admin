<template>
  <div class="dashboard-container">
    <component v-bind:is="currentRole"> </component>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import InspectionFilesPer from './inspectionFilesPer';
  import NonInspectionFilesPer from './nonInspectionFilesPer';

  export default {
    name: 'dashboard',
    components: { InspectionFilesPer, NonInspectionFilesPer },
    data() {
      return {
        currentRole: '',
        integrityArchives_btn_inspection: false,
        integrityArchives_btn_first: false,
        integrityArchives_btn_m6high: false
      }
    },
	created() {
			// 获取权限
      this.integrityArchives_btn_inspection = this.elements['integrityArchives:btn_inspection'];
      this.integrityArchives_btn_first = this.elements['integrityArchives:btn_first'];	
			this.integrityArchives_btn_m6high = this.elements['integrityArchives:btn_m6high'];
			this.$nextTick(() => {
				if(this.integrityArchives_btn_inspection || this.integrityArchives_btn_first) this.currentRole = 'InspectionFilesPer';
				else if(this.integrityArchives_btn_m6high) this.currentRole = 'NonInspectionFilesPer';
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
