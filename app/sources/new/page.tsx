'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase-client';

const categories = [
  'תנ"ך',
  'משנה',
  'תלמוד',
  'הלכה',
  'מחשבה',
  'מוסר',
  'חסידות',
];

export default function NewSource() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push('/login');
      }
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('sources')
        .insert({ title, content, category })
        .select()
        .single();
      if (error) throw error;
      if (data) {
        router.push(`/sources/${data.id}`);
      } else {
        router.push('/sources');
      }
    } catch (err) {
      console.error('Error adding source:', err);
      setError('אירעה שגיאה בהוספת המקור. אנא נסו שוב.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-blue-900">הוסף מקור חדש</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div>
          <label htmlFor="title" className="block text-gray-700 font-bold mb-2">כותרת</label>
          <input
            id="title"
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-gray-700 font-bold mb-2">קטגוריה</label>
          <select
            id="category"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="content" className="block text-gray-700 font-bold mb-2">תוכן</label>
          <textarea
            id="content"
            rows={6}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? 'שומר...' : 'שמור'}
          </button>
        </div>
      </form>
    </div>
  );
}
