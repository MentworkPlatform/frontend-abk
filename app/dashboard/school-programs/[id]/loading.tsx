import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center space-x-2 mb-4">
          <Skeleton className="h-9 w-24" />
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left sidebar skeleton */}
          <div className="w-full md:w-1/3 space-y-4">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>

                <div className="pt-2">
                  <Skeleton className="h-4 w-36 mb-2" />
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <Skeleton className="h-4 w-4 mr-2 mt-0.5" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Skeleton className="h-4 w-4 mr-2 mt-0.5" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <div className="space-y-2">
                    {[1, 2].map((_, index) => (
                      <div key={index} className="flex items-center">
                        <Skeleton className="h-8 w-8 rounded-full mr-2" />
                        <div>
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <Skeleton className="h-5 w-40" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((_, index) => (
                    <div key={index} className="py-2 px-1">
                      <div className="flex items-center">
                        <Skeleton className="h-4 w-4 mr-2" />
                        <div>
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-3 w-32 mt-1" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content skeleton */}
          <div className="w-full md:w-2/3 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <Skeleton className="h-6 w-64 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-6 w-24" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-6">
                  <div className="flex space-x-2">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                </div>

                <div className="space-y-4">
                  {[1, 2, 3].map((_, index) => (
                    <Card key={index}>
                      <CardHeader className="py-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Skeleton className="h-5 w-5 mr-2" />
                            <Skeleton className="h-5 w-48" />
                          </div>
                          <Skeleton className="h-4 w-16" />
                        </div>
                      </CardHeader>
                      <CardContent className="py-2">
                        <Skeleton className="h-32 w-full rounded-md" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
