import ClientPage from "../../surveys/[slug]/client-page"

export function generateStaticParams() {
  return [{ slug: "sample" }]
}

export default function SurveyAliasPage({
  params,
}: {
  params: { slug: string }
}) {
  return <ClientPage params={params} />
}