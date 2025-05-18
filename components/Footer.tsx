import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-100 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="text-xl font-bold text-blue-800">
              תורה האב
            </Link>
            <p className="text-gray-600 mt-1">
              רשת חברתית תורנית לשיתוף ולימוד משותף
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 md:items-center text-center md:text-right">
            <div className="flex flex-col space-y-2">
              <h3 className="font-bold text-gray-700">ניווט</h3>
              <Link href="/sources" className="text-blue-700 hover:text-blue-900">
                מקורות
              </Link>
              <Link href="/insights" className="text-blue-700 hover:text-blue-900">
                חידושים
              </Link>
              <Link href="/profile" className="text-blue-700 hover:text-blue-900">
                פרופיל
              </Link>
            </div>
            
            <div className="flex flex-col space-y-2">
              <h3 className="font-bold text-gray-700">אודות</h3>
              <Link href="/about" className="text-blue-700 hover:text-blue-900">
                אודותינו
              </Link>
              <Link href="/privacy" className="text-blue-700 hover:text-blue-900">
                מדיניות פרטיות
              </Link>
              <Link href="/terms" className="text-blue-700 hover:text-blue-900">
                תנאי שימוש
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-gray-200 text-center text-gray-600">
          <p>© {currentYear} תורה האב. כל הזכויות שמורות.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 