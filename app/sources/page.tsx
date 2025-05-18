'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase-client';
import { Source } from '@/utils/supabase-client';

// Define type for raw Supabase source data
interface SourceRow {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
}

export default function Sources() {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const categories = [
    'תנ"ך',
    'משנה',
    'תלמוד',
    'הלכה',
    'מחשבה',
    'מוסר',
    'חסידות',
  ];

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
    };
    checkSession();
  }, []);
  
  useEffect(() => {
    const fetchSources = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const supabase = createClient();
        
        let query = supabase.from('sources').select('*').order('title', { ascending: true });
        
        if (selectedCategory) {
          query = query.eq('category', selectedCategory);
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        setSources(data.map((source: SourceRow) => ({
          id: source.id,
          title: source.title,
          content: source.content,
          category: source.category,
          createdAt: source.created_at,
        })));
      } catch (err) {
        console.error('Error fetching sources:', err);
        setError('אירעה שגיאה בטעינת המקורות. אנא נסו שנית מאוחר יותר.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSources();
  }, [selectedCategory]);
  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-blue-900">מקורות תורניים</h1>
      {isLoggedIn && (
        <div>
          <Link
            href="/sources/new"
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline inline-block"
          >
            הוסף מקור חדש
          </Link>
        </div>
      )}
      
      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium ${!selectedCategory ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
          onClick={() => setSelectedCategory(null)}
        >
          הכל
        </button>
        
        {categories.map(category => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full text-sm font-medium ${selectedCategory === category ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">טוען מקורות...</div>
        </div>
      ) : sources.length === 0 ? (
        <div className="bg-blue-50 p-8 rounded-lg text-center">
          <h3 className="text-xl font-semibold text-blue-900 mb-2">אין מקורות</h3>
          <p className="text-gray-700">לא נמצאו מקורות תואמים את החיפוש שלך.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sources.map(source => (
            <Link href={`/sources/${source.id}`} key={source.id}>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200 h-full">
                <div className="text-sm font-medium text-blue-600 mb-2">{source.category}</div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">{source.title}</h2>
                <p className="text-gray-700 line-clamp-3">{source.content.substring(0, 150)}...</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 