import { Skeleton } from "@/components/ui/skeleton"

export default function VCSLoading() {
  return (
    <div className="space-y-6 pb-12 w-full max-w-[1500px] mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
        <div>
           <Skeleton className="h-8 w-64 mb-2" />
           <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex gap-2">
           <Skeleton className="h-10 w-24" />
           <Skeleton className="h-10 w-24" />
           <Skeleton className="h-10 w-24" />
        </div>
      </div>
      
      <Skeleton className="h-[600px] w-full rounded-xl" />
    </div>
  )
}
