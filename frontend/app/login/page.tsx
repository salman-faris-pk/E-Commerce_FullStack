"use client"
import axios from 'axios'
import { backendUrl } from '../../utils/backendUrl'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import {
  setName,
  setEmail,
  setPassword,
  setCurrentState,
  setToken,
} from '@/features/userSlice';
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'




 const LoginPage = () => {
  
  const router=useRouter()
  const dispatch: AppDispatch = useDispatch();
  const { name, email, password, currentState,token } = useSelector((state: RootState) => state.user);



    const OnSubmitHandler= async(e:React.FormEvent<HTMLFormElement>)=>{
      e.preventDefault();

      try {

        if(currentState === 'Sign Up'){

          const res=await axios.post(backendUrl+'/api/user/register',{ name,email,password});

          if(res.data.success){
            dispatch(setToken(res.data.token))
            localStorage.setItem('token',res.data.token)
            dispatch(setName(''))
            dispatch(setEmail(''))
            dispatch(setPassword(''))
          }else{
            toast.error(res.data.message)
          }
        
        
        }else{
         
          const res=await axios.post(backendUrl+'/api/user/login',{email,password});
           
          if(res.data.success){
            dispatch(setToken(res.data.token))
            localStorage.setItem('token',res.data.token)
            dispatch(setEmail(''))
            dispatch(setPassword(''))
           
          }else{
            toast.error(res.data.message)
          }

        }
        
      } catch (error:unknown) {
          if (error instanceof Error) {
          toast.error(error.message);
          } else {
          toast.error("An unknown error occurred");
         }
      } 
    }
 
    useEffect(()=>{
    if(token){
     router.push("/")
   }
    },[token,router])

  return (
    <form onSubmit={OnSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
        <div className='inline-flex items-center gap-2 mb-2 mt-10'>
            <p className='font-prata text-3xl'>{currentState}</p>
            <hr className='border-none h-[1.5px] w-8 bg-gray-800 '/>
        </div>

        {currentState === "Login" ? "" : 
            <input type='text'placeholder='Name'
            onChange={(e) => dispatch(setName(e.target.value))} value={name}
            className='w-full px-3 py-2 border border-gray-800' required
           />
        }
      
         <input type='email'placeholder='Email'
         className='w-full px-3 py-2 border border-gray-800' required
         onChange={(e) => dispatch(setEmail(e.target.value))}  value={email}
        />
         <input type='password'placeholder='Password'
         className='w-full px-3 py-2 border border-gray-800' required
         onChange={(e) => dispatch(setPassword(e.target.value))} value={password}

        />

        <div className='w-full flex justify-between text-sm mt-[-8px] '>
           <p className='cursor-pointer '>Forgot your password?</p>
           {
            currentState === "Login" ? (
              <p className='cursor-pointer' onClick={() => dispatch(setCurrentState())}>Create account</p>
            ): (
              <p className='cursor-pointer' onClick={() => dispatch(setCurrentState())}>Login Here</p>
            )
           }
        </div>

        <button className='bg-black text-white font-light px-8 py-2 mt-4'>
         {currentState === "Login" ? "Sign In" : "Sign Up" }
        </button>
    </form>
  )
}


export default LoginPage