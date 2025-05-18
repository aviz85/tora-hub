import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col space-y-16">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900">
            ברוכים הבאים לתורה האב
          </h1>
          <p className="text-xl text-gray-700">
            הרשת החברתית התורנית שמחברת בין לומדי תורה ומאפשרת שיתוף חידושים, תובנות ופירושים.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/signup"
              className="bg-blue-700 hover:bg-blue-800 text-white py-3 px-6 rounded-lg text-center font-semibold shadow-md transition duration-200"
            >
              הצטרפו עכשיו
            </Link>
            <Link
              href="/sources"
              className="bg-white hover:bg-gray-100 text-blue-700 border border-blue-700 py-3 px-6 rounded-lg text-center font-semibold shadow-sm transition duration-200"
            >
              עיינו במקורות
            </Link>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="relative w-full max-w-md h-80">
            <div className="absolute top-0 right-0 bg-blue-100 opacity-70 w-64 h-64 rounded-full z-0"></div>
            <div className="absolute bottom-0 left-0 bg-blue-200 opacity-70 w-64 h-64 rounded-full z-0"></div>
            <div className="relative z-10 flex items-center justify-center h-full">
              <div className="bg-white p-4 rounded-lg shadow-xl">
                <div className="text-2xl font-bold text-center text-blue-800 mb-2">תורה האב</div>
                <div className="text-gray-600 text-center">מחברים בין עולמות</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">הפלטפורמה שלנו מציעה</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">מקורות תורניים</h3>
            <p className="text-gray-600 text-center">
              גישה למאגר עשיר של מקורות תורניים, פרשנות ופירושים מסודרים לפי נושאים.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">חידושי תורה</h3>
            <p className="text-gray-600 text-center">
              אפשרות לפרסם חידושי תורה אישיים, להגיב על חידושים של אחרים ולקיים דיון פורה.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">קהילה תורנית</h3>
            <p className="text-gray-600 text-center">
              הזדמנות להתחבר עם קהילת לומדי תורה, לשתף ידע ולקבל תובנות חדשות.
            </p>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="bg-blue-50 py-12 px-6 rounded-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-blue-900 mb-4">הצטרפו לקהילה שלנו</h2>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            כבר יותר מ-1,000 לומדי תורה משתפים את תובנותיהם בפלטפורמה שלנו.
            הצטרפו עוד היום וקחו חלק בשיח התורני העשיר שלנו.
          </p>
          <Link
            href="/signup"
            className="bg-blue-700 hover:bg-blue-800 text-white py-3 px-8 rounded-lg text-lg font-semibold shadow-md transition duration-200"
          >
            הרשמה חינמית
          </Link>
        </div>
      </section>
    </div>
  );
}
