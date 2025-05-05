import React from 'react'
import { useState } from 'react'
import { ShipWheelIcon } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import formImg from '../../public/form-img.svg'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { signup } from '../lib/api'

const SignupPage = () => {
  const navigate = useNavigate();
  const [signupData, setsignupData] = useState({
    fullName: "",
    Email: "",
    Password: "",
  });
  const queryClient = useQueryClient();

 const { mutate, isPending, error } = useMutation({
  mutationFn: signup,
   onSuccess: (data) => {
     // Update the auth state with the new user data
     queryClient.setQueryData(["authUser"], data);

     // Show success message
     toast.success("Account created successfully!");

     // Redirect to onboarding page
     navigate("/onboarding");
   },onError: (error) => {
     console.error("Signup error:", error);
     toast.error(error.response?.data?.message || "Failed to create account");
   }
});

  const handleSignup = (e) => {
    e.preventDefault();
    mutate(signupData);
  }

  return (
    <div className='h-screen flex items-center justify-center p-4 sm:p-6 md:p-8' data-theme="night">
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* Form */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          <div className="mb-4 flex items-center justify-start gap-2">
            <ShipWheelIcon className="size-9 text-primary" />
            <span className='text-3xl text-transparent bg-gradient-to-r from-primary to-secondary -tracking-wider font-bold font-mono bg-clip-text'>
              Chat-App
            </span>
          </div>
          {error && (
            <div className="alert alert-error mb-4">
              <span className='text-white font-semibold'>{error.response.data.message}</span>
            </div>
          )}
          <div className="w-full">
            <form onSubmit={handleSignup}>
              <div className="space-y-4">
                <div className="">
                  <h2 className='text-xl font-semibold'>Create an Account</h2>
                  <p className='text-sm opacity-70'>Join Chat-App and start your learning adventure</p>
                </div>
                <div className="space-y-3">
                  <div className="form-control w-full">
                    <label className='label'>
                      <span className='label-text'>Full Name</span>
                    </label>
                    <input type="text" placeholder='Jimmy Bob' className='input input-bordered w-full'
                      value={signupData.fullName} onChange={(e) => setsignupData({ ...signupData, fullName: e.target.value })} required />
                  </div>
                  <div className="form-control w-full">
                    <label className='label'>
                      <span className='label-text'>Email</span>
                    </label>
                    <input type="email" placeholder='Jimmy@sleepy.com' className='input input-bordered w-full'
                      value={signupData.Email} onChange={(e) => setsignupData({ ...signupData, Email: e.target.value })} required />
                  </div>
                  <div className="form-control w-full">
                    <label className='label'>
                      <span className='label-text'>Password</span>
                    </label>
                    <input type="password" placeholder='Secret-sh**-b***h' className='input input-bordered w-full'
                      value={signupData.Password} onChange={(e) => setsignupData({ ...signupData, Password: e.target.value })} required />
                    <p className='text-xs opacity-70 mt-1'>Password must be at least 6 characters long</p>
                  </div>
                  <div className="form-control w-full">
                    <label className='label cursor-pointer justify-start gap-2'>
                      <input type="checkbox" placeholder='Secret-sh**-b***h' className='checkbox checkbox-sm' required />
                      <span className='text-xs leading-tight'>
                        I agree to the{" "}
                        <span className='text-primary hover:underline'>terms of service</span> and{" "}
                        <span className='text-primary hover:underline'>privacy policy</span>
                      </span>
                    </label>
                  </div>
                </div>
                <button className='btn btn-primary w-full' type='submit'>
                  {isPending ? (
                    <>
                     <span className='loading loading-dots loading-xs'></span>
                     cleaning up your room.....
                    </>
                  ) : "Create Account"}
                </button>
                <div className="text-center mt-4">
                  <p className="text-sm">
                    ALready have an account?{" "}
                    <Link to="/login" className="text-primary hover:underline">Sign in</Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Image */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            <div className="relative aspect-square max-w-sm mx-auto">
              <img src={formImg} alt="Language connection illustration" className='w-full h-full' />
            </div>
            <div className="text-center space-y-3 mt-6">
              <h2 className='text-xl font-semibold'>Connect with Study partners worldwide</h2>
              <p className="opacity-70">Practice, Hold group discussions and improve your social skills together</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupPage