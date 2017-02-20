<template>
    <div class="check-page">
        <v-row>
            <!-- 出力結果　-->
            <v-col xs6>
                <table>
                    <thead>
                    <tr>
                        <th>res</th>
                        <th>clear</th>
                    </tr>
                    </thead>
                    <tbody>
                    <template v-for="(res, index) in ocrRes">
                        <tr>
                            <td><v-text-input
                                    :id="`form-${index}`"
                                    v-model="textFormValues[index]"
                                    @keyup.enter.native="selectNext(index)"
                                    @keyup.down.native="selectNext(index)"
                                    @keyup.tab.native="selectNext(index)"
                                    @keyup.up.native="selectPrev(index)"
                                    @foucas.native="previewUpload(index)"
                                ></v-text-input></td>
                            <td><v-btn
                                @click.native="clear(index)"
                            ><v-icon>clear</v-icon></v-btn></td>
                        </tr>
                    </template>
                    </tbody>
                </table>
            </v-col>
            <!-- プレビュー -->
            <v-col xs6>
                <img src="prevImg" class="prevImage">
            </v-col>
        </v-row>
        <v-row>
            <v-btn block primary>ファイルをリネームする.</v-btn>
        </v-row>
    </div>
</template>
<style scoped>

</style>
<script>
    const fs = require('fs')
    export default{
        data () {
            // 結果をテキストフォームにいれとく.
            const textFormValues = []
            return{
                textFormValues,
                selectIndex: 0
            }
        },
        mounted () {
            this.textFormValues = this.orcRes.map(v => v.res)
        }
        computed () {
            ocrRes () {
                return this.$store.file.ocrRes
            }
            selectedFile () {
                return this.ocrRes[this.selectIndex]
            }
            prevImg () {
                const imgDataUrl = new Buffer(fs.readFileSync(this.))
            }
        },
        methods: {
            clear (index) {
                this.textFormValues[index] = ''
            }
            selectPrev (index) {
                if (index <= 0) {
                    return
                }
                console.log(this.$el)
            }
            selectNext (index) {
                if (index >= this.orcRes.length) {
                    return
                }

            },
            previewUpload (index) {
                this.selectIndex = index
            },

        }
    }
</script>
