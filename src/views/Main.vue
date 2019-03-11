<template>
  <div>
    <v-layout row>
      <v-flex xs6 class="pr-2">
        <settings-panel
          :input-dir.sync="inputDir"
          :font-color.sync="fontColor"
          :font-color-range.sync="fontColorRange"
          :output-format.sync="outputFormat"
          :position.sync="position"
          :use-filter.sync="useFilter"
        />
        <v-layout>
          <v-btn
            large
            @click="testRun"
            :disabled="status.inProgress"
          >
            TestRun
          </v-btn>
          <v-btn
            large
            @click="run"
            :disabled="status.inProgress"
          >
            Run
          </v-btn>
        </v-layout>
      </v-flex>
      <v-flex xs6 class="pl-2">
        <image-preview
          :files="files"
          :page.sync="page"
          :font-color="useFilter ? fontColor : undefined"
          :font-color-range="useFilter ? fontColorRange : undefined"
          :position.sync="position"
        />
      </v-flex>
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
      outputFormat: "[text]"
    }
  },
  watch: {
    async inputDir() {
      this.page = 1
      this.files = await getImageFilesFromDir(this.inputDir)
    }
  },
  computed: {
    selectedFile() {
      return this.files[this.page - 1]
    },
    status() {
      return this.$store.getters["status"]
    }
  },
  methods: {
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
