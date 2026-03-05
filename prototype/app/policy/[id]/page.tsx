import { notFound } from "next/navigation";
import { allPolicies } from "@/lib/policyData";
import PolicyDetailContent from "@/components/PolicyDetailContent";

interface Props {
  params: { id: string };
}

export function generateStaticParams() {
  return allPolicies.map((p) => ({ id: p.id }));
}

export default function PolicyDetailPage({ params }: Props) {
  const policy = allPolicies.find((p) => p.id === params.id);

  if (!policy) {
    notFound();
  }

  return <PolicyDetailContent policy={policy} />;
}
