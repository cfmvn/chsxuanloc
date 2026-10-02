import https from 'https';
import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

const BASE_URL = 'https://thptxuanloc.edu.vn';

const EXCEL_FILES = [
  { year: 1986, path: '/uploads/news/2012_01/cuu_hs/1986_C_3.xls' },
  { year: 1987, path: '/uploads/news/2012_01/cuu_hs/1987_B_5.xls' },
  { year: 1988, path: '/uploads/news/2012_01/cuu_hs/1988_A_5.xls' },
  { year: 1989, path: '/uploads/news/2012_01/cuu_hs/1989_C_4.xls' },
  { year: 1990, path: '/uploads/news/2012_01/cuu_hs/1990_B_6.xls' },
  { year: 1991, path: '/uploads/news/2012_01/cuu_hs/1991_A_6.xls' },
  { year: 1992, path: '/uploads/news/2012_01/cuu_hs/1992_C_9.xls' },
  { year: 1993, path: '/uploads/news/2012_01/cuu_hs/1993_B_3.xls' },
  { year: 1994, path: '/uploads/news/2012_01/cuu_hs/1994_A_4.xls' },
  { year: 1995, path: '/uploads/news/2012_01/cuu_hs/1995_C_5.xls' },
  { year: 1996, path: '/uploads/news/2012_01/cuu_hs/1996_B_9.xls' },
  { year: 1997, path: '/uploads/news/2012_01/cuu_hs/1997_A_6.xls' },
  { year: 1998, path: '/uploads/news/2012_01/cuu_hs/1998_C_11.xls' },
  { year: 1999, path: '/uploads/news/2012_01/cuu_hs/1999_B_12.xls' },
  { year: 2000, path: '/uploads/news/2012_01/cuu_hs/2000_A_15.xls' },
  { year: 2001, path: '/uploads/news/2012_01/cuu_hs/2001_C_20.xls' },
  { year: 2002, path: '/uploads/news/2012_01/cuu_hs/2002_B_19.xls' },
  { year: 2003, path: '/uploads/news/2012_01/cuu_hs/2003_A_15.xls' },
  { year: 2004, path: '/uploads/news/2012_01/cuu_hs/2004_C_21.xls' },
  { year: 2005, path: '/uploads/news/2012_01/cuu_hs/2005_B_16.xls' },
  { year: 2006, path: '/uploads/news/2012_01/cuu_hs/2006_A_17.xls' },
  { year: 2007, path: '/uploads/news/2012_01/cuu_hs/2007_C_17.xls' },
  { year: 2008, path: '/uploads/news/2012_01/cuu_hs/2008_B_19.xls' },
  { year: 2010, path: '/uploads/news/2012_01/cuu_hs/2010_C_15.xls' },
  { year: 2011, path: '/uploads/news/2012_01/cuu_hs/2011_b_14.xls' },
];

const DOWNLOAD_DIR = path.resolve('scratch_excel_files');
if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: status ${res.statusCode}`));
        return;
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        fs.writeFileSync(dest, buffer);
        resolve(buffer);
      });
    }).on('error', reject);
  });
}

async function run() {
  const allStudents = [];
  const stats = [];

  for (const item of EXCEL_FILES) {
    const filename = path.basename(item.path);
    const dest = path.join(DOWNLOAD_DIR, filename);
    const fileUrl = BASE_URL + item.path;

    try {
      console.log(`Downloading ${filename} (${item.year})...`);
      let buffer;
      if (fs.existsSync(dest)) {
        buffer = fs.readFileSync(dest);
      } else {
        buffer = await downloadFile(fileUrl, dest);
      }

      const workbook = XLSX.read(buffer, { type: 'buffer' });
      let yearTotal = 0;

      workbook.SheetNames.forEach(sheetName => {
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        
        // Find header row with Họ và tên
        let headerIndex = -1;
        let nameCol = -1;
        let classCol = -1;
        let dobCol = -1;
        let genderCol = -1;
        let noteCol = -1;

        for (let i = 0; i < Math.min(rows.length, 10); i++) {
          const row = rows[i] || [];
          for (let j = 0; j < row.length; j++) {
            const cell = String(row[j] || '').toLowerCase().trim();
            if (cell.includes('họ') && cell.includes('tên') || cell === 'họ và tên' || cell === 'họ tên') {
              headerIndex = i;
              nameCol = j;
            } else if (cell === 'lớp' || cell.includes('lớp')) {
              classCol = j;
            } else if (cell.includes('sinh') || cell.includes('ngày sinh')) {
              dobCol = j;
            } else if (cell.includes('nữ') || cell.includes('phái') || cell.includes('giới tính')) {
              genderCol = j;
            } else if (cell.includes('ghi chú') || cell.includes('nơi sinh')) {
              noteCol = j;
            }
          }
          if (nameCol !== -1) break;
        }

        // If no explicit header, assume col 1 is name
        if (nameCol === -1) {
          nameCol = 1;
          headerIndex = 0;
        }

        for (let i = headerIndex + 1; i < rows.length; i++) {
          const row = rows[i];
          if (!row || !row[nameCol]) continue;
          const name = String(row[nameCol]).trim();
          // Filter out header noise or totals
          if (!name || name.toLowerCase().includes('tổng') || name.toLowerCase().includes('họ và tên') || name.length < 3) continue;

          let className = classCol !== -1 && row[classCol] ? String(row[classCol]).trim() : sheetName.trim();
          let dob = dobCol !== -1 && row[dobCol] ? String(row[dobCol]).trim() : '';
          let gender = genderCol !== -1 && row[genderCol] ? String(row[genderCol]).trim() : '';
          let note = noteCol !== -1 && row[noteCol] ? String(row[noteCol]).trim() : '';

          allStudents.push({
            gradYear: item.year,
            batch: `Khóa ${item.year - 3} - ${item.year}`,
            sheetName,
            name,
            className: className.replace(/^lớp\s*/i, ''),
            dob,
            gender,
            note
          });
          yearTotal++;
        }
      });

      console.log(`Parsed year ${item.year}: ${yearTotal} students across ${workbook.SheetNames.length} sheet(s).`);
      stats.push({ year: item.year, total: yearTotal, sheets: workbook.SheetNames.length });

    } catch (err) {
      console.error(`Error processing ${item.year}:`, err.message);
    }
  }

  console.log(`\n============================`);
  console.log(`TOTAL STUDENTS EXTRACTED: ${allStudents.length}`);
  console.log(`============================`);
  
  fs.writeFileSync('extracted_alumni_all.json', JSON.stringify(allStudents, null, 2));
  fs.writeFileSync('extracted_alumni_stats.json', JSON.stringify(stats, null, 2));
}

run();
