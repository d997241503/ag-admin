<template>
  <div class="tooltip-wrap">
    <div v-show="false"><slot name="text"></slot></div>
    <el-tooltip
      ref="tlp"
      :content="text"
      effect="dark"
      :disabled="!tooltipFlag"
      :placement="placement"
    >
      <p class="over-flow" @mouseenter="visibilityChange($event)">
        <template v-if="text">{{ text }}</template>
        <!-- <template v-else><slot name="up"></slot></template> -->
    </p>
    </el-tooltip>
  </div>
</template>
 
<script>
export default {
  name: "Tooltip",
  props: {
    text: { type: String, default: "" }, // 字符内容
    placement: { type: String, default: "top-start" },
    className: { type: String, default: "text" }, // class
  },
  data() {
    return {
      disabledTip: false,
      tooltipFlag: false,
    };
  },
  mounted() {
    if(this.$slots.text) this.text = this.$slots.text[0].elm.innerText
    // console.log("this.$slots.text",this.$slots.text[0].elm.innerText)
  },
  methods: {
    // tooltip的可控
    visibilityChange(event) {
      const ev = event.target;
      const ev_weight = ev.scrollWidth; // 文本的实际宽度
      const content_weight = this.$refs.tlp.$el.parentNode.clientWidth; // 文本容器宽度(父节点)
      if (ev_weight > content_weight) {
        // 文本宽度 > 实际内容宽度  -->内容溢出,则显示悬浮
        this.tooltipFlag = true;
      } else {
        // 否则为未溢出，不显示悬浮
        this.tooltipFlag = false;
      }
    },
  },
};
</script>
 
<style lang="scss">
.tooltip-wrap {
  height: 26; // 必须要有高度设置（高度可根据实际情况调整），因为tooltip的显示条件是通过高度来判断的
}
// 一行
.over-flow {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: break-all; //英文数字折行
}
// 两行
.over-flow2 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
 
p {
  width: 100%;
  margin: 0;
}
</style>