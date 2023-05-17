<template>
  <div class="statis-card" :style="`background-color: ${bgColor}`">
    <div class="wrapper">
      <div class="main">
        <div class="title">{{title}}</div>
        <div class="num-wrapper">
          <countTo
            :startVal='0'
            :endVal='num'
            :duration='2000'
            class="value"
            :style="`color: ${valueColor}`">
          </countTo>
          <span class="unit">{{unit}}</span>
        </div>
      </div>
      <div class="extra">
        <img v-if="imgSrc" :src="imgSrc" alt="">
      </div>
    </div>
  </div>
</template>

<script>
	import countTo from 'vue-count-to';
  // export const cardStyle = [
  //   { bgColor: '#f0f6ff', valueColor: '#3b88ff', imgSrc: require('@/assets/img/icon_personal.png') },
  //   { bgColor: '#f4effc', valueColor: '#752fdd', imgSrc: require('@/assets/img/icon_points.png') },
  //   { bgColor: '#fff4ee', valueColor: '#fd7311', imgSrc: require('@/assets/img/icon_company.png') },
  //   { bgColor: '#edfaf7', valueColor: '#08c18c', imgSrc: require('@/assets/img/icon_personal.png') }
  // ]
  export default {
    name:'StatisCard',
    components: {
      countTo
    },
    props: {
      title: {
        type: String,
        required: true
      },
      num: {
        type: Number,
        default: 0
      },
      unit: {
        type: String,
        default: '',
      },
      imgSrc: {
        type: String
      },
      bgColor: {
        type: String,
        default: '#fff'
      },
      valueColor: {
        type: String,
        default: 'inherit'
      }
    }
  }
</script>

<style lang="scss" scoped>
  .statis-card {
    height: 90px;
    min-width: 200px;
    width: 400px;
    background-color: aquamarine;
    border-radius: 4px;
    padding: 0 20px;
    .wrapper {
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .main {
      color: #666;
      .title {
        font-size: 16px;
        font-weight: bold;
      }
      .value {
        font-size: 24px;
        font-weight: bold;
      }
    }
  }
</style>