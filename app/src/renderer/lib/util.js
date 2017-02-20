/*
 rgbの差分計算 rgbのユークリッド距離により色差の計算を行い
 0-1で正規化する
 */
export function calcRgbDiff (a, b) {
  const d = [
    (a.r - b.r) / 255,
    (a.g - b.g) / 255,
    (a.b - b.b) / 255
  ]
  let sum = 0
  d.forEach((v) => {
    sum += v * v
  })
  return Math.sqrt(sum) / Math.sqrt(3)
}

/*
 #C8C8C8みたいな色のStringを
 {
 r: 200,
 g: 200,
 b: 200
 }
 の形のオブジェクトにする
 */
export function parseRgb (hexStr) {
  const colorString = hexStr.substr(1, 6).toLowerCase()

  const re = /^(\w{2})(\w{2})(\w{2})$/
  const res = re.exec(colorString)

  return {
    r: parseInt(res[1], 16),
    g: parseInt(res[2], 16),
    b: parseInt(res[3], 16)
  }
}
