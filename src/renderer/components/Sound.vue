<template>
  <div class="sound">
    <div class="head" :class="{ playing: isPlaying }">
      <el-tooltip placement="top" content="Disable/Enable sound">
        <el-switch v-model="enabled"></el-switch>
      </el-tooltip>

      <h1 class="title" @click="startNameEdit">
        <icon name="bell" v-if="sound.needs_trigger"></icon>
        <span v-if="!editing">{{ sound.name }}</span>
        <el-input v-if="editing" class="edit" autofocus="true" size="mini" v-model="tempName" @keyup.enter.native="submitNameEdit()" @keyup.esc.native="cancelNameEdit()" @blur="cancelNameEdit()"></el-input>
        <icon class="edit-name" name="edit"></icon>
      </h1>

      <span class="filename">{{ sound.file_path }}</span>

      <ul>
        <li @click="previewSound()">
          <el-tooltip placement="top" content="Preview sound">
            <icon name="play"></icon>
            </el-tooltip>
        </li>
        <li @click="showEditSound()">
          <el-tooltip placement="top" content="Edit sound">
            <icon name="cogs"></icon>
          </el-tooltip>
        </li>
        <li class="separator">&nbsp;</li>
        <li @click="deleteSound()">
          <el-tooltip placement="top" content="Delete sound">
            <icon name="trash"></icon>
          </el-tooltip>
        </li>
      </ul>
    </div>
    <div class="body">

      <div class="funcs">
        <span class="func-type">Start</span>
        <el-tooltip placement="left" content="Add new function">
          <span @click="showAddFunction('start')" class="func-add">+</span>
        </el-tooltip>
        <span
          v-for="(func, name) in sound.funcs.start"
          :key="name"
          class="func-tag func-start"
          @click="showFuncSettings(name, 'start')"
          @contextmenu="showContextMenu(name, 'start', $event)">{{ name }}</span>
      </div>

      <div class="funcs">
        <span class="func-type">Update</span>
        <el-tooltip placement="left" content="Add new function">
          <span @click="showAddFunction('update')" class="func-add">+</span>
        </el-tooltip>
        <span
          v-for="(func, name) in sound.funcs.update"
          :key="name"
          class="func-tag func-update"
          @click="showFuncSettings(name, 'update')"
          @contextmenu="showContextMenu(name, 'update', $event)">{{ name }}</span>
      </div>

      <div class="funcs-last">
        <span class="func-type">Finish</span>
        <el-tooltip placement="left" content="Add new function">
          <span @click="showAddFunction('finish')" class="func-add">+</span>
        </el-tooltip>
        <span
          v-for="(func, name) in sound.funcs.finish"
          :key="name"
          class="func-tag func-finish"
          @click="showFuncSettings(name, 'finish')"
          @contextmenu="showContextMenu(name, 'finish', $event)">{{ name }}</span>
      </div>

      <ul id="right-click-menu" tabindex="-1" ref="right" v-if="viewContextMenu" @blur="closeContextMenu" v-bind:style="{ top: contextMenuTop, left: contextMenuLeft }">
        <li @click="viewContextMenu=false; showFuncSettings(contextMenuTargetName, contextMenuTargetType)"><span class="icon"><icon name="cogs"></icon></span> Edit</li>
        <li @click="viewContextMenu=false; showCopyDialog(contextMenuTargetName, contextMenuTargetType)"><span class="icon"><icon name="copy"></icon></span> Copy to sound ...</li>
        <li @click="viewContextMenu=false; removeFunc(contextMenuTargetName, contextMenuTargetType)"><span class="icon"><icon name="trash"></icon></span> Delete</li>
      </ul>

    </div>

    <!-- Edit a sound -->
    <el-dialog :title="editSoundDialogTitle" :visible.sync="editSoundVisible">
      <el-form ref="soundEditForm" :model="soundEditCopy" label-width="120px" :rules="editSoundRules">
        <el-form-item label="Name" prop="name">
          <el-input v-model="soundEditCopy.name"></el-input>
        </el-form-item>

        <el-form-item label="Category" prop="category">
          <el-select v-model="soundEditCopy.category" allow-create filterable>
            <el-option v-for="category in categories" :key="category" :label="category" :value="category">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="File" prop="file_path">
          <el-input size="mini" v-model="filterSoundLibrary" placeholder="Filter ..."><i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
          <div class="selector" v-if="filteredSoundLibrary.length > 0">
            <ul>
              <li v-for="file in filteredSoundLibrary" :key="file" :class="{ active: soundEditCopy.file_path === file}" @click="soundEditCopy.file_path = file">
                <icon name="music" class="function-icon"></icon> {{ file }}
              </li>
            </ul>
          </div>
          <span v-else>No sounds found!</span>
        </el-form-item>

        <el-form-item label="Needs trigger">
          <el-switch v-model="soundEditCopy.needs_trigger"></el-switch>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editSoundVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitSoundEditForm()">Confirm</el-button>
      </span>
    </el-dialog>

  	<!-- Edit a function -->
    <el-dialog :title="editFuncDialogTitle" :visible.sync="editFuncVisible" width="80%">
      <component :is="editFuncName" :soundId="this.sound.id" :funcType="this.editFuncType"></component>
      <span slot="footer" class="dialog-footer">
        <el-button @click="removeFunc(editFuncName, editFuncType)" type="danger">Remove</el-button>
        <el-button type="primary" @click="editFuncVisible = false">Close</el-button>
      </span>
    </el-dialog>

    <!-- Copy a function -->
    <el-dialog title="Copy function ..." :visible.sync="copyFuncVisible" width="80%">
      <el-form>
        <el-form-item label="File" prop="file_path">
          <el-input size="mini" v-model="filterCopyFuncSounds" placeholder="Filter ..."><i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
          <div class="selector" v-if="filteredCopyFuncSounds.length > 0">
            <ul>
              <li v-for="sound in filteredCopyFuncSounds" :key="sound.id" :class="{ active: copyFuncTarget === sound}" @click="copyFuncTarget = sound">
                <icon name="music" class="function-icon"></icon> {{ sound.name }}
              </li>
            </ul>
          </div>
          <span v-else>No sounds found!</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="copyFuncVisible = false">Close</el-button>
        <el-button type="primary" @click="copyFunc(copyFuncName, copyFuncType, copyFuncTarget); copyFuncVisible = false" :disabled="copyFuncTarget === null">Copy</el-button>
      </span>
    </el-dialog>

    <!-- Add a function -->
    <el-dialog title="Add function" :visible.sync="addFuncVisible">
      <div class="dialog-center">
        <div class="selector">
          <el-input placeholder="Filter" v-model="functionFilter"><i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
          <ul>
            <li v-for="func in filteredFunctions()" :key="func" @click="addFunction(func)"><icon name="cube" class="function-icon"></icon> {{ func }}</li>
          </ul>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addFuncVisible = false">Cancel</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Vue from 'vue'

