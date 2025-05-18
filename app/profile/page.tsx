'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase-client';
import { ToraUser } from '@/utils/supabase-client';

export default function Profile() {
  const [user, setUser] = useState<ToraUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }
      
      // Fetch user profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (error) {
        console.error('Error fetching profile:', error);
        setLoading(false);
        return;
      }
      
      if (data) {
        setUser({
          id: data.id,
          email: session.user.email || '',
          username: data.username,
          displayName: data.display_name,
          bio: data.bio || '',
          avatarUrl: data.avatar_url,
        });

        setAvatarPreview(data.avatar_url || null);

        setDisplayName(data.display_name);
        setBio(data.bio || '');
      }
      
      setLoading(false);
    };
    
    fetchProfile();
  }, [router]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setUpdateLoading(true);

    try {
      const supabase = createClient();

      let finalAvatarUrl = user?.avatarUrl || null;
      if (avatarFile && user) {
        const fileExt = avatarFile.name.split('.').pop();
        const filePath = `${user.id}/avatar.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile, { upsert: true });
        if (uploadError) {
          throw uploadError;
        }
        const { data: publicData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
        finalAvatarUrl = publicData.publicUrl;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: displayName,
          bio: bio,
          avatar_url: finalAvatarUrl,
        })
        .eq('id', user?.id);
        
      if (error) {
        setError('אירעה שגיאה בעדכון הפרופיל');
        console.error('Error updating profile:', error);
      } else {
        setMessage('הפרופיל עודכן בהצלחה');
        setUser(prev => prev ? { ...prev, displayName, bio, avatarUrl: finalAvatarUrl || undefined } : null);
        setAvatarPreview(finalAvatarUrl);
        setAvatarFile(null);
      }
    } catch (err) {
      setError('אירעה שגיאה בעדכון הפרופיל');
      console.error(err);
    } finally {
      setUpdateLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-xl">טוען...</div>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-blue-900">הפרופיל שלי</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{message}</span>
        </div>
      )}
      
      <div className="bg-white shadow-md rounded p-6 mb-6">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">שם משתמש:</label>
          <div className="text-gray-900">{user?.username}</div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">דואר אלקטרוני:</label>
          <div className="text-gray-900">{user?.email}</div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded p-6">
        <h2 className="text-xl font-bold mb-4 text-blue-800">עדכון פרופיל</h2>

        <form onSubmit={handleUpdateProfile}>
          <div className="mb-4 flex items-center">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center mr-4">
              {avatarPreview ? (
                <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-blue-700 font-bold text-xl">
                  {displayName.charAt(0) || user?.username.charAt(0) || '?'}
                </span>
              )}
            </div>
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="displayName">
              שם תצוגה:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="bio">
              אודות:
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="bio"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={updateLoading}
            >
              {updateLoading ? 'מעדכן...' : 'עדכן פרופיל'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 