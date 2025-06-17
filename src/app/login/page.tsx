import React from 'react'
import LoginPage from '../pages/login'
import RedirectIfAuthenticated from '../context/RedirectIfAuthenticated'

const login = () => {
    return (
        <>
            <RedirectIfAuthenticated>
                <LoginPage />
            </RedirectIfAuthenticated>
        </>
    )
}

export default login