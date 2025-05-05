import useLogin  from '../hooks/useLogin.js'
import React from 'react'

import { ShipWheelIcon } from 'lucide-react';
import { Link } from 'react-router';

const LoginPage = () => {
  const [loginData, setLoginData] = React.useState({
    Email: "",
    Password: ""
  })

  const {isPending, error, loginMutation} = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  }

  return (
    <div className='h-screen flex justify-center p-4 sm:p-6 md:p-8 items-center'>
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        <div className="w-full lg:w-1/2 p-4 sm:p-6 md:p-8 flex flex-col">
          <div className="mb-4 flex items-center justify-start gap-2">
            <ShipWheelIcon className='text-primary size-9' />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              Chat-App
            </span>
          </div>
          {error && (<><div className="alert alert-error mb-4 text-white"><span className='text-xl'>{error.response.data.message}</span></div></>)}

          <div className="w-full">
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div className="">
                  <h2 className="text-xl font-semibold">Welcome Back</h2>
                  <p className="text-sm opacity-70">Let's pick up where we left off shall we?</p>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="form-control w-full space-y-2">
                    <label className="label"><span className="label-text">Email</span></label>
                    <input type="email" placeholder='ahoi@you.com' value={loginData.Email} className='input input-bordered w-full'
                     onChange={(e) => setLoginData({...loginData, Email: e.target.value})} required/>
                  </div>
                  <div className="form-control w-full space-y-2">
                    <label className="label"><span className="label-text">Password</span></label>
                    <input type="password" placeholder='Someth*ng_s*cr*t_sh**' className='input input-bordered w-full'
                     value={loginData.Password} onChange={(e) => setLoginData({...loginData, Password: e.target.value})} required />
                  </div>

                  <button type="submit" className='btn btn-primary w-full' disabled={isPending}>
                    {isPending ? (<><span className="loading loading-bars loading-xs"></span> let's pick up where you left off....</>): ("Sign in")}
                  </button>
                  <div className="text-center mt-4">
                    <p className="text-sm">
                      Don't have an account? <Link to="/signup" className='text-primary hover:underline'>Create one</Link>
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
         <div className="max-w-md p-8">
          <div className="relative aspect-square max-w-sm mx-auto">
            <img src="/form-img.svg" alt="Language Connection Illustration" className='w-full h-full' />
          </div>
          <div className="text-center mt-6 space-y-3">
            <h2 className="text-xl font-semibold">Connect with other weirdos like you</h2>
            <p className="opacity-70">Hold discussions, gossip, banter and improve your skills in arguments.</p>
          </div>
         </div>
        </div>

      </div>
    </div>
  )
}

export default LoginPage