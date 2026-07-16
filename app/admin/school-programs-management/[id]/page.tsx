import ClientPage from "./client-page"

export function generateStaticParams() {
  return [{ id: "1" }]
}

export default function SchoolProgramDetailPage({
  params,
}: {
  params: { id: string }
}) {
  return <ClientPage params={params} />
}
