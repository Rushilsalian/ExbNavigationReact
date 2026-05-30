import { useState } from 'react'
import useHallStore from '../store/hallStore'
import useSvgUpload from '../hooks/useSvgUpload'
import useUploadSvg from '../hooks/useUploadSvg'
import useZoomPan from '../hooks/useZoomPan'
import { useHallsQuery, useCreateHallMutation, useDeleteHallMutation } from '../hooks/useHalls'
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

  // Zustand selectors
  const halls = useHallStore(s => s.halls)
  const activeHallId = useHallStore(s => s.activeHallId)
  const svgContent = useHallStore(s => s.svgContent)
  const svgDimensions = useHallStore(s => s.svgDimensions)
  const uploadProgress = useHallStore(s => s.uploadProgress)
  const isUploading = useHallStore(s => s.isUploading)
  const setActiveHall = useHallStore(s => s.setActiveHall)
  const clearSvg = useHallStore(s => s.clearSvg)

  const activeHall = halls.find(h => h.id === activeHallId) ?? null

  // React Query — fetch halls on mount and keep store in sync
  const { isLoading: hallsLoading, isError: hallsFetchError } = useHallsQuery()

  // React Query — create / delete hall mutations
  const createHallMutation = useCreateHallMutation()
  const deleteHallMutation = useDeleteHallMutation()

  // Local SVG processing hook (reads file, sanitizes, stores in Zustand)
  const upload = useSvgUpload()

  // API upload mutation with progress tracking
  const { upload: uploadToApi, isPending: isApiUploading, isSuccess: uploadSuccess, error: uploadApiError } = useUploadSvg(activeHallId)

  // Shared zoom state for toolbar + preview so controls are in sync
  const zoomPan = useZoomPan(1)

  const handleCreateHall = () => {
    if (!hallName.trim()) {
      setNameError('Hall name is required.')
      return
    }
    setNameError('')
    createHallMutation.mutate(
      { name: hallName.trim() },
      { onSuccess: () => setHallName('') },
    )
  }

  const handleSaveFloorPlan = () => {
    // Find the original File object from the local hook (stored in useSvgUpload)
    // The SVG content is already local — we need to re-use the last processed file.
    // We trigger the mutation with a Blob reconstructed from the sanitized SVG string.
    if (!svgContent || !activeHallId) return
    const blob = new Blob([svgContent], { type: 'image/svg+xml' })
    const file = new File([blob], 'floor-plan.svg', { type: 'image/svg+xml' })
    uploadToApi(file)
  }

  const handleClear = () => {
    clearSvg()
    upload.clearSvg()
  }

  // Derive error message from API error (axios wraps it in error.message)
  const apiErrorMessage = uploadApiError?.message ?? null
  const createErrorMessage = createHallMutation.error?.message ?? null

  return (
    <div className="space-y-6 max-w-5xl">

      {/* Hall selector / creator */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-800 mb-4">Select or Create a Hall</h2>

        <div className="flex flex-wrap gap-3 items-end">
          <Input
            label="New Hall Name"
            placeholder="e.g. Main Exhibition Hall"
            value={hallName}
            onChange={e => setHallName(e.target.value)}
            error={nameError}
            className="w-64"
            onKeyDown={e => e.key === 'Enter' && handleCreateHall()}
          />
          <Button
            variant="primary"
            size="md"
            onClick={handleCreateHall}
            loading={createHallMutation.isPending}
          >
            Create Hall
          </Button>
        </div>

        {/* API error for hall creation */}
        {createErrorMessage && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1.5">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {createErrorMessage}
          </p>
        )}

        {/* Hall list */}
        {hallsLoading ? (
          <div className="mt-4">
            <Loader size="sm" label="Loading halls…" />
          </div>
        ) : hallsFetchError ? (
          <p className="mt-4 text-sm text-amber-600">Could not load halls from server — showing local state only.</p>
        ) : halls.length > 0 ? (
          <div className="mt-4">
            <p className="text-xs font-medium text-slate-500 mb-2">Existing Halls</p>
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
                  </button>
                  {/* Delete hall — only show when not active to prevent accidents */}
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
          </div>
        ) : null}
      </div>

      {/* SVG Upload section — only shown when a hall is selected */}
      {activeHallId ? (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800">
              Floor Plan &mdash; <span className="text-indigo-600">{activeHall?.name}</span>
            </h2>

            {svgContent && (
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={handleClear} disabled={isUploading || isApiUploading}>
                  Clear
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveFloorPlan}
                  loading={isUploading || isApiUploading}
                  disabled={uploadSuccess}
                >
                  {uploadSuccess ? 'Saved ✓' : 'Save Floor Plan'}
                </Button>
              </div>
            )}
          </div>

          {svgContent ? (
            <div className="space-y-3">
              {/* SVG metadata */}
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
                    <span>
                      File: <strong className="text-slate-700">{upload.fileInfo.name}</strong>
                    </span>
                    <span className="text-slate-300">|</span>
                    <span>
                      Size: <strong className="text-slate-700">{formatFileSize(upload.fileInfo.size)}</strong>
                    </span>
                  </>
                )}
                {uploadSuccess && (
                  <span className="ml-auto text-emerald-600 font-medium flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Saved to server
                  </span>
                )}
              </div>

              {/* Upload progress bar */}
              <UploadProgressBar isUploading={isUploading || isApiUploading} progress={uploadProgress} />

              {/* API upload error */}
              {apiErrorMessage && (
                <p className="text-sm text-red-600 flex items-center gap-1.5">
                  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Upload failed: {apiErrorMessage}
                </p>
              )}

              {/* SVG preview with shared zoom state */}
              <SvgToolbar zoomPan={zoomPan} />
              <SvgPreview svgContent={svgContent} zoomPan={zoomPan} />
            </div>
          ) : (
            <div className="space-y-3">
              <SvgUploader
                isDragging={upload.isDragging}
                error={upload.error}
                onDrop={upload.handleDrop}
                onDragOver={upload.handleDragOver}
                onDragLeave={upload.handleDragLeave}
                onFileSelect={upload.handleFileSelect}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center">
          <p className="text-sm text-slate-500">Create or select a hall above to upload its SVG floor plan.</p>
        </div>
      )}
    </div>
  )
}

export default HallUpload
