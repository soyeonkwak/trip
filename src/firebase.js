import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInAnonymously, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp 
} from "firebase/firestore";

// Firebase 설정 (Vite 환경 변수 사용, 없을 시 플레이스홀더 작동)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD-PLACEHOLDER-API-KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "travel-app-placeholder.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "travel-app-placeholder",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "travel-app-placeholder.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// 1. 구글 팝업 로그인
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error) {
    console.error("Google Login Error:", error);
    return { user: null, error: error.message };
  }
}

// 2. 익명 로그인 (로그인 없이 사용하기)
export async function loginAnonymously() {
  try {
    const result = await signInAnonymously(auth);
    return { user: result.user, error: null };
  } catch (error) {
    console.error("Anonymous Login Error:", error);
    return { user: null, error: error.message };
  }
}

// 3. 로그아웃
export async function logoutUser() {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error("Logout Error:", error);
    return false;
  }
}

// 4. Firestore에 일정 저장 (클라우드 동기화)
export async function saveItineraryToCloud(userId, itinerary, tripInfo) {
  if (!userId) return false;
  try {
    const docRef = doc(db, "users", userId, "data", "itinerary");
    await setDoc(docRef, {
      itinerary: itinerary,
      tripInfo: tripInfo,
      updatedAt: serverTimestamp()
    });
    console.log("클라우드 저장 성공!");
    return true;
  } catch (error) {
    console.error("Cloud Save Error:", error);
    return false;
  }
}

// 5. Firestore에서 일정 불러오기
export async function loadItineraryFromCloud(userId) {
  if (!userId) return null;
  try {
    const docRef = doc(db, "users", userId, "data", "itinerary");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("클라우드에 저장된 일정이 없습니다.");
      return null;
    }
  } catch (error) {
    console.error("Cloud Load Error:", error);
    return null;
  }
}

// 6. 로그인 상태 감지 훅용 헬퍼
export { onAuthStateChanged };
