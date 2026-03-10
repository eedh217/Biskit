import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import { commonPolicies } from "@/lib/commonPolicyData";
import CommonPolicyDetailContent from "@/components/CommonPolicyDetailContent";

interface Props {
  params: { id: string };
}

export function generateStaticParams() {
  return commonPolicies.map((p) => ({ id: p.id }));
}

export default function CommonPolicyPage({ params }: Props) {
  const policy = commonPolicies.find((p) => p.id === params.id);

  if (!policy) {
    notFound();
  }

  // policy/common/ 경로에서 직접 읽기
  const filePath = path.join(process.cwd(), "policy", "common", policy.mdFile);

  // md 파일 읽기
  let content = "";
  try {
    content = fs.readFileSync(filePath, "utf-8");
  } catch (error) {
    console.error("Failed to read markdown file:", error);
    content = "# 오류\n\n정책 파일을 읽을 수 없습니다.";
  }

  return <CommonPolicyDetailContent policy={policy} content={content} />;
}
