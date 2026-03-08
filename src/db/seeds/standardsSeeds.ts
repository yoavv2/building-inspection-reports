/**
 * Hebrew building standards seed data.
 * These are bundled locally to support offline use.
 */
import { standardsRepository } from '../repositories/standardsRepository';

const STANDARDS = [
  {
    code: 'IS-1596',
    title: 'תקן ישראלי 1596 — מעקות',
    quoteText: 'גובה מעקה מינימלי בגרם מדרגות ובמרפסות: 1.10 מ׳. הבניה חייבת לעמוד בדרישות עמידות ולחצים אופקיים לפי התקן.',
    category: 'safety',
    source: 'מכון התקנים הישראלי',
    tags: ['מעקה', 'בטיחות', 'מרפסת'],
    language: 'he',
  },
  {
    code: 'IS-1495-1',
    title: 'תקן ישראלי 1495 — נגישות לבניינים',
    quoteText: 'בניין ציבורי חייב להיות נגיש לאנשים עם מוגבלויות. שיפוע כבש נגישות מקסימלי: 1:12. רוחב מינימלי של מעבר: 90 ס"מ.',
    category: 'accessibility',
    source: 'מכון התקנים הישראלי',
    tags: ['נגישות', 'כבש', 'מוגבלות'],
    language: 'he',
  },
  {
    code: 'IS-931',
    title: 'תקן ישראלי 931 — בטיחות אש',
    quoteText: 'בניין מגורים בגובה מעל 3 קומות חייב במערכת גילוי אש אוטומטית. נדרש חדר מדרגות מוגן עשן.',
    category: 'fire',
    source: 'מכון התקנים הישראלי',
    tags: ['אש', 'ביטחות', 'גילוי אש'],
    language: 'he',
  },
  {
    code: 'IS-4466-1',
    title: 'תקן ישראלי 4466 — איטום',
    quoteText: 'איטום גגות שטוחים, מרפסות ועמדות מקלחת. חייב לכלול שכבת איטום רציפה ופינות מוחזקות.',
    category: 'waterproofing',
    source: 'מכון התקנים הישראלי',
    tags: ['איטום', 'גג', 'מרפסת', 'מים'],
    language: 'he',
  },
  {
    code: 'IS-466',
    title: 'תקן ישראלי 466 — ריצוף וחיפוי',
    quoteText: 'שיפוע ריצוף בחדרי מקלחת ואמבטיה: מינימום 1.5% לכיוון הניקוז. אריחים חייבים להיות יציבים וללא תנועה.',
    category: 'structural',
    source: 'מכון התקנים הישראלי',
    tags: ['ריצוף', 'שיפוע', 'ניקוז', 'אריחים'],
    language: 'he',
  },
  {
    code: 'TAKANOT-TICHNUM-2018',
    title: 'תקנות התכנון והבנייה — 2018',
    quoteText: 'תקנות המגדירות דרישות מינימום לחוזק קונסטרוקטיבי, גובה תקרה, שטחי אוורור ותאורה טבעית.',
    category: 'structural',
    source: 'משרד הפנים',
    tags: ['תכנון', 'בנייה', 'קונסטרוקציה'],
    language: 'he',
  },
  {
    code: 'IS-1220',
    title: 'תקן ישראלי 1220 — בידוד תרמי',
    quoteText: 'דרישות בידוד תרמי לקירות חיצוניים וגגות. מקדם מעבר חום מרבי (U-value) לפי אזור אקלימי.',
    category: 'general',
    source: 'מכון התקנים הישראלי',
    tags: ['בידוד', 'תרמי', 'קיר', 'גג'],
    language: 'he',
  },
  {
    code: 'IS-5281',
    title: 'תקן ישראלי 5281 — בנייה ירוקה',
    quoteText: 'קריטריונים לבנייה ירוקה הכוללים יעילות אנרגטית, ניהול מים, חומרי בנייה ואיכות אוויר פנימי.',
    category: 'general',
    source: 'מכון התקנים הישראלי',
    tags: ['ירוק', 'אנרגיה', 'קיימות'],
    language: 'he',
  },
];

export async function seedStandards(): Promise<void> {
  for (const standard of STANDARDS) {
    await standardsRepository.upsert(standard);
  }
}
