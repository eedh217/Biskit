const fs = require('fs');
const path = require('path');

console.log('📋 Copying policy files...');

const sourceDir = path.join(__dirname, '../../.agents/skills/common');
const targetDir = path.join(__dirname, '../public/policies/common');

// 타겟 디렉토리 생성
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
  console.log('✓ Created target directory:', targetDir);
}

// 복사할 정책 폴더 목록
const policyFolders = ['common-ui-policy', 'excel-upload-policy'];

policyFolders.forEach(folderName => {
  const source = path.join(sourceDir, folderName);
  const target = path.join(targetDir, folderName);

  if (fs.existsSync(source)) {
    // 기존 타겟 폴더가 있으면 삭제
    if (fs.existsSync(target)) {
      fs.rmSync(target, { recursive: true, force: true });
    }

    // 복사
    fs.cpSync(source, target, { recursive: true });
    console.log(`✓ Copied ${folderName}`);
  } else {
    console.warn(`⚠ Source not found: ${source}`);
  }
});

console.log('✅ Policies copied successfully!');
