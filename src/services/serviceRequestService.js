import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/config/firebase';

// Service types
export const SERVICE_TYPES = [
  'Graphic Design',
  'Branding',
  'Social Media Graphics',
  'Video Editing',
  'Animation',
  'Web Design',
];

// Request statuses
export const REQUEST_STATUSES = ['pending', 'in-progress', 'completed'];

/**
 * Create a new service request
 * @param {string} userId - User ID
 * @param {object} requestData - Request data
 * @returns {Promise} - New request or error
 */
export const createServiceRequest = async (userId, requestData) => {
  try {
    const docRef = await addDoc(collection(db, 'serviceRequests'), {
      userId,
      serviceType: requestData.serviceType,
      description: requestData.description,
      deadline: requestData.deadline || null,
      budget: requestData.budget || null,
      attachments: requestData.attachments || [],
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get user's service requests
 * @param {string} userId - User ID
 * @returns {Promise} - Array of requests or error
 */
export const getUserServiceRequests = async (userId) => {
  try {
    const q = query(
      collection(db, 'serviceRequests'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const requests = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, data: requests };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get all service requests (Admin)
 * @returns {Promise} - Array of all requests or error
 */
export const getAllServiceRequests = async () => {
  try {
    const q = query(
      collection(db, 'serviceRequests'),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const requests = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, data: requests };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Update service request status
 * @param {string} requestId - Request ID
 * @param {string} status - New status
 * @returns {Promise} - Success or error
 */
export const updateRequestStatus = async (requestId, status) => {
  try {
    if (!REQUEST_STATUSES.includes(status)) {
      throw new Error('Invalid status');
    }

    await updateDoc(doc(db, 'serviceRequests', requestId), {
      status,
      updatedAt: new Date(),
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Update service request
 * @param {string} requestId - Request ID
 * @param {object} updateData - Data to update
 * @returns {Promise} - Success or error
 */
export const updateServiceRequest = async (requestId, updateData) => {
  try {
    await updateDoc(doc(db, 'serviceRequests', requestId), {
      ...updateData,
      updatedAt: new Date(),
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Delete service request
 * @param {string} requestId - Request ID
 * @returns {Promise} - Success or error
 */
export const deleteServiceRequest = async (requestId) => {
  try {
    await deleteDoc(doc(db, 'serviceRequests', requestId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get request statistics
 * @returns {Promise} - Statistics or error
 */
export const getRequestStatistics = async () => {
  try {
    const allRequests = await getAllServiceRequests();

    if (!allRequests.success) {
      throw new Error(allRequests.error);
    }

    const requests = allRequests.data;
    const total = requests.length;
    const pending = requests.filter((r) => r.status === 'pending').length;
    const inProgress = requests.filter((r) => r.status === 'in-progress').length;
    const completed = requests.filter((r) => r.status === 'completed').length;

    return {
      success: true,
      data: { total, pending, inProgress, completed },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
