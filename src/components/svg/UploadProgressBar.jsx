/**
 * Displays upload progress as a filled bar with a percentage label.
 * Renders nothing when not uploading.
 */
function UploadProgressBar({ isUploading, progress }) {
  if (!isUploading) return null

  return (
    <div className="space-y-1.5">
      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-indigo-600 h-2 rounded-full transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-slate-500 text-right">{progress}% uploaded</p>
    </div>
  )
}

export default UploadProgressBar
