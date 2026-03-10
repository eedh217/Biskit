import fs from "fs";
import path from "path";
import { spsMonthlyTabs } from "@/lib/spsPolicyConfig";
import SpsPolicyTabs from "@/components/SpsPolicyTabs";

// 서버에서 MD 파일 읽기
function getPolicyContent(mdFile: string): string {
  const filePath = path.join(process.cwd(), "policy", "SPS", mdFile);
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch (error) {
    console.error("Failed to read markdown file:", error);
    return "# 오류\n\n정책 파일을 읽을 수 없습니다.";
  }
}

export default function PolicySpsMonthlyPage() {
  // 탭 데이터 생성 (MD 파일 읽기)
  const tabs = spsMonthlyTabs.map((tab) => ({
    ...tab,
    content: getPolicyContent(tab.mdFile),
  }));

  return <SpsPolicyTabs tabs={tabs} />;
}
