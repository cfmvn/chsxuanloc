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
  { year: 1991, file: '1991_A_6.xls' },
  { year: 1992, file: '1992_C_9.xls' },
  { year: 1993, file: '1993_B_3.xls' },
  { year: 1994, file: '1994_A_4.xls' },
  { year: 1995, file: '1995_C_5.xls' },
  { year: 1996, file: '1996_B_9.xls' },
  { year: 1997, file: '1997_A_6.xls' },
  { year: 1998, file: '1998_C_11.xls' },
  { year: 1999, file: '1999_B_12.xls' },
  { year: 2000, file: '2000_A_15.xls' },
  { year: 2001, file: '2001_C_20.xls' },
  { year: 2002, file: '2002_B_19.xls' },
  { year: 2003, file: '2003_A_15.xls' },
  { year: 2004, file: '2004_C_21.xls' },
  { year: 2005, file: '2005_B_16.xls' },
  { year: 2006, file: '2006_A_17.xls' },
  { year: 2007, file: '2007_C_17.xls' },
  { year: 2008, file: '2008_B_19.xls' },
  { year: 2010, file: '2010_C_15.xls' },
  { year: 2011, file: '2011_b_14.xls' },
];

// Helper to convert VNI-Windows or TCVN3 to Unicode if needed
const vniMap = {
  'aù': 'á', 'aø': 'à', 'aû': 'ả', 'aõ': 'ã', 'aï': 'ạ',
  'aê': 'ă', 'aé': 'ắ', 'aè': 'ằ', 'aú': 'ẳ', 'aü': 'ẵ', 'aë': 'ặ',
  'aâ': 'â', 'aá': 'ấ', 'aà': 'ầ', 'aå': 'ẩ', 'aã': 'ẫ', 'aä': 'ậ',
  'eù': 'é', 'eø': 'è', 'eû': 'ẻ', 'eõ': 'ẽ', 'eï': 'ẹ',
  'eâ': 'ê', 'eá': 'ế', 'eà': 'ề', 'eå': 'ể', 'eã': 'ễ', 'eä': 'ệ',
  'où': 'ó', 'oø': 'ò', 'oû': 'ỏ', 'oõ': 'õ', 'oï': 'ọ',
  'oâ': 'ô', 'oá': 'ố', 'oà': 'ồ', 'oå': 'ổ', 'oã': 'ỗ', 'oä': 'ộ',
  'ôù': 'ớ', 'ôø': 'ờ', 'ôû': 'ở', 'ôõ': 'ỡ', 'ôï': 'ợ',
  'uù': 'ú', 'uø': 'ù', 'uû': 'ủ', 'uõ': 'ũ', 'uï': 'ụ',
  'öù': 'ứ', 'öø': 'ừ', 'öû': 'ử', 'öõ': 'ữ', 'öï': 'ự',
  'yù': 'ý', 'yø': 'ỳ', 'yû': 'ỷ', 'yõ': 'ỹ', 'yï': 'ỵ',
  'ñ': 'đ', 'Ñ': 'Đ',
  'AÙ': 'Á', 'AØ': 'À', 'AÛ': 'Ả', 'AÕ': 'Ã', 'AÏ': 'Ạ',
  'AÊ': 'Ă', 'AÉ': 'Ắ', 'AÈ': 'Ằ', 'AÚ': 'Ẳ', 'AÜ': 'Ẵ', 'AË': 'Ặ',
  'AÂ': 'Â', 'AÁ': 'Ấ', 'AÀ': 'Ầ', 'AÅ': 'Ẩ', 'AÃ': 'Ẫ', 'AÄ': 'Ậ',
  'EÙ': 'É', 'EØ': 'È', 'EÛ': 'Ẻ', 'EÕ': 'Ẽ', 'EÏ': 'Ẹ',
  'EÂ': 'Ê', 'EÁ': 'Ế', 'EÀ': 'Ề', 'EÅ': 'Ể', 'EÃ': 'Ễ', 'EÄ': 'Ệ',
  'OÙ': 'Ó', 'OØ': 'Ò', 'OÛ': 'Ỏ', 'OÕ': 'Õ', 'OÏ': 'Ọ',
  'OÂ': 'Ô', 'OÁ': 'Ố', 'OÀ': 'Ồ', 'OÅ': 'Ổ', 'OÃ': 'Ỗ', 'OÄ': 'Ộ',
  'ÔÙ': 'Ớ', 'ÔØ': 'Ờ', 'ÔÛ': 'Ở', 'ÔÕ': 'Ỡ', 'ÔÏ': 'Ợ',
  'UÙ': 'Ú', 'UØ': 'Ù', 'UÛ': 'Ủ', 'UÕ': 'Ũ', 'UÏ': 'Ụ',
  'ÖÙ': 'Ứ', 'ÖØ': 'Ừ', 'ÖÛ': 'Ử', 'ÖÕ': 'Ữ', 'ÖÏ': 'Ự',
  'YÙ': 'Ý', 'YØ': 'Ỳ', 'YÛ': 'Ỷ', 'YÕ': 'Ỹ', 'YÏ': 'Ỵ'
};

