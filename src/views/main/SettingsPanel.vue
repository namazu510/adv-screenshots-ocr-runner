<template>
  <div>
    <div class="headline">対象画像ディレクトリ</div>
    <v-layout raw>
      <v-flex xs9>
        <v-text-field
          disabled
          label="FolderPath"
          :value="inputDir"
        ></v-text-field>
      </v-flex>
      <v-flex xs3>
        <v-btn @click.native="folderSelect">Open</v-btn>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs6>
        <div class="display-1">OCRルール</div>
        <div class="headline">台詞</div>
        <v-layout>
          <v-flex xs4>
            <div>始点(↖)</div>
            <div>click + shift</div>
          </v-flex>
          <v-flex xs4>
            <v-text-field
              label="x"
              type="number"
              :value="position.start.x"
              @input="inputPosition($event, 'start', 'x')"
            ></v-text-field>
          </v-flex>
          <v-flex xs4>
            <v-text-field
              label="y"
              type="number"
              :value="position.start.y"
              @input="inputPosition($event, 'start', 'y')"
            ></v-text-field>
          </v-flex>
        </v-layout>

        <v-layout>
          <v-flex xs4>
            <div>終点(↘)</div>
            <div>click + cntl</div>
          </v-flex>
          <v-flex xs4>
            <v-text-field
              label="x"
              type="number"
              :value="position.end.x"
              @input="inputPosition($event, 'end', 'x')"
            ></v-text-field>
          </v-flex>
          <v-flex xs4>
            <v-text-field
              label="y"
              type="number"
              :value="position.end.y"
              @input="inputPosition($event, 'end', 'y')"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <div class="headline">フォントカラー</div>
        <v-checkbox
          label="フォント色を指定する(精度が上がります)"
          :value="useFilter"
          @change="$emit('update:useFilter', $event)"
          filled
        ></v-checkbox>
        <v-layout v-if="useFilter">
          <v-flex xs6>
            <v-text-field
              type="color"
              :value="fontColor"
              @input="$emit('update:fontColor', $event)"
              label="color"
            ></v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field
              type="number"
              label="許容差分率0_100"
              :value="fontColorRange"
              @input="$emit('update:fontColorRange', $event)"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <div class="headline">出力ファイル名フォーマット</div>
        <v-text-field
          label="output-format"
          v-model="outputFormat"
          @input="$emit('update:outputFormat', $event)"
        ></v-text-field>
      </v-flex>
    </v-layout>
  </div>
</template>
<script>
const Dialog = require("electron").remote.dialog

export default {
  name: "settings-panel",
  props: {
    fontColor: String,
    fontColorRange: Number,
    outputFormat: String,
    position: Object,
    inputDir: String,
    useFilter: Boolean
  },
  methods: {
    folderSelect() {
      Dialog.showOpenDialog(
        null,
        {
          properties: ["openDirectory"],
          title: "画像フォルダ",
          defaultPath: "."
        },
        folderNames => {
          if (!folderNames || folderNames.length < 1) {
            return;
          }
          this.$emit("update:inputDir", folderNames[0])
        }
      )
    },
    inputPosition(val, target, dir) {
      this.$emit("update:position", {
        ...this.position,
        [target]: {
          ...this.position[target],
          [dir]: val
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
