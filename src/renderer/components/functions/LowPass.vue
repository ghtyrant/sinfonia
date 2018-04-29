<template>
  <div>
    <div>
      <el-form>
        <el-form-item label="Cutoff Frequency">
          <el-checkbox v-model="randomCutoff" @change="changeRandomizeCutoff">Randomize</el-checkbox><br/>
          <el-input-number v-model="minCutoff" :min="1" v-if="!randomCutoff"></el-input-number> <span v-if="!randomCutoff">Hz</span>
          <el-input-number v-model="minCutoff" :min="1" :max="maxCutoff" v-if="randomCutoff"></el-input-number> <span v-if="randomCutoff">Hz</span>
          <el-input-number v-model="maxCutoff" :min="minCutoff" v-if="randomCutoff"></el-input-number> <span v-if="randomCutoff">Hz</span>
        </el-form-item>
        <el-form-item label="Resonance">
          <el-checkbox v-model="randomResonance" @change="changeRandomizeResonance">Randomize</el-checkbox><br/>
          <el-slider v-model="resonance" :min="0" :max="10" :step="0.01" v-if="!randomResonance" show-input/>
          <span v-if="randomResonance">{{ resonance[0] }} - {{ resonance[1] }}</span>
          <el-slider v-model="resonance" range :min="0" :max="10" :step="0.01" v-if="randomResonance"/>
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
      randomCutoff: false,
      randomResonance: false
    }
  },

  computed: {
    minCutoff: {
      get () {
        let val = this.$store.getters.funcValue(this.soundId, this.funcType, 'LowPass', 'cutoff')
        return val[0]
      },

      set (val) {
        this.$store.commit('SET_FUNC_VALUE', [ this.soundId, this.funcType, 'LowPass', 'cutoff', this.random ? [val, this.maxCutoff] : [val, val] ])
      }
    },

    maxCutoff: {
      get () {
        let val = this.$store.getters.funcValue(this.soundId, this.funcType, 'LowPass', 'cutoff')
        return val[1]
      },

      set (val) {
        this.$store.commit('SET_FUNC_VALUE', [ this.soundId, this.funcType, 'LowPass', 'cutoff', [this.minCutoff, val] ])
      }
    },

    resonance: {
      get () {
        let val = this.$store.getters.funcValue(this.soundId, this.funcType, 'LowPass', 'resonance')
        return this.randomResonance ? val : val[0]
      },

      set (val) {
        this.$store.commit('SET_FUNC_VALUE', [ this.soundId, this.funcType, 'LowPass', 'resonance', this.randomResonance ? val : [val, val] ])
      }
    }
  },

  methods: {
    changeRandomizeCutoff (value) {
      if (value) {
        if (this.maxCutoff <= this.minCutoff) {
          this.maxCutoff = this.minCutoff + 1
        }
      } else {
        this.maxCutoff = this.minCutoff
      }
    },

    changeRandomizeResonance (value) {
      if (value) {
        if (this.maxResonance <= this.minResonance) {
          this.maxResonance = this.minResonance + 1
        }
      } else {
        this.maxResonance = this.minResonance
      }
    }
  },

  created () {
    this.randomCutoff = this.minCutoff !== this.maxCutoff
    this.randomResonance = this.minResonance !== this.maxResonance
  }
}
</script>

<style>
</style>
