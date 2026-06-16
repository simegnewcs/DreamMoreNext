// API utility functions for making HTTP requests

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

// Generic fetch helper
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || `HTTP ${response.status}`,
      };
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: 'Network error',
    };
  }
}

// Courses API
export const coursesAPI = {
  // Get all courses
  getAll: async (params?: { category?: string; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return fetchAPI<{ courses: any[] }>(`/api/courses${query}`);
  },

  // Get single course by slug
  getBySlug: async (slug: string) => {
    return fetchAPI<{ course: any }>(`/api/courses/${slug}`);
  },

  // Create course (Admin)
  create: async (courseData: any) => {
    return fetchAPI('/api/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  },

  // Update course (Admin)
  update: async (slug: string, courseData: any) => {
    return fetchAPI(`/api/courses/${slug}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
  },

  // Delete course (Admin)
  delete: async (slug: string) => {
    return fetchAPI(`/api/courses/${slug}`, {
      method: 'DELETE',
    });
  },
};

// Applications API
export const applicationsAPI = {
  // Get all applications (Admin)
  getAll: async (params?: { status?: string; courseId?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.courseId) queryParams.append('courseId', params.courseId);

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return fetchAPI<{ applications: any[] }>(`/api/applications${query}`);
  },

  // Get single application
  getById: async (id: string) => {
    return fetchAPI<{ application: any }>(`/api/applications/${id}`);
  },

  // Check if user has applied to a course
  checkStatus: async (courseId: string, email: string) => {
    const queryParams = new URLSearchParams();
    queryParams.append('courseId', courseId);
    queryParams.append('email', email);
    return fetchAPI<{ hasApplied: boolean; application: { id: number; status: string; createdAt: string } | null }>(`/api/applications/check?${queryParams.toString()}`);
  },

  // Create new application
  create: async (applicationData: any) => {
    return fetchAPI('/api/applications', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  },

  // Update application status (Admin)
  updateStatus: async (id: string, status: string, adminNotes?: string) => {
    return fetchAPI(`/api/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status, admin_notes: adminNotes }),
    });
  },
};

// Users API (Admin only)
export const usersAPI = {
  // Get all users (Admin)
  getAll: async (params?: { role?: string; status?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.role) queryParams.append('role', params.role);
    if (params?.status) queryParams.append('status', params.status);
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return fetchAPI<{ users: any[]; total: number }>(`/api/admin/users${query}`);
  },

  // Get single user
  getById: async (id: string) => {
    return fetchAPI<{ user: any }>(`/api/admin/users/${id}`);
  },

  // Update user (Admin)
  update: async (id: string, userData: any) => {
    return fetchAPI(`/api/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // Delete user (Admin)
  delete: async (id: string) => {
    return fetchAPI(`/api/admin/users/${id}`, {
      method: 'DELETE',
    });
  },
};

// Auth API
export const authAPI = {
  // Login
  login: async (email: string, password: string) => {
    return fetchAPI<{ user: any; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Register
  register: async (email: string, password: string, name: string, role?: string) => {
    return fetchAPI<{ user: any; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, role }),
    });
  },

  // Resend verification email
  resendVerification: async (email: string) => {
    return fetchAPI('/api/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};

// Client-side data fetching helpers
export async function fetchCourses(category?: string): Promise<any[]> {
  try {
    const response = await fetch(
      `${API_BASE}/api/courses${category ? `?category=${category}` : ''}`,
      { cache: 'no-store' }
    );
    const data = await response.json();
    return data.success ? data.courses : [];
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
}

export async function fetchCourseBySlug(slug: string): Promise<any | null> {
  try {
    const response = await fetch(
      `${API_BASE}/api/courses/${slug}`,
      { cache: 'no-store' }
    );
    const data = await response.json();
    return data.success ? data.course : null;
  } catch (error) {
    console.error('Error fetching course:', error);
    return null;
  }
}

export async function fetchApplications(): Promise<any[]> {
  try {
    const response = await fetch(
      `${API_BASE}/api/applications`,
      { cache: 'no-store' }
    );
    const data = await response.json();
    return data.success ? data.applications : [];
  } catch (error) {
    console.error('Error fetching applications:', error);
    return [];
  }
}
