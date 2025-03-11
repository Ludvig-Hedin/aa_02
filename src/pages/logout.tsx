import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Head from 'next/head';

export default function Logout() {
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const [message, setMessage] = useState('Signing out...');

  useEffect(() => {
    const signOut = async () => {
      try {
        const { error } = await supabaseClient.auth.signOut();
        
        if (error) {
          console.error('Error signing out:', error.message);
          setMessage('An error occurred while signing out. Redirecting to login...');
        } else {
          setMessage('Successfully signed out. Redirecting...');
        }
        
        // Redirect to login page after a short delay
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } catch (err) {
        console.error('Exception during sign out:', err);
        setMessage('An error occurred while signing out. Redirecting to login...');
        
        // Redirect to login page after a short delay even if there's an error
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      }
    };

    signOut();
  }, [supabaseClient, router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center">
      <Head>
        <title>Signing Out | Personal AI Assistant</title>
      </Head>
      
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          {message}
        </h1>
      </div>
    </div>
  );
} 