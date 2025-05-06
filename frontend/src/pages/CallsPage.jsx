import React from 'react'
import { CALL_FILTERS } from '../constants'
import { useQuery } from '@tanstack/react-query'
import { getCalls } from '../lib/api'

/* Components */
import CallCard from '../components/CallCard'
import NoCalls from '../components/NoCalls'

const CallsPage = () => {
    const {data: calls = [], isLoading: loadCalls,} = useQuery({
        queryKey: ["calls"],
        queryFn: getCalls,
    })
    return (
        <div className='p-4 sm:p-6 overflow-x-hidden lg:p-8'>
            <div className="container mx-auto space-y-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className='flex flex-col gap-2 items-start'>
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Calls</h2>
                        <div className='flex flex-wrap flex-row gap-1.5'>
                            {CALL_FILTERS.map((filter) => (
                                <button key={filter.value} className='btn btn-outline btn-sm'>
                                    {filter.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                {loadCalls ? (
                    <div className="flex justify-center py-12">
                        <span className="loading loading-bars loading-xl"/>
                        <span className="ml-3">Just a seeeec....</span>
                    </div>
                ) : (calls.length === 0 ? (<NoCalls />) : (
                    <div className="flex flex-col w-full gap-4">
                        {calls.map((call)=>(
                            <CallCard key={call.id} call={call} showActions={true} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CallsPage