# adv-screenshots-ocr-runnner

## なにができますか?
指定したフォルダの画像にOCRを掛けて, ファイル名をその結果でリネームすることができます.
OCRを掛ける領域は任意に選択することができ, 文字色を指定してOCRを掛けることである程度現実的な結果が得られます。

## なんのために使えますか？
美少女ゲームのスクリーンショットを対象としこのソフトを使うことで,
台詞をファイル名にすることができ, 
ファイルをEverything等のファイル検索ソフトで台詞で検索できるようにするために使えます。

## デモ
[Gyazo GIF](https://gyazo.com/79c114ac88cd4f03d9f6a6e37f7de465)

## どうやって使えばいいですか？
https://github.com/namazu510/adv-screenshots-ocr-runner/releases　からインストーラをDLして使って下さい。

バグの報告、ご要望などはissue or twittterでお願いします。

# Development
vue cli3 base / electron 製です.
ocrにはtesseract.jsを利用させていただいております.

## build & debug

```
$yarn 
$yarn electron:serve
```

## electron packaging

```
$yarn 
$yarn prepare
$yarn package
```
