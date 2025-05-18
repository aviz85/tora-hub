'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase-client';
import { Source, Insight, ToraUser } from '@/utils/supabase-client';

export default function SourceDetail() {
  const params = useParams();
  const router = useRouter();
  const sourceId = params.id as string;
  
  const [source, setSource] = useState<Source | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<ToraUser | null>(null);
  const [newInsight, setNewInsight] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const supabase = createClient();
        
        // Check if user is logged in
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Fetch user profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileData) {
            setUser({
              id: profileData.id,
              email: session.user.email || '',
              username: profileData.username,
              displayName: profileData.display_name,
              bio: profileData.bio,
              avatarUrl: profileData.avatar_url,
            });
          }
        }
        
        // Fetch source
        const { data: sourceData, error: sourceError } = await supabase
          .from('sources')
          .select('*')
          .eq('id', sourceId)
          .single();
          
        if (sourceError) {
          throw sourceError;
        }
        
        if (sourceData) {
          setSource({
            id: sourceData.id,
            title: sourceData.title,
            content: sourceData.content,
            category: sourceData.category,
            createdAt: sourceData.created_at,
          });
        }
        
        // Fetch insights for this source
        const { data: insightsData, error: insightsError } = await supabase
          .from('insights')
          .select(`
            *,
            profiles (id, username, display_name, avatar_url)
          `)
          .eq('source_id', sourceId)
          .order('created_at', { ascending: false });
          
        if (insightsError) {
          throw insightsError;
        }
        
        if (insightsData) {
          setInsights(insightsData.map((insight: any) => ({
            id: insight.id,
            content: insight.content,
            userId: insight.user_id,
            sourceId: insight.source_id,
            createdAt: insight.created_at,
            likes: insight.likes || 0,
            user: insight.profiles ? {
              id: insight.profiles.id,
              email: '',
              username: insight.profiles.username,
              displayName: insight.profiles.display_name,
              avatarUrl: insight.profiles.avatar_url,
            } : undefined,
          })));
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('אירעה שגיאה בטעינת הנתונים. אנא נסו שנית מאוחר יותר.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [sourceId]);
  
  const handleInsightSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (!newInsight.trim()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('insights')
        .insert({
          content: newInsight,
          user_id: user.id,
          source_id: sourceId,
        })
        .select(`
          *,
          profiles (id, username, display_name, avatar_url)
        `)
        .single();
        
      if (error) {
        throw error;
      }
      
      if (data) {
        // Add new insight to the list
        const newInsightData: Insight = {
          id: data.id,
          content: data.content,
          userId: data.user_id,
          sourceId: data.source_id,
          createdAt: data.created_at,
          likes: 0,
          user: data.profiles ? {
            id: data.profiles.id,
            email: '',
            username: data.profiles.username,
            displayName: data.profiles.display_name,
            avatarUrl: data.profiles.avatar_url,
          } : user,
        };
        
        setInsights([newInsightData, ...insights]);
        setNewInsight('');
      }
    } catch (err) {
      console.error('Error submitting insight:', err);
      alert('אירעה שגיאה בפרסום החידוש. אנא נסו שנית מאוחר יותר.');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">טוען...</div>
      </div>
    );
  }
  
  if (error || !source) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error || 'המקור המבוקש לא נמצא.'}</span>
        <div className="mt-4">
          <Link href="/sources" className="text-blue-700 hover:text-blue-900">
            חזרה לרשימת המקורות
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="mb-2">
        <Link href="/sources" className="text-blue-700 hover:text-blue-900">
          &larr; חזרה לרשימת המקורות
        </Link>
      </div>
      
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="text-sm font-medium text-blue-600 mb-2">{source.category}</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{source.title}</h1>
        
        <div className="prose max-w-none rtl">
          {source.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-700">{paragraph}</p>
          ))}
        </div>
      </div>
      
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-blue-900">חידושים ופירושים</h2>
        
        {user ? (
          <form onSubmit={handleInsightSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4">
              <label htmlFor="newInsight" className="block text-gray-700 font-bold mb-2">
                הוסף חידוש שלך:
              </label>
              <textarea
                id="newInsight"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows={4}
                value={newInsight}
                onChange={(e) => setNewInsight(e.target.value)}
                placeholder="כתוב את החידוש או הפירוש שלך כאן..."
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
                disabled={submitting}
              >
                {submitting ? 'שולח...' : 'פרסם חידוש'}
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <p className="text-gray-700 mb-4">עליך להתחבר כדי לפרסם חידושים.</p>
            <Link 
              href="/login" 
              className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
            >
              התחבר
            </Link>
          </div>
        )}
        
        {insights.length === 0 ? (
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <p className="text-gray-700">עדיין אין חידושים על מקור זה. היה הראשון להוסיף חידוש!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map(insight => (
              <div key={insight.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                    {insight.user?.displayName?.charAt(0) || insight.user?.username?.charAt(0) || '?'}
                  </div>
                  <div className="mr-3">
                    <div className="font-bold text-gray-900">{insight.user?.displayName || insight.user?.username}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(insight.createdAt).toLocaleDateString('he-IL')}
                    </div>
                  </div>
                </div>
                <div className="prose max-w-none rtl">
                  {insight.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-gray-700">{paragraph}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 