const availableFunctions = {
  'Loop': null,
  'Volume': null,
  'Delay': null,
  'Frequency': null,
  'Repeat': null,
  'LowPass': null,
  'Fader': null,
  'Echo': null,
  'Reverb': null
}

for (let func in availableFunctions) {
  availableFunctions[func] = require('./functions/' + func + '.vue').default
}

export default {
  props: {
    sound: Object,
    index: Number
  },

  components: availableFunctions,

  data () {
    var uniqueName = (rule, value, callback) => {
      setTimeout(() => {
        for (let sound of this.$store.getters.allSounds) {
          if (sound.name.toLowerCase() === value.toLowerCase() && sound.id !== this.sound.id) {
            callback(new Error('Name "' + value + '" is already in use!'))
            return
          }
        }

        callback()
      }, 1000)
    }

    return {
      editing: false,
      tempName: '',
      filterSoundLibrary: '',
      addFuncVisible: false,
      addFuncType: '',
      usedFuncMap: {},
      functionFilter: '',
      editFuncVisible: false,
      editFuncName: '',
      editFuncType: '',
      editSoundVisible: false,
      soundEditCopy: {},
      editSoundIsNew: false,
      editSoundRules: {
        name: [
          { required: true, message: 'Name of the sound can\'t be empty!', trigger: 'change' },
          { validator: uniqueName, trigger: 'change' }
        ]
      },

      viewContextMenu: false,
      contextMenuTop: '0px',
      contextMenuLeft: '0px',
      contextMenuTargetName: '',
      contextMenuTargetType: '',

      copyFuncVisible: false,
      copyFuncName: '',
      copyFuncType: '',
      copyFuncTarget: null,
      filterCopyFuncSounds: ''
    }
  },

  computed: {
    ...mapGetters({
      sounds: 'allSounds'
    }),

    isPlaying () {
      let soundsPlaying = this.$store.getters.soundsPlaying
      return soundsPlaying.includes(this.sound.name)
    },

    enabled: {
      get () {
        return this.$store.getters.isSoundEnabled(this.sound.id)
      },

      set (value) {
        this.$store.commit('SET_SOUND_ENABLED', [ this.sound.id, value ])
      }
    },

    name: {
      get () {
        return this.$store.getters.soundName(this.sound.id)
      }
    },

    editFuncDialogTitle () {
      return this.sound.name + ' - ' + this.editFuncName
    },

    editSoundDialogTitle () {
      return 'Edit ' + this.sound.name
    },

    filteredSoundLibrary () {
      return this.$store.getters.soundLibrary.filter(f => f.toLowerCase().indexOf(this.filterSoundLibrary.toLowerCase()) > -1)
    },

    filteredCopyFuncSounds () {
      return this.$store.getters.allSounds.filter(s => s.name.toLowerCase().indexOf(this.filterCopyFuncSounds.toLowerCase()) > -1)
    },

    categories () {
      let categories = {}

      for (let sound of this.sounds) {
        if (!(sound.category in categories)) {
          categories[sound.category] = []
        }

        categories[sound.category].push(sound)
      }

      return Object.keys(categories)
    }
  },

  methods: {
    filteredFunctions () {
      // Normally, this would be a computed property, but updating seems to broken
      return Object.keys(availableFunctions).filter(f => this.usedFuncMap[f] === undefined && f.toLowerCase().indexOf(this.functionFilter.toLowerCase()) > -1)
    },

    startNameEdit () {
      this.editing = true
      this.tempName = this.$store.getters.soundName(this.sound.id)
    },

    submitNameEdit () {
      this.editing = false
      this.$store.commit('SET_SOUND_NAME', [ this.sound.id, this.tempName ])
    },

    cancelNameEdit () {
      this.editing = false
    },

    deleteSound () {
      this.$store.commit('DELETE_SOUND', this.sound.id)
    },

    showFuncSettings (name, type) {
      this.editFuncName = name
      this.editFuncType = type
      this.editFuncVisible = true
    },

    removeFunc (name, type) {
      this.editFuncVisible = false
      this.$store.commit('REMOVE_FUNCTION', [this.sound.id, type, name])
    },

    showAddFunction (type) {
      this.addFuncVisible = true
      this.addFuncType = type
      this.usedFuncMap = this.sound.funcs[type]

      // Changing usedFuncMap does not force the computed property filteredFunctions to update
      // So we force it here
      this.$forceUpdate()
    },

    addFunction (func) {
      this.addFuncVisible = false
      this.$store.commit('ADD_FUNCTION', [this.sound.id, this.addFuncType, func])
    },

    showEditSound () {
      this.soundEditCopy = JSON.parse(JSON.stringify(this.sound))
      this.$store.dispatch('getSoundLibrary')
      this.editSoundVisible = true
    },

    submitSoundEditForm () {
      this.$refs['soundEditForm'].validate((valid) => {
        if (valid) {
          this.$store.commit('UPDATE_SOUND', this.soundEditCopy)
          this.editSoundVisible = false
        } else {
          return false
        }
      })
    },

    previewSound () {
      this.$api.preview(this.sound.name)
    },

    setContextMenu (top, left) {
      let largestHeight = window.innerHeight - this.$refs.right.offsetHeight - 25
      let largestWidth = window.innerWidth - this.$refs.right.offsetWidth - 25

      if (top > largestHeight) top = largestHeight

      if (left > largestWidth) left = largestWidth

      this.contextMenuTop = top + 'px'
      this.contextMenuLeft = left + 'px'
    },

    showContextMenu (name, type, event) {
      this.viewContextMenu = true
      this.contextMenuTargetName = name
      this.contextMenuTargetType = type

      Vue.nextTick(function () {
        this.$refs.right.focus()
        this.setContextMenu(event.y, event.x)
      }.bind(this))
      event.preventDefault()
    },

    closeContextMenu () {
      this.viewContextMenu = false
    },

    showCopyDialog (name, type) {
      this.copyFuncName = name
      this.copyFuncType = type
      this.copyFuncTarget = null
      this.copyFuncVisible = true
    },

    copyFunc (name, type, target) {
      this.$store.commit('ADD_FUNCTION_WITH_PARAMS', [ target.id, type, name, JSON.parse(JSON.stringify(this.sound.funcs[type][name])) ])
    }
  }
}
</script>

