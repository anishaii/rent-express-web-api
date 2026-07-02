// centralized path definitions for API endpoints
export const API = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    WHOAMI: "/api/auth/whoami",
    UPDATE: "/api/auth/update",
  },
  ADMIN: {
    USERS: {
      GET_ALL: "/api/admin/users",
      GET_BY_ID: (id: string) => `/api/admin/users/${id}`,
      CREATE: "/api/admin/users",
      UPDATE: (id: string) => `/api/admin/users/${id}`,
      UPDATE_PASSWORD: (id: string) => `/api/admin/users/${id}/password`,
      DELETE: (id: string) => `/api/admin/users/${id}`,
    },
    // brand endpoints
    BRANDS: {
      GET_ALL: "/api/admin/brand",
      CREATE: "/api/admin/brand/create",
      UPDATE: (id: string) => `/api/admin/brand/update/${id}`,
      DELETE: (id: string) => `/api/admin/brand/delete/${id}`,
    },
    // category endpoints
    CATEGORIES: {
      GET_ALL: "/api/admin/category",
      CREATE: "/api/admin/category/create",
      UPDATE: (id: string) => `/api/admin/category/update/${id}`,
      DELETE: (id: string) => `/api/admin/category/delete/${id}`,
    },
  },
  // public endpoints - no auth needed
  PUBLIC: {
    BRANDS: "/api/brand",
    CATEGORIES: "/api/category",
  },
};
