// Contact form submissions storage (localStorage-based backend)

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  submittedAt: string;
  status: 'new' | 'read' | 'replied';
}

const STORAGE_KEY = 'shikara_contact_submissions';

// Get all submissions
export const getAllSubmissions = (): ContactSubmission[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading submissions:', error);
    return [];
  }
};

// Save a new submission
export const saveSubmission = (data: Omit<ContactSubmission, 'id' | 'submittedAt' | 'status'>): ContactSubmission => {
  const submissions = getAllSubmissions();
  
  const newSubmission: ContactSubmission = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    name: data.name,
    email: data.email,
    phone: data.phone,
    message: data.message,
    submittedAt: new Date().toISOString(),
    status: 'new'
  };
  
  submissions.unshift(newSubmission); // Add to beginning
  localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
  
  return newSubmission;
};

// Update submission status
export const updateSubmissionStatus = (id: string, status: ContactSubmission['status']): void => {
  const submissions = getAllSubmissions();
  const index = submissions.findIndex(s => s.id === id);
  
  if (index !== -1) {
    submissions[index].status = status;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
  }
};

// Delete a submission
export const deleteSubmission = (id: string): void => {
  const submissions = getAllSubmissions();
  const filtered = submissions.filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

// Get submission counts by status
export const getSubmissionStats = () => {
  const submissions = getAllSubmissions();
  return {
    total: submissions.length,
    new: submissions.filter(s => s.status === 'new').length,
    read: submissions.filter(s => s.status === 'read').length,
    replied: submissions.filter(s => s.status === 'replied').length
  };
};
