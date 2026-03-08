const defaultFindingTemplates = [
  {
    title: 'סדק בקיר נושא',
    description: 'זוהה סדק אופקי בקיר נושא המחייב בדיקת מהנדס.',
    severity: 'high',
    defaultStandardCode: 'ת"י 1752',
    language: 'he'
  },
  {
    title: 'חדירת רטיבות בתקרה',
    description: 'נמצאו סימני רטיבות מתקדמת בתקרה מעל חלל שירות.',
    severity: 'medium',
    defaultStandardCode: 'ת"י 5281',
    language: 'he'
  },
  {
    title: 'ליקוי נגישות בכניסה',
    description: 'שיפוע הכניסה חורג מהמותר ויש להתאים לרמפה תקנית.',
    severity: 'high',
    defaultStandardCode: 'ת"י 1142',
    language: 'he'
  }
];

module.exports = { defaultFindingTemplates };
