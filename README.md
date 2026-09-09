# مراحل (Marahil)

منصة دروس خصوصية وكورسات تعليمية تفاعلية، تغطي كل المراحل الدراسية (من رياض الأطفال إلى الجامعة والتدريب المهني)، مع اختبارات تفاعلية وشهادات رقمية موثّقة بكود تحقق فريد.

## البنية

المشروع مقسّم إلى جزأين مستقلّين:

| المجلد | المحتوى | يُنشر على |
|---|---|---|
| [`frontend/`](frontend) | تطبيق Next.js (TypeScript + Tailwind CSS) — كل واجهات الطالب والمعلّم | Vercel |
| [`backend/`](backend) | قواعد أمان Firestore/Storage + Cloud Functions | Firebase |

قاعدة البيانات والمصادقة والتخزين عبر **Firebase** (مشروع `marahil-2026`): Firebase Auth للمصادقة، Firestore لكل البيانات (المستخدمون، الدورات، الدروس، الالتحاقات، الشهادات)، وCloud Function واحدة تُصدر الشهادة تلقائيًا عند اكتمال الدورة بنسبة 100% (منطق حسّاس يعمل من طرف الخادم فقط، وليس من المتصفح، حتى لا يقدر أحد يزوّر شهادة).

راجع `frontend/README.md` و`backend/README.md` لتفاصيل كل جزء.

## التشغيل محليًا

```bash
cd frontend
npm install
npm run dev
```

يحتاج ملف `frontend/.env.local` ببيانات مشروع Firebase (موجود محليًا وغير مرفوع على Git — انظر `frontend/.env.example` للمفاتيح المطلوبة).

## النشر

- **Firebase** (قواعد الأمان + Cloud Functions): من داخل `backend/` نفّذ `firebase deploy`.
- **Vercel** (الواجهة): اربط مستودع GitHub بمشروع Vercel واجعل **Root Directory** = `frontend`، ثم أضف متغيرات البيئة نفسها الموجودة في `frontend/.env.example` من إعدادات المشروع على Vercel.
- **GitHub**: [github.com/Eldesouky97/marahil](https://github.com/Eldesouky97/marahil).

## المجلدات الأخرى

- [`design-reference/`](design-reference) — نموذج تصميم أوّلي سابق (منصة "أُفُق") احتُفظ به كمرجع بصري فقط، وليس جزءًا من التطبيق الحالي.
