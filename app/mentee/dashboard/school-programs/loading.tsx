import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SchoolProgramsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-10 w-full md:w-[300px]" />
      </div>

      <Tabs defaultValue="enrolled" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="enrolled">My Programs</TabsTrigger>
          <TabsTrigger value="available">Available Programs</TabsTrigger>
        </TabsList>

        <TabsContent value="enrolled" className="space-y-4 mt-4">
          {[1, 2].map((i) => (
            <Card key={i}>
              <div className="flex flex-col md:flex-row">
                <div className="p-6 md:w-2/3">
                  <div className="mb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                      <div>
                        <Skeleton className="h-6 w-48 mb-2" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <Skeleton className="h-6 w-24" />
                    </div>
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-3/4 mb-4" />

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-8" />
                      </div>
                      <Skeleton className="h-2 w-full" />
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-40" />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Skeleton className="h-10 w-32" />
                      <Skeleton className="h-10 w-48" />
                    </div>
                  </div>
                </div>

                <div className="p-6 md:w-1/3 bg-muted/30 border-t md:border-t-0 md:border-l">
                  <Skeleton className="h-5 w-32 mb-3" />
                  <div className="space-y-3">
                    {[1, 2].map((j) => (
                      <div key={j} className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div>
                          <Skeleton className="h-4 w-24 mb-1" />
                          <Skeleton className="h-3 w-12" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <Skeleton className="h-5 w-32 mb-3" />
                    <div className="bg-background rounded-md p-3">
                      <Skeleton className="h-5 w-48 mb-2" />
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="available" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <Skeleton className="h-6 w-48 mb-2" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-6 w-32" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <div className="grid grid-cols-2 gap-y-2">
                    <div>
                      <Skeleton className="h-4 w-16 mb-1" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-16 mb-1" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="col-span-2">
                      <Skeleton className="h-4 w-40 mb-1" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                </CardContent>
                <div className="p-6 pt-0">
                  <Skeleton className="h-10 w-full" />
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
