<template>
  <div>
    <el-checkbox v-model="random" @change="changeRandomize">Randomize</el-checkbox>

    <div v-if="random" style="text-align: center;">
      <span>{{ this.value[0] }}</span>% -
      <span>{{ this.value[1] }}</span>%
      <el-slider v-model="value" range :min="0" :max="100" :step="1" show-tooltip></el-slider>
    </div>
    <div v-else>
      <span>{{ this.value }}</span>%
      <el-slider v-model="value" :min="0" :max="100" :step="1"></el-slider>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    soundId: Number,
    funcType: String
  },

  data () {
    return {
      random: false
    }
  },

  computed: {
    value: {
      get () {
        let val = this.$store.getters.funcValue(this.soundId, this.funcType, 'Volume', 'value')
        console.log(val)
        return this.random ? [val[0] * 100.0, val[1] * 100.0] : val[0] * 100.0
      },

      set (val) {
        this.$store.commit('SET_FUNC_VALUE', [ this.soundId, this.funcType, 'Volume', 'value', this.random ? [val[0] / 100.0, val[1] / 100.0] : [val / 100.0, val / 100.0] ])
      }
    }
  },

  methods: {
    changeRandomize (value) {
      if (value) {
        if (this.max <= this.min) {
          this.max = this.min + 1
        }
      } else {
        this.max = this.min
      }
    }
  },

  created () {
    let val = this.$store.getters.funcValue(this.soundId, this.funcType, 'Volume', 'value')
    this.random = val[0] !== val[1]
  }
}
</script>

<style>
</style>
