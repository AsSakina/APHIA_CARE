import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function ExpensesListSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-9 w-[180px]" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
