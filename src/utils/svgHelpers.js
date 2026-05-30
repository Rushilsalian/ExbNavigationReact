export const isSvgFile = (file) =>
  file?.type === 'image/svg+xml' || file?.name?.toLowerCase().endsWith('.svg')

export const readFileAsText = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })

export const extractSvgDimensions = (svgString) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(svgString, 'image/svg+xml')
  const svg = doc.querySelector('svg')
  if (!svg) return { width: 800, height: 600 }

  let width = parseFloat(svg.getAttribute('width'))
  let height = parseFloat(svg.getAttribute('height'))

  if (!width || !height) {
    const vb = svg.getAttribute('viewBox')
    if (vb) {
      const [, , vw, vh] = vb.split(/[\s,]+/).map(Number)
      width = vw || 800
      height = vh || 600
    }
  }

  return { width: width || 800, height: height || 600 }
}

// Basic SVG sanitizer — strips <script> and on* event attributes
export const sanitizeSvg = (svgString) =>
  svgString
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '')

export const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })

export const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
