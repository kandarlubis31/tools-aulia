import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read the generated word list
const wordsPath = path.join(__dirname, '..', 'src', 'data', 'id-words.ts');
const wordsContent = fs.readFileSync(wordsPath, 'utf8');

// Extract the array
const match = wordsContent.match(/export const idWords: string\[\] = (\[[\s\S]*?\]);/);
if (!match) {
  console.error('Could not parse id-words.ts');
  process.exit(1);
}

const words = JSON.parse(match[1]);
console.log('Total words: ' + words.length + '\n');

const issues = [];
const checked = new Set();

function check(condition, word, reason) {
  if (condition && !checked.has(word)) {
    issues.push({ word, reason });
    checked.add(word);
  }
}

const unusualPatterns = [
  [/[xz][^aiueo]/i, 'X/Z diikuti konsonan (kemungkinan kata Inggris/typo)'],
  [/[q][^u]/i, 'Q tidak diikuti U (jarang dalam BI)'],
  [/[fv][^aiueo]/i, 'F/V diikuti konsonan (kemungkinan Inggris)'],
  [/^[xzfv]/, 'Dimulai dengan X/Z/F/V (jarang dalam BI)'],
  [/[^aiueo]{4,}/, '4+ konsonan berurutan (sangat jarang BI)'],
  [/^[^aiueo]{3,}/, '3+ konsonan di awal (jarang BI)'],
];

// Check unusual character patterns
for (const word of words) {
  if (checked.has(word)) continue;

  for (const [regex, reason] of unusualPatterns) {
    if (regex.test(word)) {
      check(true, word, reason);
      break;
    }
  }
}

// Check for specific suspected misspellings
const commonEnglishWords = new Set([
  'thinking', 'problem', 'solving', 'survival', 'random',
  'purposive', 'stratified', 'cluster', 'accidental', 'snowball',
  'recovery', 'bubble', 'forecasting', 'budgeting', 'burnout',
  'wellbeing', 'mindfulness', 'rewilding', 'library', 'research',
  'method', 'mixed', 'netzero', 'niche', 'crowdfunding',
  'fullstack', 'backend', 'frontend', 'machinelearning',
  'deeplearning', 'neuralnetwork', 'artificialintelligence',
  'mobilebanking', 'deductible', 'underwriting',
  'solarpanel', 'blockchain', 'bigdata',
  'corollary', 'lemma',
]);

const englishWords = [];
for (const word of words) {
  if (word.length >= 3 && commonEnglishWords.has(word) && !checked.has(word)) {
    englishWords.push(word);
  }
}

// Group by reason
const byReason = {};
for (const { word, reason } of issues) {
  if (!byReason[reason]) byReason[reason] = [];
  byReason[reason].push(word);
}

console.log('='.repeat(80));
console.log('KATA DENGAN POLA KARAKTER MENINGKATKAN KECURIGAAN');
console.log('='.repeat(80));

for (const [reason, words] of Object.entries(byReason)) {
  console.log('\n--- ' + reason + ' (' + words.length + ' kata) ---');
  words.sort();
  for (let i = 0; i < words.length; i += 10) {
    console.log('  ' + words.slice(i, i + 10).join(', '));
  }
}

console.log('\n' + '='.repeat(80));
console.log('Total potensi typo: ' + issues.length + ' kata');

console.log('\n' + '='.repeat(80));
console.log('KATA INGGRIS YANG MUNGKIN PERLU DIECEK ULANG');
console.log('='.repeat(80));
for (let i = 0; i < englishWords.length; i += 10) {
  console.log('  ' + englishWords.slice(i, i + 10).join(', '));
}
console.log('Total: ' + englishWords.length + ' kata');

// Specific suspicious words check
console.log('\n' + '='.repeat(80));
console.log('CEK MANUAL: KATA YANG PERLU DITINJAU');
console.log('='.repeat(80));

const suspiciousWords = {
  'paliative': 'Mungkin "paliatif" (indonesia)',
  'simptom': 'Mungkin "symptom" (inggris) atau "gejala" (indonesia)',
  'akutansi': 'Seharusnya "akuntansi" (accounting) - TYPO!',
  'defrontasi': 'Tidak dikenal - mungkin typo "deforestasi"?',
  'intidal': 'Tidak dikenal dalam KBBI',
  'litoster': 'Mungkin "litosfer" (lithosphere)',
  'mamalogi': 'Seharusnya "mammalogi" (mammalogy)',
  'asamnukleat': 'Seharusnya "asam nukleat" (2 kata)',
  'resiliensi': 'Cek ejaan KBBI',
  'koroborasi': 'Mungkin "korelasi" atau "koroborasi"?',
  'sirpahmakan': 'TYPO - udah dihapus?',
  'rebt': 'TYPO - udah dihapus?',
};

for (const [word, note] of Object.entries(suspiciousWords)) {
  if (words.includes(word)) {
    console.log('  ❌ "' + word + '" - ' + note + ' - MASIH ADA');
  } else {
    console.log('  ✅ "' + word + '" - SUDAH DIHAPUS');
  }
}

console.log('\n' + '='.repeat(80));
console.log('STATISTIK');
console.log('='.repeat(80));
console.log('Total kata: ' + words.length);
console.log('Kata dengan pola aneh: ' + issues.length);
console.log('Kata Inggris potensial: ' + englishWords.length);
