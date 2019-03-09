<template>
  <div>
    <v-layout row>
      <v-flex xs6>
        <settings-panel
          :input-dir.sync="inputDir"
          :font-color.sync="fontColor"
          :font-color-range.sync="fontColorRange"
          :output-format.sync="outputFormat"
          :position.sync="position"
          :use-filter.sync="useFilter"
        />
        <v-layout>
          <v-btn ripple info large @click.native="testRun">
            TestRun
          </v-btn>
          <v-btn ripple primary large @click.native="run">
            Run
          </v-btn>
          <v-progress-linear
            v-model="progress.value"
            :active="progress.show"
          ></v-progress-linear>
        </v-layout>
      </v-flex>
      <v-flex xs6>
        <image-preview
          :files="files"
          :page.sync="page"
          :position.sync="position"
        />
      </v-flex>
    </v-layout>
    <v-layout>
      <v-layout>
        <div class="headline">Log</div>
        <v-btn ma-2 @click.native="logClear">clear</v-btn>
      </v-layout>
      <div
        style="overflow:scroll; height:200px; border: solid 1px black; text-align:left;"
      >
        <div v-for="(log, i) in logs" :key="i">
          <div v-html="log"></div>
        </div>
      </div>
    </v-layout>
  </div>
</template>
<script>
import { getImageFilesFromDir } from "../util/file"
import SettingsPanel from "./main/SettingsPanel"
import ImagePreview from "./main/ImagePreview"

export default {
  components: { ImagePreview, SettingsPanel },
  data() {
    return {
      inputDir: "input-ss-path",
      files: [],
      page: 1,
      position: {
        start: {
          x: 0,
          y: 0
        },
        end: {
          x: 0,
          y: 0
        }
      },
      useFilter: false,
      fontColor: "#FFFFFF",
      fontColorRange: 10,
      prevImageSrc: "",
      outputFormat: "[text]",
      logs: [],
      progress: {
        value: 0,
        show: false
      }
    }
  },
  watch: {
    async inputDir() {
      this.page = 1
      this.files = await getImageFilesFromDir(this.inputDir)
    }
  },
  computed: {
    selectedFile () {
      return this.files[this.page - 1]
    }
  },
  methods: {
    logClear() {
      this.logs = []
    },
    async run() {
      await this.$store.dispatch("execOcr", {
        files: this.files,
        options: {
          position: this.position,
          fontColor: this.fontColor,
          fontColorRange: this.fontColorRange
        }
      })
    },
    async testRun() {
      await this.$store.dispatch("execOcr", {
        files: [this.selectedFile],
        options: {
          position: this.position,
          fontColor: this.fontColor,
          fontColorRange: this.fontColorRange
        }
      })
    }
  }
}
</script>

<style scoped>
img {
  max-width: 100%;
}
</style>
