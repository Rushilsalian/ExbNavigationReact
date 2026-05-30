function SvgUploader({ isDragging, error, onDrop, onDragOver, onDragLeave, onFileSelect }) {
  return (
    <div className="space-y-3">
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`
          relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed
          px-6 py-14 text-center transition-colors cursor-pointer
          ${isDragging ? 'border-indigo-400 bg-indigo-50' : 'border-slate-300 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/40'}
        `}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm text-slate-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-700">
            {isDragging ? 'Drop your SVG here' : 'Drag & drop SVG file here'}
          </p>
          <p className="text-xs text-slate-500 mt-1">or click to browse — SVG files only</p>
        </div>

        <input
          type="file"
          accept=".svg,image/svg+xml"
          onChange={onFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1.5">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}

export default SvgUploader
