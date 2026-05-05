import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { setDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage, googleProvider } from '@/config/firebase';

/**
 * Email & Password Sign Up
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} displayName - User display name
 * @returns {Promise} - User credential or error
 */
export const signUpWithEmail = async (email, password, displayName) => {
  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update user profile
    await updateProfile(user, { displayName });

    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: email,
      displayName: displayName,
      photoURL: null,
      bio: '',
      phone: '+255 745 028 158',
      location: 'Dar es Salaam, Tanzania',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Email & Password Sign In
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {boolean} rememberMe - Remember login
 * @returns {Promise} - User credential or error
 */
export const signInWithEmail = async (email, password, rememberMe = false) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (rememberMe) {
      localStorage.setItem('rememberMe', 'true');
      localStorage.setItem('userEmail', email);
    }

    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Google Sign In
 * @returns {Promise} - User credential or error
 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if user document exists
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    // Create user document if it doesn't exist
    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        bio: '',
        phone: '+255 745 028 158',
        location: 'Dar es Salaam, Tanzania',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Upload Profile Picture
 * @param {string} userId - User ID
 * @param {File} file - Image file
 * @returns {Promise} - Download URL or error
 */
export const uploadProfilePicture = async (userId, file) => {
  try {
    // Create storage reference
    const storageRef = ref(storage, `profile-pictures/${userId}/${file.name}`);

    // Upload file
    await uploadBytes(storageRef, file);

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);

    // Update user profile
    const user = auth.currentUser;
    await updateProfile(user, { photoURL: downloadURL });

    // Update Firestore
    await updateDoc(doc(db, 'users', userId), {
      photoURL: downloadURL,
      updatedAt: new Date(),
    });

    return { success: true, url: downloadURL };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Update User Profile
 * @param {string} userId - User ID
 * @param {object} profileData - Profile data to update
 * @returns {Promise} - Success or error
 */
export const updateUserProfile = async (userId, profileData) => {
  try {
    // Update Firestore document
    await updateDoc(doc(db, 'users', userId), {
      ...profileData,
      updatedAt: new Date(),
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get User Profile
 * @param {string} userId - User ID
 * @returns {Promise} - User profile data
 */
export const getUserProfile = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() };
    }
    return { success: false, error: 'User not found' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Sign Out User
 * @returns {Promise} - Success or error
 */
export const signOutUser = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('userEmail');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
