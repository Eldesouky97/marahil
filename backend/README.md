# مراحل — الخلفية (Backend / Firebase)

يحتوي هذا المجلد على كل ما يخص Firebase لمنصة "مراحل":

- `firestore.rules` — قواعد أمان Firestore (من يقرأ/يكتب كل مجموعة بيانات).
- `storage.rules` — قواعد أمان Storage.
- `firestore.indexes.json` — الفهارس المركّبة (فارغة حاليًا، كل الاستعلامات تعمل بفهارس Firestore التلقائية).
- `functions/` — Cloud Functions (TypeScript)، ومسؤوليتها الوحيدة حاليًا إصدار الشهادات بعد اكتمال الدورة (`functions/src/certificates/issueOnCompletion.ts`)، حتى لا يقدر أي عميل يصدر شهادة لنفسه مباشرة.

## النشر

```bash
firebase login          # مرة واحدة فقط
firebase deploy          # من داخل هذا المجلد — ينشر القواعد + الدوال معًا
```

أو بشكل منفصل: `firebase deploy --only firestore:rules,firestore:indexes,storage` و`firebase deploy --only functions`.

المشروع مربوط مسبقًا بمعرّف Firebase `marahil-2026` عبر `.firebaserc`.
