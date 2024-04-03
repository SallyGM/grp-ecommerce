"use client"; 
import React, { useContext, useState, useEffect } from "react"
import { signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, sendPasswordResetEmail,
updatePassword, updateEmail, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { auth } from "../firebaseConfig"

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password)
  }
  

  function signin(email, password) {
    return signInWithEmailAndPassword(auth, email, password)

  }

  function signout() {
    return signOut(auth)
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email)
  }

  function updateemail(email) {
    return updateEmail(currentUser, email)
  }

  function updatepassword(newPassword) {
    console.log(currentUser)
    return updatePassword(currentUser, newPassword)
  }

  // reauthenticates user
  function reautentication(password){  
    console.log(currentUser)
    const credential = EmailAuthProvider.credential(
      currentUser.email,
      password
    )
    return reauthenticateWithCredential(currentUser, credential)
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    signout,
    signin,
    signup,
    resetPassword,
    updateemail,
    reautentication,
    updatepassword
    } 

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}