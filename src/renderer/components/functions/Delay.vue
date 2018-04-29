<template>
  <div>
    <el-form>
      <el-form-item label="">
        <el-checkbox v-model="random" @change="changeRandomize">Randomize</el-checkbox>
      </el-form-item>
    </el-form>

    <div v-if="random">
      <el-form>
        <el-form-item label="Minimum">
          <el-input-number v-model="min" :min="1" :max="max"></el-input-number> ms
        </el-form-item>
        <el-form-item label="Maximum">
          <el-input-number v-model="max" :min="min"></el-input-number> ms
        </el-form-item>
      </el-form>
    </div>

    <div v-else>
      <el-form>
        <el-form-item label="Delay">
          <el-input-number v-model="min" :min="1"></el-input-number> ms
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
      random: false
    }
  },

  computed: {
    min: {
      get () {
        let val = this.$store.getters.funcValue(this.soundId, this.funcType, 'Delay', 'value')
        return val[0]
      },

      set (val) {
        this.$store.commit('SET_FUNC_VALUE', [ this.soundId, this.funcType, 'Delay', 'value', this.random ? [val, this.max] : [val, val] ])
      }
    },

    max: {
      get () {
        let val = this.$store.getters.funcValue(this.soundId, this.funcType, 'Delay', 'value')
        return val[1]
      },

      set (val) {
        this.$store.commit('SET_FUNC_VALUE', [ this.soundId, this.funcType, 'Delay', 'value', [this.min, val] ])
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
    this.random = this.min !== this.max
  }
}
</script>

<style>
</style>
