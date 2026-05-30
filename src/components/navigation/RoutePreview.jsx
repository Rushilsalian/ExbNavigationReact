import EmptyState from '../common/EmptyState'

function RoutePreview() {
  return (
    <EmptyState
      title="Route Preview"
      description="Path-finding and route visualization will be available in Phase 4."
      icon={
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      }
    />
  )
}

export default RoutePreview
