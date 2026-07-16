import ClientPage from "./client-page"

export function generateStaticParams() {
  return [{ slug: "sample" }]
}

export default function DynamicRoutePage({
  params,
}: {
  params: { slug: string }
}) {
  return <ClientPage params={params} />
}