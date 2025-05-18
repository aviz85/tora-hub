# תורה האב - Tora Hub

רשת חברתית תורנית סביב מקורות יהודיים, המאפשרת לימוד משותף ושיתוף חידושי תורה.

**Project Overview (English)**  
Tora Hub is a Torah-focused social network for collaborative study, sharing insights, and building an online community.

## מהות הפרוייקט

תורה האב היא פלטפורמה המאפשרת למשתמשים:
- צפייה במקורות תורניים מסוגים שונים
- פרסום חידושי תורה אישיים על המקורות
- דיון עם משתמשים אחרים באמצעות תגובות ולייקים
- בניית קהילה תורנית מקוונת

## טכנולוגיות

הפרוייקט בנוי באמצעות:
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (אותנטיקציה ו-Backend)

## תכונות מרכזיות

- מערכת הרשמה והתחברות מלאה
- צפייה במקורות תורניים
- פרסום וצפייה בחידושים אישיים
- ממשק משתמש דו-כיווני בעברית
- פרופיל משתמש אישי

### Main Features (English)
- Full registration and login system
- Browse Torah sources
- Publish and view personal insights
- Hebrew bidirectional user interface
- Personal user profile

## התקנה והרצה מקומית

### דרישות מוקדמות

- Node.js בגרסה 18 ומעלה
- npm או yarn
- חשבון Supabase (חינמי)

### שלבי ההתקנה

1. שכפל את המאגר:
```bash
git clone <repo-url>
cd tora-hub
```

2. התקן את התלויות:
```bash
npm install
```

3. צור קובץ `.env.local` והגדר בו את הקישור והמפתח של Supabase:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. הרץ את השרת המקומי:
```bash
npm run dev
```

5. פתח את `http://localhost:3000` בדפדפן.

## Installation and Local Development (English)

### Prerequisites
- Node.js version 18 or higher
- npm or yarn
- Supabase account (free)

### Setup Steps
1. Clone the repository:
```bash
git clone <repo-url>
cd tora-hub
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file and set your Supabase URL and anon key:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Run the local server:
```bash
npm run dev
```

5. Open `http://localhost:3000` in your browser.

## הגדרת Supabase

1. צור חשבון ב-Supabase וצור פרוייקט חדש.
2. הקם את מסד הנתונים על פי ה-SQL שנמצא בקובץ `db/schema.sql`.
3. הגדר את שירותי האותנטיקציה וה-Row Level Security הנדרשים.
4. העתק את כתובת ה-URL ואת מפתח ה-Anon לקובץ `.env.local`.

## פריסה

ניתן לפרוס את הפרוייקט בפלטפורמת אירוח כגון Vercel, Netlify או ספקי אירוח אחרים התומכים ב-Next.js.

```bash
npm run build
```

## רישיון

פרוייקט תורה האב מופץ תחת רישיון MIT. ראה קובץ `LICENSE` למידע נוסף.
