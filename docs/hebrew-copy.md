# Hebrew Copy — Building Inspection Reports App

All user-facing strings are defined in `src/lib/i18n/he.ts`.
Internal code, variable names, comments, and DB column names remain in English.

## Key Hebrew Terms

| English | Hebrew | Notes |
|---|---|---|
| Project | פרויקט | |
| Area | אזור | logical section of a property |
| Finding | ממצא | a defect or issue |
| Standard | תקן | building standard/regulation |
| Template | תבנית | reusable finding template |
| Severity | חומרה | |
| High | גבוהה | |
| Medium | בינונית | |
| Low | נמוכה | |
| Conclusion | מסקנה | inspector recommendation |
| Repair cost | עלות תיקון | |
| Inspector | בודק | |
| Client | לקוח | |
| Export | ייצוא | DOCX file generation |
| Draft | טיוטה | project status |

## Common Area Names (Presets)

- חזית — exterior/facade
- סלון — living room
- מטבח — kitchen
- חדר רחצה — bathroom
- חדר שינה — bedroom
- מרפסת — balcony
- גג — roof
- חדר מדרגות — stairwell
- חניה — parking
- לובי — lobby

## Common Finding Categories (Seeds)

- ריצוף — flooring
- איטום — waterproofing
- סדקים — cracks
- טיח — plaster
- אריחים — tiles
- לחות — moisture/seepage
- מעקות — railing/safety
- מרפסת — balcony issues
- חשמל — electrical
- אינסטלציה — plumbing

## RTL Notes

- `I18nManager.forceRTL(true)` is called in `app/_layout.tsx`
- All `TextInput` components use `textAlign="right"` and `writingDirection="rtl"`
- All `Text` components use `textAlign: 'right'` in styles
- DOCX paragraphs use `bidirectional: true` and `alignment: AlignmentType.RIGHT`
- DOCX text runs use `rightToLeft: true`

## Mixed Hebrew + Number Handling

Hebrew text with numbers like "שיפוע של 0.8%" renders correctly in DOCX
because each text run is individually marked RTL. Numbers and punctuation
within Hebrew sentences should be kept in the same run.

Known limitation: In some Word versions, mixed bidi text may need testing
on both iOS Word and Android Word apps before final delivery.
