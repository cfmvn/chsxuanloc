import fs from 'fs';
import path from 'path';
import pkg from 'xlsx';
const { read, utils } = pkg;

const DOWNLOAD_DIR = path.resolve('scratch_excel_files');

const EXCEL_FILES = [
  { year: 1986, file: '1986_C_3.xls' },
  { year: 1987, file: '1987_B_5.xls' },
  { year: 1988, file: '1988_A_5.xls' },
  { year: 1989, file: '1989_C_4.xls' },
  { year: 1990, file: '1990_B_6.xls' },
  { year: 1995, file: '1995_C_5.xls' },
  { year: 2000, file: '2000_A_15.xls' },
  { year: 2005, file: '2005_B_16.xls' },
  { year: 2011, file: '2011_b_14.xls' },
];

for (const item of EXCEL_FILES) {
  const filePath = path.join(DOWNLOAD_DIR, item.file);
  const buffer = fs.readFileSync(filePath);
  const workbook = read(buffer, { type: 'buffer' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = utils.sheet_to_json(sheet, { header: 1 });
  console.log(`\n=== YEAR ${item.year} - Sheet ${workbook.SheetNames[0]} ===`);
  for (let i = 0; i < Math.min(rows.length, 6); i++) {
    console.log(`Row ${i}:`, JSON.stringify(rows[i]));
  }
}
