<template>
  <div>
    <div>
      <el-form>
        <el-form-item label="Fade In To">
          <el-checkbox v-model="randomFadeInLength" @change="changeRandomizeFadeInLength">Randomize</el-checkbox><br/>
          <el-slider v-model="fadeInLength" :min="0" :max="fadeInMax" :step="0.01" v-if="!randomFadeInLength" show-input/>

          <span v-if="randomFadeInLength">{{ fadeInLength[0] }} - {{ fadeInLength[1] }}</span>
          <el-slider v-model="fadeInLength" range :min="0" :max="fadeInMax" :step="0.01" v-if="randomFadeInLength"/>
        </el-form-item>

        <el-form-item label="Fade Out From">
          <el-checkbox v-model="randomFadeOutLength" @change="changeRandomizeFadeOutLength">Randomize</el-checkbox><br/>
          <el-slider v-model="fadeOutLength" :min="fadeOutMin" :max="1" :step="0.01" v-if="!randomFadeOutLength" show-input/>

          <span v-if="randomFadeOutLength">{{ fadeOutLength[0] }} - {{ fadeOutLength[1] }}</span>
          <el-slider v-model="fadeOutLength" range :min="fadeOutMin" :max="1" :step="0.01" v-if="randomFadeOutLength"/>
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
      randomFadeInLength: false,
      randomFadeOutLength: false
    }
  },

  computed: {
    fadeInMax () {
      if (this.randomFadeOutLength) {
        return this.fadeOutLength[0]
      }

      return this.fadeOutLength
    },

    fadeOutMin () {
      if (this.randomFadeInLength) {
        return this.fadeInLength[1]
      }

      return this.fadeInLength
    },

    fadeInLength: {
      get () {
        let val = this.$store.getters.funcValue(this.soundId, this.funcType, 'Fader', 'fade_in_length')
        return this.randomFadeInLength ? val : val[0]
      },

      set (val) {
        this.$store.commit('SET_FUNC_VALUE', [ this.soundId, this.funcType, 'Fader', 'fade_in_length', this.randomFadeInLength ? val : [val, val] ])
      }
    },

    fadeOutLength: {
      get () {
        let val = this.$store.getters.funcValue(this.soundId, this.funcType, 'Fader', 'fade_out_length')
        return this.randomFadeOutLength ? val : val[0]
      },

      set (val) {
        this.$store.commit('SET_FUNC_VALUE', [ this.soundId, this.funcType, 'Fader', 'fade_out_length', this.randomFadeOutLength ? val : [val, val] ])
      }
    }
  },

  methods: {
    changeRandomizeFadeInLength (value) {
      if (value) {
        if (this.fadeInLength[1] <= this.fadeInLength[0]) {
          this.fadeInLength[1] = this.fadeInLength[0] + 1
        }
      } else {
        this.fadeInLength = this.fadeInLength
      }
    },

    changeRandomizeFadeOutLength (value) {
      if (value) {
        if (this.fadeOutLength[1] <= this.fadeOutLength[0]) {
          this.fadeOutLength[1] = this.fadeOutLength[0] + 1
        }
      } else {
        this.fadeOutLength = this.fadeOutLength
      }
    }
  },

  created () {
    this.randomFadeInLength = this.fadeInLength[0] !== this.fadeInLength[1]
    this.randomFadeOutLength = this.fadeOutLength[0] !== this.fadeOutLength[1]
  }
}
</script>

<style>
</style>
