import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth'

// Firebase configuration - using environment variables only for security
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Validate that all required environment variables are set
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
]

const missingVars = requiredEnvVars.filter(
  (varName) => !import.meta.env[varName]
)

if (missingVars.length > 0) {
  console.error(
    'Missing required Firebase environment variables:',
    missingVars.join(', ')
  )
  console.error(
    'Please copy .env.example to .env and fill in your Firebase configuration.'
  )
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication
export const auth = getAuth(app)

// Initialize providers
export const googleProvider = new GoogleAuthProvider()
export const githubProvider = new GithubAuthProvider()

// Configure providers
googleProvider.setCustomParameters({
  prompt: 'select_account'
})

githubProvider.setCustomParameters({
  prompt: 'consent'
})

export default app