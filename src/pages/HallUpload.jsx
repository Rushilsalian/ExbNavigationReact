import { useState } from 'react'
import useHallStore from '../store/hallStore'
import useSvgUpload from '../hooks/useSvgUpload'
import useUploadSvg from '../hooks/useUploadSvg'
import useZoomPan from '../hooks/useZoomPan'
import { useHallsQuery, useDeleteHallMutation } from '../hooks/useHalls'
import SvgUploader from '../components/svg/SvgUploader'
import SvgPreview from '../components/svg/SvgPreview'
import SvgToolbar from '../components/svg/SvgToolbar'
import UploadProgressBar from '../components/svg/UploadProgressBar'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Loader from '../components/common/Loader'
import { formatFileSize } from '../utils/svgHelpers'

function HallUpload() {
  const [hallName, setHallName] = useState('')
  const [nameError, setNameError] = useState('')

  const halls = useHallStore(s => s.halls)
  const activeHallId = useHallStore(s => s.activeHallId)
  const svgContent = useHallStore(s => s.svgContent)
  const svgDimensions = useHallStore(s => s.svgDimensions)
  const uploadProgress = useHallStore(s => s.uploadProgress)
  const isUploading = useHallStore(s => s.isUploading)
  const exhibitionId = useHallStore(s => s.exhibitionId)
  const setExhibitionId = useHallStore(s => s.setExhibitionId)
  const setActiveHall = useHallStore(s => s.setActiveHall)
  const clearSvg = useHallStore(s => s.clearSvg)

  const [exhibitionInput, setExhibitionInput] = useState(String(exhibitionId))

  const activeHall = halls.find(h => h.id === activeHallId) ?? null

  const { isLoading: hallsLoading, isError: hallsFetchError } = useHallsQuery()
  const deleteHallMutation = useDeleteHallMutation()

  const upload = useSvgUpload()
  const { upload: uploadToApi, isPending: isApiUploading, isSuccess: uploadSuccess, error: uploadApiError, data: uploadData } = useUploadSvg()

  const zoomPan = useZoomPan(1)

  const handleExhibitionChange = (val) => {
    setExhibitionInput(val)
    const parsed = parseInt(val)
    if (!isNaN(parsed) && parsed > 0) setExhibitionId(parsed)
  }

  const handleUploadHall = () => {
    if (!hallName.trim()) {
      setNameError('Hall name is required.')
      return
    }
    if (!svgContent) return
    setNameError('')
    const blob = new Blob([svgContent], { type: 'image/svg+xml' })
    const file = new File([blob], 'floor-plan.svg', { type: 'image/svg+xml' })
    uploadToApi(file, hallName.trim())
  }

  const handleClear = () => {
    clearSvg()
    upload.clearSvg()
    setHallName('')
    setNameError('')
  }

  const apiErrorMessage = uploadApiError?.message ?? null

  return (
    <div className="space-y-6 max-w-5xl">

      {/* Exhibition context */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-800 mb-4">Exhibition</h2>
        <div className="flex items-end gap-3">
          <Input
            label="Exhibition ID"
            type="number"
            placeholder="e.g. 1"
            value={exhibitionInput}
            onChange={e => handleExhibitionChange(e.target.value)}
            className="w-40"
          />
          <p className="text-xs text-slate-500 pb-1">All halls are scoped to this exhibition.</p>
        </div>
      </div>

      {/* Upload new hall */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <h2 className="text-sm font-semibold text-slate-800">Upload New Hall</h2>

        <div className="flex flex-wrap gap-3 items-end">
          <Input
            label="Hall Name"
            placeholder="e.g. Main Exhibition Hall"
            value={hallName}
            onChange={e => { setHallName(e.target.value); setNameError('') }}
            error={nameError}
            className="w-64"
          />
        </div>

        {svgContent ? (
          <div className="space-y-3">
            <div className="flex items-center gap-4 text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2 flex-wrap">
              <span>
                Dimensions:{' '}
                <strong className="text-slate-700">
                  {svgDimensions.width} × {svgDimensions.height} px
                </strong>
              </span>
              {upload.fileInfo && (
                <>
                  <span className="text-slate-300">|</span>
                  <span>File: <strong className="text-slate-700">{upload.fileInfo.name}</strong></span>
                  <span className="text-slate-300">|</span>
                  <span>Size: <strong className="text-slate-700">{formatFileSize(upload.fileInfo.size)}</strong></span>
                </>
              )}
              {uploadSuccess && (
                <span className="ml-auto text-emerald-600 font-medium flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {uploadData?.boothsExtracted ?? 0} booths extracted &amp; saved
                </span>
              )}
            </div>

            <UploadProgressBar isUploading={isUploading || isApiUploading} progress={uploadProgress} />

            {apiErrorMessage && (
              <p className="text-sm text-red-600 flex items-center gap-1.5">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Upload failed: {apiErrorMessage}
              </p>
            )}

            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={handleClear} disabled={isUploading || isApiUploading}>
                Clear
              </Button>
              {!uploadSuccess && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleUploadHall}
                  loading={isUploading || isApiUploading}
                >
                  Upload Hall
                </Button>
              )}
            </div>

            <SvgToolbar zoomPan={zoomPan} />
            <SvgPreview svgContent={svgContent} zoomPan={zoomPan} />
          </div>
        ) : (
          <SvgUploader
            isDragging={upload.isDragging}
            error={upload.error}
            onDrop={upload.handleDrop}
            onDragOver={upload.handleDragOver}
            onDragLeave={upload.handleDragLeave}
            onFileSelect={upload.handleFileSelect}
          />
        )}
      </div>

      {/* Existing halls */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-800 mb-4">
          Existing Halls
          <span className="ml-2 text-xs font-normal text-slate-400">Exhibition {exhibitionId}</span>
        </h2>

        {hallsLoading ? (
          <Loader size="sm" label="Loading halls…" />
        ) : hallsFetchError ? (
          <p className="text-sm text-amber-600">Could not load halls from server.</p>
        ) : halls.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {halls.map(hall => (
              <div key={hall.id} className="flex items-center gap-1">
                <button
                  onClick={() => setActiveHall(hall.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    hall.id === activeHallId
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-indigo-400'
                  }`}
                >
                  {hall.name}
                  {hall.id === activeHallId && (
                    <span className="ml-1.5 text-indigo-200 text-xs">active</span>
                  )}
                </button>
                {hall.id !== activeHallId && (
                  <button
                    onClick={() => deleteHallMutation.mutate(hall.id)}
                    disabled={deleteHallMutation.isPending}
                    className="p-1 rounded text-slate-400 hover:text-red-500 transition-colors"
                    title="Delete hall"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400">No halls found for exhibition {exhibitionId}. Upload one above.</p>
        )}

        {activeHall && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Active hall for navigation editor:{' '}
              <strong className="text-indigo-600">{activeHall.name}</strong>
              {activeHall.width && (
                <span className="ml-2 text-slate-400">
                  {activeHall.width} × {activeHall.height} px
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default HallUpload