function decodeVni(str) {
  if (!str) return '';
  let res = String(str);
  // Special characters like ö, ñ, etc.
  res = res.replace(/ö/g, 'ư').replace(/Ö/g, 'Ư');
  res = res.replace(/ñ/g, 'đ').replace(/Ñ/g, 'Đ');
  res = res.replace(/ô/g, 'ơ').replace(/Ô/g, 'Ơ');
  res = res.replace(/oâ/g, 'ô').replace(/OÂ/g, 'Ô');
  res = res.replace(/eâ/g, 'ê').replace(/EÂ/g, 'Ê');
  res = res.replace(/aâ/g, 'â').replace(/AÂ/g, 'Â');
  res = res.replace(/aê/g, 'ă').replace(/AÊ/g, 'Ă');

  for (const [k, v] of Object.entries(vniMap)) {
    res = res.replaceAll(k, v);
  }
  return res;
}

function parseExcelDate(val) {
  if (!val) return '';
  if (typeof val === 'number') {
    // Excel serial date
    const date = new Date(Math.round((val - 25569) * 86400 * 1000));
    const d = String(date.getUTCDate()).padStart(2, '0');
    const m = String(date.getUTCMonth() + 1).padStart(2, '0');
    const y = date.getUTCFullYear();
    return `${d}/${m}/${y}`;
  }
  return String(val).trim();
}

function cleanName(str) {
  if (!str) return '';
  return str.replace(/\s+/g, ' ').trim();
}

const allStudents = [];
const yearClassMap = {};

let idCounter = 1;

