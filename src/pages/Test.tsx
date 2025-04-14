import React from 'react'

export default function Test() {
    function handleClick() {
        const idenv = process.env.URL_BACKEND_API
        console.log("idenv: " + idenv);
    }
    return (
        <div>
            <button
                onClick={handleClick}
                className='h-[30px] w-[100px] rounded-xl bg-amber-300'
            >
                click
            </button>

        </div>
    )
}
