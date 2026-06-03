import { useState, useEffect } from 'react'

function ensureSvgDimensions(svgContent, dimensions) {
  if (!svgContent) return svgContent
  const { width, height } = dimensions
  if (!width || !height) return svgContent
  // Inject width/height into <svg> tag if missing (needed for Safari)
  return svgContent.replace(
    /^(<svg[^>]*?)>/i,
    (match, opening) => {
      const hasWidth = /\bwidth=/i.test(opening)
      const hasHeight = /\bheight=/i.test(opening)
      let attrs = opening
      if (!hasWidth) attrs += ` width="${width}"`
      if (!hasHeight) attrs += ` height="${height}"`
      return `${attrs}>`
    }
  )
}

export default function useSvgBackground(svgContent, svgDimensions = { width: 0, height: 0 }) {
  const [bgImage, setBgImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [bgError, setBgError] = useState(null)

  useEffect(() => {
    if (!svgContent) {
      setBgImage(null)
      return
    }

    let blobUrl = null
    let cancelled = false

    setIsLoading(true)
    setBgError(null)

    const prepared = ensureSvgDimensions(svgContent, svgDimensions)
    const blob = new Blob([prepared], { type: 'image/svg+xml' })
    blobUrl = URL.createObjectURL(blob)

    const img = new window.Image()
    img.onload = () => {
      if (!cancelled) {
        setBgImage(img)
        setIsLoading(false)
      }
    }
    img.onerror = () => {
      if (!cancelled) {
        setBgError('Failed to load SVG as image')
        setIsLoading(false)
      }
    }
    img.src = blobUrl

    return () => {
      cancelled = true
      if (blobUrl) URL.revokeObjectURL(blobUrl)
    }
  }, [svgContent]) // eslint-disable-line react-hooks/exhaustive-deps

  return { bgImage, isLoading, bgError }
}
