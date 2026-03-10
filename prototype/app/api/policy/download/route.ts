import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

const ALLOWED_FILES = new Set([
  // SPS 정책 파일
  "policy_사업소득합산_merged.md",
  "policy_사업소득월별리스트_merged.md",
  "policy_사업소득추가팝업_merged.md",
  "policy_사업소득수정팝업_merged.md",
  "policy_사업소득엑셀업로드_merged.md",
  "policy_전체사업소득_merged.md",
  "policy_전체사업소득추가팝업_merged.md",
  "policy_전체사업소득수정팝업_merged.md",
  "policy_사업소득그룹수정팝업_merged.md",
  // 공통 정책 파일
  "common-ui-policy.md",
  "excel-upload-policy.md",
]);

export async function GET(request: NextRequest) {
  const file = request.nextUrl.searchParams.get("file");

  if (!file || !ALLOWED_FILES.has(file)) {
    return NextResponse.json({ error: "Invalid file" }, { status: 400 });
  }

  // 파일 경로 결정 (공통 정책 vs SPS 정책)
  let filePath: string;
  if (file === "common-ui-policy.md" || file === "excel-upload-policy.md") {
    filePath = path.join(process.cwd(), "policy", "common", file);
  } else {
    filePath = path.join(process.cwd(), "policy", "SPS", file);
  }

  try {
    const content = await readFile(filePath);
    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(file)}`,
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
