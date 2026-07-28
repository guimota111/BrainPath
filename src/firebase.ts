import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: 'AIzaSyChH6kD3MFdSxs5cUd57hQHbG19AzlzMC4',
  authDomain: 'brainpath123.firebaseapp.com',
  projectId: 'brainpath123',
  storageBucket: 'brainpath123.firebasestorage.app',
  messagingSenderId: '137038461331',
  appId: '1:137038461331:web:d49b9f76bb62a951c09066',
  measurementId: 'G-EW33QE93RS',
}

const app = initializeApp(firebaseConfig)

let analytics: ReturnType<typeof getAnalytics> | null = null
if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) analytics = getAnalytics(app)
    })
    .catch(() => {
      analytics = null
    })
}

export { app, analytics, firebaseConfig }
