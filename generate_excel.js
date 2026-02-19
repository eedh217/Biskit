const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

// ── 설정 ──
const HEADER_FILL = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD6E4F0' } };
const HEADER_FONT = { bold: true, size: 10 };
const CELL_FONT   = { size: 10 };
const THIN_BORDER = {
  top:    { style: 'thin' },
  left:   { style: 'thin' },
  bottom: { style: 'thin' },
  right:  { style: 'thin' },
};
const MIN_WIDTH = 12;
const MAX_WIDTH = 60;

// ── MD 테이블 파서 ──
function parseMdTable(lines) {
  const rows = [];
  let headers = null;
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|')) continue;
    const cells = trimmed.split('|').slice(1, -1).map(c => c.trim());
    // separator 행 건너뛰기
    if (cells.every(c => /^[-:]+$/.test(c))) continue;
    if (!headers) {
      headers = cells;
    } else {
      rows.push(cells);
    }
  }
  return { headers, rows };
}

// ── 테스트케이스 MD에서 모든 TC 행 추출 ──
function extractTestcases(mdText) {
  const lines = mdText.split('\n');
  const TC_HEADERS = ['TC-ID', '화면/기능', '우선순위', '유형', '전제조건', '입력데이터', 'Steps', 'Expected', 'Error Msg', 'Req Ref'];
  const allRows = [];

  let inTable = false;
  let currentHeaders = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('| TC-ID')) {
      inTable = true;
      currentHeaders = trimmed.split('|').slice(1, -1).map(c => c.trim());
      continue;
    }
    if (inTable && trimmed.startsWith('|') && trimmed.includes('---')) {
      continue; // separator
    }
    if (inTable && trimmed.startsWith('|')) {
      const cells = trimmed.split('|').slice(1, -1).map(c => c.trim());
      if (cells.length >= TC_HEADERS.length) {
        allRows.push(cells.slice(0, TC_HEADERS.length));
      }
    } else {
      inTable = false;
    }
  }

  return { headers: TC_HEADERS, rows: allRows };
}

// ── 추적성 MD에서 테이블 추출 ──
function extractTraceability(mdText) {
  const lines = mdText.split('\n');
  const tables = [];
  let currentTable = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('|') && !trimmed.includes('---')) {
      const cells = trimmed.split('|').slice(1, -1).map(c => c.trim());
      if (!currentTable) {
        currentTable = { headers: cells, rows: [] };
      } else {
        currentTable.rows.push(cells);
      }
    } else if (trimmed.startsWith('|') && trimmed.includes('---')) {
      continue; // separator, keep current table
    } else {
      if (currentTable && currentTable.rows.length > 0) {
        tables.push(currentTable);
      }
      currentTable = null;
    }
  }
  if (currentTable && currentTable.rows.length > 0) {
    tables.push(currentTable);
  }

  return tables;
}

// ── 시트 서식 적용 ──
function applyFormatting(ws, headerCount, rowCount) {
  // 헤더 서식
  const headerRow = ws.getRow(1);
  headerRow.font = HEADER_FONT;
  for (let c = 1; c <= headerCount; c++) {
    const cell = headerRow.getCell(c);
    cell.fill = HEADER_FILL;
    cell.font = HEADER_FONT;
    cell.border = THIN_BORDER;
    cell.alignment = { vertical: 'top', wrapText: true };
  }

  // 데이터 행 서식
  for (let r = 2; r <= rowCount + 1; r++) {
    const row = ws.getRow(r);
    for (let c = 1; c <= headerCount; c++) {
      const cell = row.getCell(c);
      cell.font = CELL_FONT;
      cell.border = THIN_BORDER;
      cell.alignment = { vertical: 'top', wrapText: true };
    }
  }

  // 열 너비 자동 조절
  for (let c = 1; c <= headerCount; c++) {
    let maxLen = String(ws.getRow(1).getCell(c).value || '').length;
    for (let r = 2; r <= rowCount + 1; r++) {
      const val = String(ws.getRow(r).getCell(c).value || '');
      // 줄바꿈 고려하여 가장 긴 줄
      const lines = val.split('\n');
      for (const l of lines) {
        if (l.length > maxLen) maxLen = l.length;
      }
    }
    // 한글은 약 2배 너비
    let width = Math.ceil(maxLen * 1.2);
    width = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, width));
    ws.getColumn(c).width = width;
  }

  // 자동 필터
  ws.autoFilter = {
    from: { row: 1, column: 1 },
    to:   { row: rowCount + 1, column: headerCount },
  };

  // 첫 행 고정
  ws.views = [{ state: 'frozen', ySplit: 1 }];
}

// ── 메인 ──
async function main() {
  const tcMd = fs.readFileSync(path.join(__dirname, 'testcases_employee.md'), 'utf-8');
  const trMd = fs.readFileSync(path.join(__dirname, 'traceability_employee.md'), 'utf-8');

  const wb = new ExcelJS.Workbook();

  // ── Sheet 1: 테스트케이스 ──
  const tcData = extractTestcases(tcMd);
  const ws1 = wb.addWorksheet('테스트케이스');
  ws1.addRow(tcData.headers);
  for (const row of tcData.rows) {
    ws1.addRow(row);
  }
  applyFormatting(ws1, tcData.headers.length, tcData.rows.length);

  // ── Sheet 2: 요구사항→TC ──
  const trTables = extractTraceability(trMd);
  // 첫 번째 테이블: 요구사항→TC 매핑
  const reqToTc = trTables[0];
  const ws2 = wb.addWorksheet('요구사항→TC');
  ws2.addRow(reqToTc.headers);
  for (const row of reqToTc.rows) {
    ws2.addRow(row);
  }
  applyFormatting(ws2, reqToTc.headers.length, reqToTc.rows.length);

  // ── Sheet 3: TC→요구사항 ──
  // 커버리지 요약 테이블은 건너뛰고, TC→요구사항 역매핑 테이블 찾기
  let tcToReqTable = null;
  for (const t of trTables) {
    if (t.headers[0] === 'TC-ID' && t.headers[1] === 'Req Ref') {
      tcToReqTable = t;
      break;
    }
  }
  if (tcToReqTable) {
    const ws3 = wb.addWorksheet('TC→요구사항');
    ws3.addRow(tcToReqTable.headers);
    for (const row of tcToReqTable.rows) {
      ws3.addRow(row);
    }
    applyFormatting(ws3, tcToReqTable.headers.length, tcToReqTable.rows.length);
  }

  // ── 저장 ──
  const outPath = path.join(__dirname, 'testcases_employee.xlsx');
  await wb.xlsx.writeFile(outPath);
  console.log(`Excel 생성 완료: ${outPath}`);
  console.log(`  - 테스트케이스: ${tcData.rows.length}건`);
  console.log(`  - 요구사항→TC: ${reqToTc.rows.length}건`);
  if (tcToReqTable) {
    console.log(`  - TC→요구사항: ${tcToReqTable.rows.length}건`);
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
