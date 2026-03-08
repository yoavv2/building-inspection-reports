/**
 * Hebrew UI strings — all user-facing text
 * Internal code, keys, and comments remain in English.
 */
export const he = {
  // App
  appName: 'דוח בדיקת בניין',

  // Navigation
  nav: {
    projects: 'פרויקטים',
    settings: 'הגדרות',
    back: 'חזרה',
    done: 'סיום',
    cancel: 'ביטול',
    save: 'שמירה',
  },

  // Common actions
  actions: {
    add: 'הוסף',
    edit: 'ערוך',
    delete: 'מחק',
    confirm: 'אישור',
    cancel: 'ביטול',
    save: 'שמור',
    export: 'ייצא',
    preview: 'תצוגה מקדימה',
    search: 'חיפוש',
    select: 'בחר',
    close: 'סגור',
    retry: 'נסה שנית',
    share: 'שתף',
  },

  // Common labels
  common: {
    required: 'שדה חובה',
    optional: 'אופציונלי',
    notProvided: 'לא סופק',
    loading: 'טוען...',
    saving: 'שומר...',
    error: 'שגיאה',
    success: 'הצלחה',
    empty: 'אין פריטים',
    unknown: 'לא ידוע',
    yes: 'כן',
    no: 'לא',
    currency: '₪',
  },

  // Projects
  projects: {
    title: 'פרויקטים',
    new: 'פרויקט חדש',
    empty: 'אין פרויקטים עדיין',
    emptyHint: 'לחץ על + כדי ליצור פרויקט חדש',
    clientName: 'שם לקוח',
    clientNamePlaceholder: 'הכנס שם לקוח',
    propertyAddress: 'כתובת הנכס',
    propertyAddressPlaceholder: 'הכנס כתובת',
    inspectionDate: 'תאריך בדיקה',
    inspectorName: 'שם הבודק',
    inspectorNamePlaceholder: 'הכנס שם הבודק',
    propertyType: 'סוג נכס',
    propertyTypes: {
      apartment: 'דירה',
      house: 'בית פרטי',
      office: 'משרד',
      commercial: 'מסחרי',
      industrial: 'תעשייתי',
      other: 'אחר',
    },
    notes: 'הערות',
    notesPlaceholder: 'הערות נוספות',
    status: {
      draft: 'טיוטה',
      completed: 'הושלם',
      exported: 'יוצא',
    },
    deleteConfirm: 'האם למחוק פרויקט זה? פעולה זו אינה ניתנת לביטול.',
    deleteTitle: 'מחיקת פרויקט',
    editTitle: 'עריכת פרויקט',
    createTitle: 'פרויקט חדש',
    findingsCount: (n: number) => `${n} ממצאים`,
    areasCount: (n: number) => `${n} אזורים`,
    createdAt: 'נוצר ב',
  },

  // Project dashboard
  dashboard: {
    title: 'לוח בקרה',
    addArea: 'הוסף אזור',
    addFinding: 'הוסף ממצא',
    previewReport: 'תצוגת דוח',
    exportReport: 'ייצוא דוח',
    areas: 'אזורים',
    findings: 'ממצאים',
    summary: 'סיכום',
    projectDetails: 'פרטי פרויקט',
  },

  // Areas
  areas: {
    title: 'אזורים',
    new: 'אזור חדש',
    empty: 'אין אזורים',
    emptyHint: 'הוסף אזורים כגון: סלון, מטבח, חדר רחצה',
    name: 'שם האזור',
    namePlaceholder: 'לדוגמה: סלון, מרפסת, גג',
    description: 'תיאור',
    descriptionPlaceholder: 'תיאור האזור',
    deleteConfirm: 'מחיקת האזור תמחק גם את כל הממצאים בו. להמשיך?',
    deleteTitle: 'מחיקת אזור',
    editTitle: 'עריכת אזור',
    createTitle: 'אזור חדש',
    presets: {
      exterior: 'חזית',
      salon: 'סלון',
      kitchen: 'מטבח',
      bathroom: 'חדר רחצה',
      bedroom: 'חדר שינה',
      balcony: 'מרפסת',
      roof: 'גג',
      stairwell: 'חדר מדרגות',
      parking: 'חניה',
      lobby: 'לובי',
    },
    quickAdd: 'הוסף אזור מהרשימה',
  },

  // Findings
  findings: {
    title: 'ממצאים',
    new: 'ממצא חדש',
    empty: 'אין ממצאים',
    emptyHint: 'הוסף ממצאים לאזור זה',
    findingTitle: 'כותרת הממצא',
    findingTitlePlaceholder: 'תאר את הממצא בקצרה',
    description: 'תיאור',
    descriptionPlaceholder: 'תאר את הממצא בפירוט',
    severity: 'חומרה',
    severityLevels: {
      high: 'גבוהה',
      medium: 'בינונית',
      low: 'נמוכה',
    },
    conclusion: 'מסקנה והמלצה',
    conclusionPlaceholder: 'פירוט המלצות לתיקון',
    repairCost: 'עלות תיקון משוערת',
    repairCostPlaceholder: '0',
    standardQuote: 'ציטוט תקן/חוק',
    standardQuotePlaceholder: 'הכנס ציטוט מתקן רלוונטי',
    selectStandard: 'בחר מהספרייה',
    attachImages: 'צרף תמונות',
    imagesCount: (n: number) => `${n} תמונות`,
    deleteConfirm: 'האם למחוק ממצא זה?',
    deleteTitle: 'מחיקת ממצא',
    editTitle: 'עריכת ממצא',
    createTitle: 'ממצא חדש',
    useTemplate: 'השתמש בתבנית',
    area: 'אזור',
  },

  // Images
  images: {
    title: 'תמונות',
    add: 'הוסף תמונה',
    takePhoto: 'צלם תמונה',
    chooseFromLibrary: 'בחר מהגלריה',
    caption: 'כיתוב',
    captionPlaceholder: 'הוסף כיתוב לתמונה',
    deleteConfirm: 'האם למחוק תמונה זו?',
    deleteTitle: 'מחיקת תמונה',
    empty: 'אין תמונות',
    emptyHint: 'לחץ כדי להוסיף תמונה',
    permissionDenied: 'לא ניתנה הרשאה לגישה למצלמה/גלריה',
    fileNotFound: 'קובץ התמונה לא נמצא',
  },

  // Standards
  standards: {
    title: 'תקנים ורגולציה',
    search: 'חפש תקן...',
    empty: 'לא נמצאו תקנים',
    code: 'קוד',
    category: 'קטגוריה',
    select: 'בחר תקן',
    selected: 'נבחר',
    categories: {
      safety: 'בטיחות',
      accessibility: 'נגישות',
      fire: 'כיבוי אש',
      structural: 'קונסטרוקציה',
      waterproofing: 'איטום',
      electrical: 'חשמל',
      plumbing: 'אינסטלציה',
      general: 'כללי',
    },
  },

  // Templates
  templates: {
    title: 'תבניות ממצאים',
    search: 'חפש תבנית...',
    empty: 'לא נמצאו תבניות',
    select: 'בחר תבנית',
    useTemplate: 'השתמש בתבנית זו',
    categories: {
      flooring: 'ריצוף',
      waterproofing: 'איטום',
      cracks: 'סדקים',
      plaster: 'טיח',
      tiles: 'אריחים',
      moisture: 'לחות וחדירת מים',
      railing: 'מעקות ובטיחות',
      balcony: 'מרפסת',
      electrical: 'חשמל',
      plumbing: 'אינסטלציה',
    },
  },

  // Report preview
  preview: {
    title: 'תצוגת דוח',
    reportTitle: 'דוח בדיקת בניין',
    intro: 'להלן סיכום ממצאי הבדיקה שנערכה בנכס.',
    client: 'לקוח',
    address: 'כתובת',
    date: 'תאריך בדיקה',
    inspector: 'בודק',
    noFindings: 'אין ממצאים בפרויקט זה',
    warnings: 'אזהרות לפני ייצוא',
    exportReady: 'הדוח מוכן לייצוא',
    costEstimate: 'עלות תיקון משוערת',
    standardRef: 'התייחסות לתקן',
    conclusion: 'מסקנה',
    images: 'תמונות',
  },

  // Export
  export: {
    title: 'ייצוא דוח',
    generating: 'מייצר קובץ...',
    success: 'הדוח יוצא בהצלחה',
    error: 'שגיאה בייצוא הדוח',
    share: 'שתף קובץ',
    warnings: {
      noConclusion: 'חסרה מסקנה',
      noCost: 'חסרה עלות תיקון',
      noImages: 'חסרות תמונות',
      missingImageFile: 'קובץ תמונה לא נמצא',
    },
    filename: 'דוח-בדיקה',
  },

  // Settings
  settings: {
    title: 'הגדרות',
    companyName: 'שם חברה',
    companyNamePlaceholder: 'הכנס שם חברה',
    defaultInspectorName: 'שם בודק ברירת מחדל',
    defaultInspectorNamePlaceholder: 'הכנס שם',
    defaultCurrency: 'מטבע ברירת מחדל',
    reportTitle: 'כותרת דוח',
    reportTitlePlaceholder: 'דוח בדיקת בניין',
    logo: 'לוגו חברה',
    addLogo: 'הוסף לוגו',
    changeLogo: 'שנה לוגו',
    saved: 'ההגדרות נשמרו',
  },

  // Validation errors
  validation: {
    required: 'שדה זה הוא חובה',
    minLength: (n: number) => `לפחות ${n} תווים`,
    maxLength: (n: number) => `לכל היותר ${n} תווים`,
    invalidDate: 'תאריך לא תקין',
    invalidNumber: 'מספר לא תקין',
    positiveNumber: 'יש להכניס מספר חיובי',
  },

  // Errors
  errors: {
    generic: 'אירעה שגיאה. נסה שנית.',
    loadFailed: 'טעינת הנתונים נכשלה',
    saveFailed: 'שמירת הנתונים נכשלה',
    deleteFailed: 'מחיקת הנתון נכשלה',
    exportFailed: 'ייצוא הדוח נכשל',
    cameraPermission: 'נדרשת הרשאה לשימוש במצלמה',
    libraryPermission: 'נדרשת הרשאה לגישה לגלריה',
  },
} as const;

export type HeStrings = typeof he;
