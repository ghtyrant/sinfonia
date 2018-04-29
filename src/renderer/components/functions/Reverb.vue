<template>
  <div>
    <div>
      <el-form size="mini" label-position="left">
        <el-form-item :label="name" v-for="(name, index) in Object.keys(this.isRandom)" :key="index">
          <el-checkbox v-model="isRandom[name]" @change="changeRandomizeParameter(name)">Randomize</el-checkbox><br/>
          <div v-if="!isRandom[name]">

            <el-slider v-model="_self[name]" :min="minMax[name][0]" :max="minMax[name][1]" :step="0.01" show-input input-size="mini"/>
          </div>

          <div v-else>
            <span>{{ _self[name][0] }} - {{ _self[name][1] }}</span>
            <el-slider v-model="_self[name]" range :min="minMax[name][0]" :max="minMax[name][1]" :step="0.01"/>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
const PARAMETERS = {
  dry_level: [-10000.0, 0.0],
  room: [-10000.0, 0.0],
  room_lf: [-10000.0, 0.0],
  room_hf: [-10000.0, 0.0],
  decay_time: [0.1, 2.0],
  decay_hf_ratio: [0.1, 2.0],
  reflections_level: [-10000.0, 1000.0],
  reflections_delay: [0.0, 0.3],
  reverb_level: [-10000.0, 2000.0],
  reverb_delay: [0.0, 0.1],
  diffusion: [0.0, 100.0],
  density: [0.0, 100.0],
  hf_reference: [20.0, 20000.0],
  lf_reference: [20.0, 1000.0]
}
function generateComputedProperty (parameterName) {
  return {
    get () {
      let val = this.$store.getters.funcValue(this.soundId, this.funcType, 'Reverb', parameterName)
      return this.isRandom[parameterName] ? val : val[0]
    },

    set (val) {
      this.$store.commit('SET_FUNC_VALUE', [ this.soundId, this.funcType, 'Reverb', parameterName, this.isRandom[parameterName] ? val : [val, val] ])
    }
  }
}

function generateAllComputedProperties (parameters) {
  let props = {}
  Object.keys(parameters).forEach((parameter, index) => {
    console.log(parameter)
    props[parameter] = generateComputedProperty(parameter)
  })
  return props
}

function generateIsRandomMap (parameters) {
  let props = {}
  Object.keys(parameters).forEach((parameter, index) => {
    console.log(parameter)
    props[parameter] = false
  })
  return props
}

export default {
  props: {
    soundId: Number,
    funcType: String
  },

  data () {
    return {
      minMax: PARAMETERS,
      isRandom: generateIsRandomMap(PARAMETERS)
    }
  },

  computed: generateAllComputedProperties(PARAMETERS),

  methods: {
    changeRandomizeParameter (parameterName, value) {
      return (value) => {
        if (value) {
          if (this[parameterName][1] <= this[parameterName][0]) {
            this[parameterName][1] = this[parameterName][0] + 1
          }
        } else {
          this[parameterName] = this[parameterName]
        }

        this.isRandom[parameterName] = value
      }
    }
  },

  created () {
    Object.keys(this.isRandom).forEach((key, index) => {
      this.isRandom[key] = this[key][0] !== this[key][1]
    })
  }
}
</script>

<style>
</style>
