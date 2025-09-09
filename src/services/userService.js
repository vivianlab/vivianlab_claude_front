import { httpService } from './httpService';
import { API_ENDPOINTS } from '../constants/api';

class UserService {
  async getAllUsers() {
    try {
      const response = await httpService.get(`${API_ENDPOINTS.USER.GET_ALL}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id) {
    try {
      const response = await httpService.get(`${API_ENDPOINTS.USER.GET_BY_ID}/${id}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id, userData) {
    try {
      const response = await httpService.put(`${API_ENDPOINTS.USER.UPDATE}/${id}`, userData);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id) {
    try {
      const response = await httpService.delete(`${API_ENDPOINTS.USER.DELETE}/${id}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async changeUserRole(id, role) {
    try {
      const response = await httpService.put(`${API_ENDPOINTS.USER.CHANGE_ROLE}/${id}`, { role });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async toggleUserAccess(id, isAllowed) {
    try {
      const response = await httpService.put(`${API_ENDPOINTS.USER.TOGGLE_ACCESS}/${id}`, { isAllowed });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async getUserStats() {
    try {
      const response = await httpService.get(`${API_ENDPOINTS.USER.STATS}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
}

export const userService = new UserService(); 