for (const item of EXCEL_FILES) {
  const filePath = path.join(DOWNLOAD_DIR, item.file);
  const buffer = fs.readFileSync(filePath);
  const workbook = read(buffer, { type: 'buffer' });
  
  yearClassMap[item.year] = {
    year: item.year,
    batch: `Khóa ${item.year - 3} - ${item.year}`,
    classes: {},
    total: 0
  };

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const rows = utils.sheet_to_json(sheet, { header: 1 });
    if (!rows || rows.length < 2) continue;

    // Detect format:
    // Format A (2 separate columns: Họ đệm + Tên) vs Format B (1 single column: Họ và Tên)
    let headerRowIdx = -1;
    let hoDemIdx = -1;
    let tenIdx = -1;
    let fullNameIdx = -1;
    let dobIdx = -1;
    let genderIdx = -1;
    let pobIdx = -1;
    let classIdx = -1;

    for (let r = 0; r < Math.min(rows.length, 10); r++) {
      const row = rows[r] || [];
      for (let c = 0; c < row.length; c++) {
        const val = String(row[c] || '').toLowerCase().trim();
        const decoded = decodeVni(val);

        if (decoded.includes('họ đệm') || val.includes('ho dem') || val === 'họ đệm' || val === 'hoï ñeäm') {
          headerRowIdx = r;
          hoDemIdx = c;
        } else if (val === 'tên' || val === 'teân' || decoded === 'tên') {
          headerRowIdx = r;
          tenIdx = c;
        } else if (decoded.includes('họ và tên') || decoded.includes('họ tên') || val === 'hoï teân' || val.includes('ho va ten')) {
          headerRowIdx = r;
          fullNameIdx = c;
        } else if (decoded.includes('ngày sinh') || decoded.includes('sinh ngày') || val.includes('ngaøy sinh')) {
          dobIdx = c;
        } else if (decoded.includes('giới tính') || decoded.includes('phái') || val.includes('phaùi')) {
          genderIdx = c;
        } else if (decoded.includes('nơi sinh') || decoded.includes('quê quán') || val.includes('nôi sinh')) {
          pobIdx = c;
        } else if (val === 'lớp' || val === 'lôùp' || decoded === 'lớp') {
          classIdx = c;
        }
      }
      if (headerRowIdx !== -1) break;
    }

    if (headerRowIdx === -1) {
      headerRowIdx = 2;
      hoDemIdx = 1;
      tenIdx = 2;
      dobIdx = 3;
      genderIdx = 4;
      pobIdx = 5;
    }

    for (let r = headerRowIdx + 1; r < rows.length; r++) {
      const row = rows[r];
      if (!row) continue;

      let fullName = '';
      if (hoDemIdx !== -1 && tenIdx !== -1 && (row[hoDemIdx] || row[tenIdx])) {
        const ho = decodeVni(String(row[hoDemIdx] || ''));
        const ten = decodeVni(String(row[tenIdx] || ''));
        fullName = cleanName(`${ho} ${ten}`);
      } else if (fullNameIdx !== -1 && row[fullNameIdx]) {
        fullName = cleanName(decodeVni(String(row[fullNameIdx])));
      } else if (row[1]) {
        fullName = cleanName(decodeVni(String(row[1])));
      }

      // Validate name
      if (!fullName || 
          fullName.toLowerCase().includes('tổng cộng') || 
          fullName.toLowerCase().includes('họ và tên') || 
          fullName.toLowerCase().includes('họ đệm') || 
          fullName.length < 3 ||
          fullName.toLowerCase().includes('danh sách')) {
        continue;
      }

      let dob = dobIdx !== -1 ? parseExcelDate(row[dobIdx]) : '';
      let gender = genderIdx !== -1 ? cleanName(decodeVni(String(row[genderIdx] || ''))) : '';
      let pob = pobIdx !== -1 ? cleanName(decodeVni(String(row[pobIdx] || ''))) : '';
      
      let className = '';
      if (classIdx !== -1 && row[classIdx]) {
        className = cleanName(decodeVni(String(row[classIdx])));
      } else {
        className = sheetName.replace(/^lớp\s*/i, '').replace(/^lop\s*/i, '').trim();
      }

      // Normalise class name (e.g. C1 -> 12C1 or C1)
      const record = {
        id: `alm-official-${idCounter++}`,
        fullName,
        gradYear: item.year,
        batch: `Khóa ${item.year - 3} - ${item.year}`,
        className,
        dob,
        gender,
        pob,
        verified: true
      };

      allStudents.push(record);

      if (!yearClassMap[item.year].classes[className]) {
        yearClassMap[item.year].classes[className] = [];
      }
      yearClassMap[item.year].classes[className].push(record);
      yearClassMap[item.year].total++;
    }
  }
}

console.log(`Successfully processed ${allStudents.length} official alumni records!`);

// Write out JSON files
fs.writeFileSync('public/data/official_alumni_all.json', JSON.stringify(allStudents));
fs.writeFileSync('public/data/official_alumni_by_year.json', JSON.stringify(yearClassMap, null, 2));

// Generate TypeScript summary file for static pages
const summaryCode = `// Generated from official School archives (1986 - 2011)
export interface OfficialAlumnus {
  id: string;
  fullName: string;
  gradYear: number;
  batch: string;
  className: string;
  dob?: string;
  gender?: string;
  pob?: string;
  verified: boolean;
}

export interface YearGraduationSummary {
  year: number;
  batch: string;
  totalStudents: number;
  classCount: number;
  classes: string[];
}

export const GRADUATION_YEARS_SUMMARY: YearGraduationSummary[] = ${JSON.stringify(
  Object.values(yearClassMap).map(y => ({
    year: y.year,
    batch: y.batch,
    totalStudents: y.total,
    classCount: Object.keys(y.classes).length,
    classes: Object.keys(y.classes)
  })),
  null,
  2
)};

export const TOTAL_OFFICIAL_ALUMNI = ${allStudents.length};
`;

fs.writeFileSync('src/data/officialAlumniSummary.ts', summaryCode);
console.log('Saved src/data/officialAlumniSummary.ts and public JSON datasets.');
