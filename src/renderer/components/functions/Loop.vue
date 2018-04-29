<template>
  <div>
    <el-form>
      <el-form-item label="">
        <el-checkbox v-model="forever" @change="changeForever">Forever</el-checkbox>
      </el-form-item>
      <el-form-item label="">
        <el-checkbox v-model="random" v-if="!forever" @change="changeRandomize">Randomize</el-checkbox>
      </el-form-item>
    </el-form>

    <div v-if="random && !forever">
      <el-form>
        <el-form-item label="Minimum">
          <el-input-number v-model="min" :min="1" :max="max"></el-input-number>
        </el-form-item>
        <el-form-item label="Maximum">
          <el-input-number v-model="max" :min="min"></el-input-number>
        </el-form-item>
      </el-form>
    </div>

    <div v-if="!random && !forever">
      <el-form>
        <el-form-item label="Times">
          <el-input-number v-model="min" :min="1"></el-input-number>
        </el-form-item>
      </el-form>
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
      random: false,
      forever: false
    }
  },

  computed: {
    min: {
      get () {
        let val = this.$store.getters.funcValue(this.soundId, this.funcType, 'Loop', 'times')
        return val[0]
      },

      set (val) {
        this.$store.commit('SET_FUNC_VALUE', [ this.soundId, this.funcType, 'Loop', 'times', this.random ? [val, this.max] : [val, val] ])
      }
    },

    max: {
      get () {
        let val = this.$store.getters.funcValue(this.soundId, this.funcType, 'Loop', 'times')
        return val[1]
      },

      set (val) {
        this.$store.commit('SET_FUNC_VALUE', [ this.soundId, this.funcType, 'Loop', 'times', [this.min, val] ])
      }
    }
  },

  methods: {
    changeForever (value) {
      console.log(value)
      if (value) {
        this.min = 0
        this.max = 0
      }
    },

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
    this.random = this.min !== this.max
    this.forever = this.min === 0
  }
}
</script>

<style>
</style>
