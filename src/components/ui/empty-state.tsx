import { FolderSearch } from "lucide-react"
import { Button } from "./button"

interface EmptyStateProps {
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ 
  title = "No results found", 
  description = "There are no findings matching your current filters. Try adjusting your search criteria.",
  actionLabel = "Clear filters",
  onAction
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <FolderSearch className="h-6 w-6 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6">
        {description}
      </p>
      {onAction && (
        <Button onClick={onAction} variant="outline" className="bg-white">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
