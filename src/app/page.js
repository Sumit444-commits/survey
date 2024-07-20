"use client"
import { useState,useEffect } from "react"
import app from "./firebase"
import {getAuth} from "firebase/auth"
import { useRouter } from "next/navigation"
import { signInWithPopup,GoogleAuthProvider,FacebookAuthProvider,GithubAuthProvider } from "firebase/auth"
import Survey from "./survey/page"
import { FcGoogle } from "react-icons/fc";

import { FaGithub } from "react-icons/fa";


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

    

    const signInWithGithub = async ()=>{
        const provider = new GithubAuthProvider()
        
        const auth = getAuth(app)
        try{
            await signInWithPopup(auth,provider)
            router.push("/survey")

        }catch(error){
            console.error("Error signing in with Github",error.message)
        }
    }


    return(
        <div className="flex justify-center items-center h-screen flex-col">
            {user ? <Survey />: (
                    <>
                    <div className="flex flex-col justify-center items-center  py-24 rounded-lg gap-10"
                      style={{
                        background: 'rgba(217, 217, 217, 0.193)',
                        boxShadow: 'inset 63.6667px -63.6667px 63.6667px rgba(165, 165, 165, 0.193), inset -63.6667px 63.6667px 63.6667px rgba(255, 255, 255, 0.193)',
                        backdropFilter: 'blur(142.613px)'
                      }}
                    >
                        <img src="entering.png" className="w-40"/>
                        <h1 className="text-4xl font-bold">&lt;<span className="text-white">Login</span>/&gt;</h1>
                    <div className="flex flex-col gap-2 mx-10">

                    <button onClick={signInWithGoogle} className="flex gap-5 justify-center items-center bg-white text-black cursor-pointer  py-4 px-5 rounded-full ">
                    <FcGoogle />

                       <span> Sign in with Google</span>
                        </button>
                    <button onClick={signInWithGithub} className="flex gap-5 justify-center items-center bg-white text-black cursor-pointer  py-4 px-5 rounded-full">
                    <FaGithub />
                        <span>Sign in with Github</span>
                        </button>
                 
                    </div>
                    </div>
                    </>
           
            )}
        </div>
    );
}
export default login;
