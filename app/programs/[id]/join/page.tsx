import ClientPage from "./client-page"

export function generateStaticParams() {
  return [{ id: "1" }]
}

export default function DynamicRoutePage({
  params,
}: {
  params: { id: string }
}) {
  return <ClientPage params={params} />
}