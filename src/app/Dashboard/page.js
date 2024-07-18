"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import app from '../firebase';
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push("/");
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out", error.message);
    }
  };
  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-4'>
  {user && 
        <div  className="p-10 rounded-lg flex flex-col justify-center items-center gap-5"
          style={{
            background: 'rgba(217, 217, 217, 0.193)',
            boxShadow: 'inset 63.6667px -63.6667px 63.6667px rgba(165, 165, 165, 0.193), inset -63.6667px 63.6667px 63.6667px rgba(255, 255, 255, 0.193)',
            backdropFilter: 'blur(142.613px)'
          }}>
            <h1 className="text-4xl font-bold text-[#eeeeee] text-center ">Thank you</h1>
            <p className="text-3xl text-[#eeeeee] text-center ">{user.displayName}</p>
            <p className="text-3xl text-[#eeeeee] text-center ">You have Successfull submitted your <span className='text-gray-700 font-bold'>Lead Generation Form</span></p>
      <button onClick={handleLogout} className="border border-white text-white py-1 px-2 rounded hover:font-bold">
        Sign out
      </button>
        </div>
        }
    </div>
  )
}


