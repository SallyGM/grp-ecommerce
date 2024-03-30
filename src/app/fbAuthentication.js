import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useContext, useState, useEffect } from 'react';
import { auth } from './firebaseConfig'

const AuthContext = React.createContext();

export function useAuth(){
    return useContext(AuthContext);
}

export function AuthProvider({ children }){
    
    // variable that will hold the current user
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);

    // Account creation function
    // TODO: add other details to save the details of 
    // into the main table
    function signUp(email, password){
        auth.createUserWithEmailAndPassword(email, password)
    }

    // Sign in function
    function signIn(email, password){
        auth.signInWithEmailAndPassword(email, password)
    }

    function signOut(){
       return auth.signOut();
    }

    useEffect(() => {
        const unsubstribe = auth.onAuthStateChanged(u => {
            setUser(u)
            setLoading(false)
        })

        return unsubstribe
    }, [])

    const data = {
        user,
        signIn,
        signUp,
        signOut
    }

    return (
        <AuthContext.Provider value={data}>
            {/* will not load the children elements if it still loading */}
            {!loading && children}
        </AuthContext.Provider>
    )
}