'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase-client';
import { Insight, Source, ToraUser } from '@/utils/supabase-client';

export default function Insights() {
  const [insights, setInsights] = useState<(Insight & { source?: Source })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<ToraUser | null>(null);
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>({});
  const [likingInProgress, setLikingInProgress] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const supabase = createClient();
        
        // Check if user is logged in
        const { data: { session } } = await supabase.auth.getSession();
        let userId = null;
        
        if (session) {
          userId = session.user.id;
          // Fetch user profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
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
        
        const { data, error } = await supabase
          .from('insights')
          .select(`
            *,
            profiles (id, username, display_name, avatar_url),
            sources (id, title, category),
            insight_likes (likes_count)
          `)
          .order('created_at', { ascending: false })
          .limit(20);
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setInsights(data.map((insight: any) => ({
            id: insight.id,
            content: insight.content,
            userId: insight.user_id,
            sourceId: insight.source_id,
            createdAt: insight.created_at,
            likes: insight.insight_likes ? insight.insight_likes[0]?.likes_count || 0 : 0,
            user: insight.profiles ? {
              id: insight.profiles.id,
              email: '',
              username: insight.profiles.username,
              displayName: insight.profiles.display_name,
              avatarUrl: insight.profiles.avatar_url,
            } : undefined,
            source: insight.sources ? {
              id: insight.sources.id,
              title: insight.sources.title,
              category: insight.sources.category,
              content: '', // We don't need the full content in the list
              createdAt: '',
            } : undefined,
          })));
        }
        
        // If user is logged in, fetch their likes
        if (userId) {
          const { data: likesData } = await supabase
            .from('likes')
            .select('insight_id')
            .eq('user_id', userId);
            
          if (likesData) {
            const userLikesMap: Record<string, boolean> = {};
            likesData.forEach((like: { insight_id: string }) => {
              userLikesMap[like.insight_id] = true;
            });
            setUserLikes(userLikesMap);
          }
        }
      } catch (err) {
        console.error('Error fetching insights:', err);
        setError('אירעה שגיאה בטעינת החידושים. אנא נסו שנית מאוחר יותר.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInsights();
  }, []);
  
  const handleLikeToggle = async (insightId: string) => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (likingInProgress) return;
    
    setLikingInProgress(true);
    try {
      const supabase = createClient();
      
      if (userLikes[insightId]) {
        // Remove like
        await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.id)
          .eq('insight_id', insightId);
          
        // Update local state
        setUserLikes({ ...userLikes, [insightId]: false });
        setInsights(insights.map(insight => {
          if (insight.id === insightId) {
            return { ...insight, likes: Math.max(0, insight.likes - 1) };
          }
          return insight;
        }));
      } else {
        // Add like
        await supabase
          .from('likes')
          .insert({
            user_id: user.id,
            insight_id: insightId
          });
          
        // Update local state
        setUserLikes({ ...userLikes, [insightId]: true });
        setInsights(insights.map(insight => {
          if (insight.id === insightId) {
            return { ...insight, likes: insight.likes + 1 };
          }
          return insight;
        }));
      }
    } catch (err) {
      console.error('Error toggling like:', err);
      alert('אירעה שגיאה בעת ביצוע הפעולה. אנא נסו שנית.');
    } finally {
      setLikingInProgress(false);
    }
  };
  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-blue-900">חידושי תורה</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">טוען חידושים...</div>
        </div>
      ) : insights.length === 0 ? (
        <div className="bg-blue-50 p-8 rounded-lg text-center">
          <h3 className="text-xl font-semibold text-blue-900 mb-2">אין חידושים</h3>
          <p className="text-gray-700 mb-4">עדיין אין חידושים זמינים. היה הראשון להוסיף חידוש!</p>
          <Link 
            href="/sources" 
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
          >
            עבור למקורות
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {insights.map(insight => (
            <div key={insight.id} className="bg-white p-6 rounded-lg shadow-md">
              {insight.source && (
                <div className="mb-4">
                  <Link href={`/sources/${insight.sourceId}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                    {insight.source.category} &bull; {insight.source.title}
                  </Link>
                </div>
              )}
              
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                  {insight.user?.avatarUrl ? (
                    <img src={insight.user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    insight.user?.displayName?.charAt(0) || insight.user?.username?.charAt(0) || '?'
                  )}
                </div>
                <div className="mr-3">
                  <div className="font-bold text-gray-900">{insight.user?.displayName || insight.user?.username}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(insight.createdAt).toLocaleDateString('he-IL')}
                  </div>
                </div>
              </div>
              
              <div className="prose max-w-none rtl">
                {insight.content.length > 300 ? (
                  <>
                    <p className="text-gray-700">{insight.content.substring(0, 300)}...</p>
                    <Link href={`/sources/${insight.sourceId}`} className="text-blue-700 hover:text-blue-900">
                      קרא עוד
                    </Link>
                  </>
                ) : (
                  <p className="text-gray-700">{insight.content}</p>
                )}
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => handleLikeToggle(insight.id)}
                  disabled={!user || likingInProgress}
                  className={`flex items-center text-sm ${
                    userLikes[insight.id] 
                      ? 'text-blue-600 font-medium' 
                      : 'text-gray-500 hover:text-blue-600'
                  }`}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 mr-1 ${userLikes[insight.id] ? 'fill-blue-600' : 'fill-none'}`} 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                    />
                  </svg>
                  <span>שכויעח!</span>
                  <span className="mr-1">{insight.likes}</span>
                </button>
                
                <Link href={`/sources/${insight.sourceId}`} className="text-blue-700 hover:text-blue-900 text-sm">
                  צפה במקור ובכל החידושים
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 