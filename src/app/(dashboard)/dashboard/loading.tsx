import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="space-y-6 pb-12 w-full max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center pb-4">
        <div>
           <Skeleton className="h-8 w-48 mb-2" />
           <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-2">
           <Skeleton className="h-10 w-24" />
           <Skeleton className="h-10 w-24" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Skeleton className="h-[280px] w-full rounded-xl" />
            <Skeleton className="h-[280px] w-full rounded-xl" />
          </div>
          <Skeleton className="h-[320px] w-full rounded-xl" />
        </div>
        <div className="xl:col-span-1 h-full">
          <Skeleton className="h-full min-h-[600px] w-full rounded-xl" />
        </div>
      </div>
    </div>
  )
}
