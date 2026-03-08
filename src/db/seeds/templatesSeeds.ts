/**
 * Hebrew finding template seed data.
 * Common defect types for building inspections.
 */
import { templatesRepository } from '../repositories/templatesRepository';

const TEMPLATES = [
  // Waterproofing
  {
    title: 'ליקוי איטום מרפסת',
    category: 'waterproofing',
    defaultDescription: 'נמצא ליקוי באיטום המרפסת. האיטום נסדק / ניתק / לא תקין. נצפו סימני חדירת מים ועקבות לחות בתקרה.',
    defaultStandardQuote: 'לפי תקן ישראלי 4466 — איטום גגות ומרפסות, נדרשת שכבת איטום רציפה ופינות מוחזקות.',
    defaultConclusion: 'יש לבצע תיקון מקיף של שכבת האיטום. מומלץ להשתמש בחומרי איטום מאושרים ולבדוק את כל הפינות והמעברים.',
    defaultRepairCostRange: '3,000–8,000 ₪',
    tags: ['איטום', 'מרפסת', 'מים', 'לחות'],
    language: 'he',
  },
  {
    title: 'ליקוי איטום גג',
    category: 'waterproofing',
    defaultDescription: 'נמצאו סימני חדירת מים בגג. שכבת האיטום בלויה / נסדקה / ניתקה. נצפים כתמי לחות בתקרת הקומה העליונה.',
    defaultStandardQuote: 'לפי תקן ישראלי 4466, יש לשמור על שלמות שכבת האיטום לאורך כל שטח הגג.',
    defaultConclusion: 'יש לבצע בדיקת גג מקיפה ולהחליף את שכבת האיטום. טרם ביצוע העבודה, יש לאתר את מקורות הנזילה.',
    defaultRepairCostRange: '8,000–25,000 ₪',
    tags: ['איטום', 'גג', 'נזילה', 'מים'],
    language: 'he',
  },
  // Cracks
  {
    title: 'סדק בקיר',
    category: 'cracks',
    defaultDescription: 'נמצא סדק בקיר. רוחב הסדק כ-___ מ"מ. הסדק ממוקם ב___. אופי הסדק: אופקי / אנכי / אלכסוני.',
    defaultStandardQuote: 'סדקים בקירות נשאים מעל 0.3 מ"מ מצריכים בדיקה הנדסית לפי תקנות הבטיחות בבנייה.',
    defaultConclusion: 'יש לבדוק האם הסדק פעיל (מתרחב). מומלץ לבצע ניטור וסריקה הנדסית לפני ביצוע תיקון. תיקון בחומרי אפוקסי / טיח מיוחד.',
    defaultRepairCostRange: '500–3,000 ₪',
    tags: ['סדק', 'קיר', 'קונסטרוקציה'],
    language: 'he',
  },
  // Flooring
  {
    title: 'שיפוע לא תקין ברצפה',
    category: 'flooring',
    defaultDescription: 'שיפוע הרצפה אינו עומד בדרישות התקן. נמדד שיפוע של ___% בכיוון שגוי / אפסי, המונע ניקוז תקין של מים.',
    defaultStandardQuote: 'לפי תקן ישראלי 466, שיפוע ריצוף בחדרי מקלחת ואמבטיה צריך להיות מינימום 1.5% לכיוון הניקוז.',
    defaultConclusion: 'יש לבצע בדיקת שיפועים ולתקן את הריצוף. הפתרון עשוי לדרוש הסרת אריחים והנחה מחדש עם שיפוע תקין.',
    defaultRepairCostRange: '2,000–10,000 ₪',
    tags: ['ריצוף', 'שיפוע', 'ניקוז', 'אריחים'],
    language: 'he',
  },
  {
    title: 'אריחים רופפים / ניפוח',
    category: 'flooring',
    defaultDescription: 'נמצאו אריחי ריצוף רופפים / מנופחים. קיים קול חלול בנקישה. האריחים כבר הגיעו לקצה יכולת הדבק.',
    defaultStandardQuote: 'לפי תקן ישראלי 466, אריחים חייבים להיות מחוברים היטב ללא תנועה ורוחב פגיות אחיד.',
    defaultConclusion: 'יש לבדוק את היקף הנזק ולסמן את כל האריחים הרופפים. ניפוח עלול להוביל לשבירה. מומלץ להחליף אריחים מנופחים בהקדם.',
    defaultRepairCostRange: '1,500–6,000 ₪',
    tags: ['אריחים', 'ריצוף', 'ניפוח', 'רופף'],
    language: 'he',
  },
  // Plaster / finish
  {
    title: 'טיח מתקלף / ניתק',
    category: 'plaster',
    defaultDescription: 'נמצאו אזורים בהם הטיח מתקלף ומנותק מהקיר. ישנה לחות נצפית מאחורי שכבת הטיח.',
    defaultStandardQuote: '',
    defaultConclusion: 'יש לסיים את כל האזורים עם טיח מתקלף, לאתר את מקור הלחות ולבצע טיפול לפני שתוט מחדש.',
    defaultRepairCostRange: '1,000–5,000 ₪',
    tags: ['טיח', 'קיר', 'לחות', 'קילוף'],
    language: 'he',
  },
  // Moisture
  {
    title: 'לחות וחדירת מים',
    category: 'moisture',
    defaultDescription: 'נצפים כתמי לחות / עובש בקיר / בתקרה. ישנה עדות לחדירת מים חוזרת. ריח עובש במקום.',
    defaultStandardQuote: '',
    defaultConclusion: 'יש לאתר את מקור חדירת המים לפני כל תיקון. מקורות אפשריים: נזילת צינורות, ליקויי איטום, קיר חשוף. לאחר איתור — תיקון מקור הנזילה ואז שיפוץ הנזק.',
    defaultRepairCostRange: '2,000–15,000 ₪',
    tags: ['לחות', 'מים', 'עובש', 'נזילה'],
    language: 'he',
  },
  // Railing / safety
  {
    title: 'מעקה לא תקין',
    category: 'railing',
    defaultDescription: 'גובה המעקה אינו עומד בדרישות התקן (נמדד ___ ס"מ). המעקה רופף / חסר חלקים / בלוי.',
    defaultStandardQuote: 'לפי תקן ישראלי 1596, גובה מעקה מינימלי הוא 1.10 מ׳. המעקה חייב לעמוד בעומסי כוח אופקיים.',
    defaultConclusion: 'מדובר בסיכון בטיחותי מיידי. יש לתקן / להחליף את המעקה בהתאם לדרישות תקן 1596 לפני השימוש במרפסת.',
    defaultRepairCostRange: '2,500–8,000 ₪',
    tags: ['מעקה', 'בטיחות', 'מרפסת'],
    language: 'he',
  },
  // Balcony slope
  {
    title: 'שיפוע לא תקין במרפסת',
    category: 'balcony',
    defaultDescription: 'שיפוע המרפסת אינו תקין. נמדד שיפוע של ___% (נדרש מינימום 1%). המים אינם מנוקזים כראוי לכיוון המרזב.',
    defaultStandardQuote: 'לפי תקן ישראלי 4466 ותקנות התכנון, שיפוע מרפסת חייב להיות לפחות 1% לכיוון הניקוז.',
    defaultConclusion: 'עקב שיפוע לא מספיק, מים עומדים על המרפסת ומחלחלים לשכבת האיטום. יש לבצע ריצוף מחדש עם שיפוע תקין.',
    defaultRepairCostRange: '5,000–18,000 ₪',
    tags: ['מרפסת', 'שיפוע', 'ניקוז', 'מים'],
    language: 'he',
  },
  // Electrical
  {
    title: 'ליקוי חשמלי',
    category: 'electrical',
    defaultDescription: 'נמצאו ליקויים בלוח החשמל / בחיווט / בשקעים. פירוט: ___.',
    defaultStandardQuote: 'לפי תקנות ההגנה על הצרכן (חשמל) ותקן ישראלי 1220, נדרשת עמידה בתקני בטיחות חשמל.',
    defaultConclusion: 'יש להזמין חשמלאי מוסמך לבדיקה ותיקון. אין להשתמש במתקנים פגומים עד לתיקון.',
    defaultRepairCostRange: '500–5,000 ₪',
    tags: ['חשמל', 'לוח', 'שקע', 'חיווט'],
    language: 'he',
  },
];

export async function seedTemplates(): Promise<void> {
  for (const template of TEMPLATES) {
    await templatesRepository.create(template);
  }
}
