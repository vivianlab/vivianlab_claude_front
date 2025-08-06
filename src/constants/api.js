// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://vivian-claude.onrender.com',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/user/get',
    REGISTER: '/user/create',
    LOGOUT: '/user/logout',
    REFRESH: '/user/refresh'
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE: '/user/update',
    DELETE: '/user/delete',
    GET_ALL: '/user/all',
    GET_BY_ID: '/user',
    CHANGE_ROLE: '/user/role',
    STATS: '/user/stats'
  }
};

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH'
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

// Content Types
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  TEXT: 'text/plain'
};

// Default Headers
export const DEFAULT_HEADERS = {
  'Content-Type': CONTENT_TYPES.JSON,
  'Accept': CONTENT_TYPES.JSON
}; 