<style>
  .clearfix::after {
    clear: both;
  }

  .filename {
    color: #cccccc;
  }

  .sound {
    border: 1px solid #eeeeee;
    /*box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);*/

    z-index: 1;
    margin-bottom: 15px;
  }

  .head {
    border-bottom: 1px solid #eeeeee;
    padding: 5px;
    transition: border-color .3s,background-color .3s,color .3s;
  }

  .playing {
    background-color: #e40000;
  }

  .head .title {
    display: inline;
    font-size: 16px;
    user-select: none;
  }

  .head .title .edit {
    display: inline;
    width: 200px;
  }

  .head ul {
    padding: 0;
    margin: 0;
    display: inline;
    float: right;
  }

  .head ul li {
    padding: 0;
    margin: 0;
    display: inline-block;
    color: #EEEEEE;
  }

  .head ul li:hover {
    color: black;
    cursor: pointer;
  }

  .head ul li.separator {
    width: 1px;
    border-left: 1px solid #eeeeee;
    margin-left: 4px;
    margin-right: 4px;

  }

  .head .title .edit input {
    display: inline;
    width: 200px;
  }

  .edit-name {
    color: #eeeeee;
  }

  .sound .title:hover .edit-name {
    color: black;
  }

  .sound .content {
    padding: 5px;
  }

  .body {
    clear: both;

    padding: 10px;
  }

  .funcs {
    height: 30px;
    border-bottom: 1px solid #eeeeee;
    margin-bottom: 5px;
  }

  .funcs-last {
    height: 30px;
  }

  .func-type {
    width: 80px;
    display: inline-block;
    margin-right: 10px;
    padding-right: 5px;
  }

  .func-tag {
    cursor: pointer;
    display: inline-block;
    margin-left: 2px;
    border-radius: 4px;
    font-size: 12px;
    height: 24px;
    padding: 0 10px;
    line-height: 24px;
  }

  .func-update {
    border: 1px solid #409eff;
    background-color: rgba(64,158,255,.1);
    color: #409eff;
  }

  .func-start {
    border: 1px solid rgba(103,194,58,.2);
    background-color: rgba(103,194,58,.1);
    color: #67c23a;
  }

  .func-finish {
    border: 1px solid rgba(230,162,60,.2);
    background-color: rgba(230,162,60,.1);
    color: #e6a23c;
  }

  .func-add {
    height: 24px;
    border-radius: 4px;
    width: 24px;
    display: inline-block;
    border: 1px solid #dcdfe6;
    text-align: center;
  }

  .func-add:hover {
    cursor: pointer;
    color: #409EFF;
    background-color: #ecf5ff;
    border-color: #c6e2ff;
  }

  .selector {
    margin: 0 auto;
    width: 100%;
  }

  .selector ul {
    list-style-type: none;
    height: 300px;
    overflow-y: auto;
  }

  .selector li {
    padding: 10px;
    transition: border-color .3s,background-color .3s,color .3s;
  }

  .selector li:hover {
    cursor: pointer;
    background-color: #ecf5ff;
  }

  .selector .active {
    background-color: #ecf5ff;
  }

  .function-icon {
    position: relative;
    top: 4px;
  }

  #right-click-menu{
    background: #FFFFFF;
    border: 1px solid #BDBDBD;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);
    display: block;
    list-style: none;
    margin: 0;
    padding: 0;
    position: absolute;
    width: 150px;
    z-index: 999999;
  }

  #right-click-menu li {
    border-bottom: 1px solid #E0E0E0;
    margin: 0;
    padding: 2px 2px;
    height: 26px;
    line-height: 26px;
  }

  #right-click-menu li:hover {
    cursor: pointer;
  }

  #right-click-menu li .icon {
    margin-right: 5px;
    line-height: 26px;
    height: 26px;
  }

  #right-click-menu li .icon svg{
    height: 12px;
    line-height: 26px;
  }

  #right-click-menu li:last-child {
    border-bottom: none;
  }

  #right-click-menu li:hover {
      background: #ecf5ff;
  }
</style>
