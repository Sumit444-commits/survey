"use client"
import { useState,useEffect } from "react"
import app from "./firebase"
import {getAuth} from "firebase/auth"
import { useRouter } from "next/navigation"
import { signInWithPopup,GoogleAuthProvider,FacebookAuthProvider } from "firebase/auth"
import Survey from "./survey/page"
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";



const login = ()=>{
    const [user, setUser] = useState(null)
    const router = useRouter()

    useEffect(()=>{
        const auth = getAuth(app)
      const unsubscribe = auth.onAuthStateChanged((user)=>{
            if(user){
                setUser(user)
            }else{
                setUser(null)
            }

        })
        return () => unsubscribe()
    },[])

    const signInWithGoogle = async ()=>{
        const provider = new GoogleAuthProvider()
        const auth = getAuth(app)
        try{
            await signInWithPopup(auth,provider)
            router.push("/survey")

        }catch(error){
            console.error("Error signing in with Google",error.message)
        }
    }

    const signInWithFacebook = async ()=>{
        const provider = new FacebookAuthProvider()
        
        const auth = getAuth(app)
        try{
            await signInWithPopup(auth,provider)
            router.push("/survey")

        }catch(error){
            console.error("Error signing in with Facebook",error.message)
        }
    }


    return (
   <div className="flex h-screen">
    <div className="w-full md:w-1/2 flex justify-center items-center bg-gray-200 p-12 shadow-lg">
        {user ? (
            <Survey />
        ) : (
            <div className="flex flex-col justify-center items-center gap-6 w-full max-w-md">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
                    &lt;<span className="text-blue-600">Login</span>/&gt;
                </h1>
                <div className="flex flex-col gap-4 w-full">
                    <button onClick={signInWithGoogle} className="flex gap-3 justify-center items-center bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 py-3 px-5 rounded-full transition duration-150 ease-in-out">
                        <FcGoogle className="text-2xl" />
                        <span className="text-lg font-medium">Sign in with Google</span>
                    </button>
                    <button onClick={signInWithFacebook} className="flex gap-3 justify-center items-center bg-blue-700 text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-opacity-50 py-3 px-5 rounded-full transition duration-150 ease-in-out">
                        <FaFacebook className="text-2xl" />
                        <span className="text-lg font-medium">Sign in with Facebook</span>
                    </button>
                </div>
            </div>
        )}
    </div>
    <div className="w-full md:w-1/2 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.ctfassets.net/2pudprfttvy6/6bHil4nvrS5gnCoUX3BqtQ/8b1d4e6093806b1291500c28fb1e9c58/hiring-solutions-hero1.jpg)' }}>
    </div>
</div>

    );
}
export default login;
