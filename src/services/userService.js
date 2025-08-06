import { httpService } from './httpService';

const API_BASE_URL = 'https://vivian-claude.onrender.com';

class UserService {
  async getAllUsers() {
    try {
      const response = await httpService.get(`${API_BASE_URL}/user/all`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id) {
    try {
      const response = await httpService.get(`${API_BASE_URL}/user/${id}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id, userData) {
    try {
      const response = await httpService.put(`${API_BASE_URL}/user/${id}`, userData);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id) {
    try {
      const response = await httpService.delete(`${API_BASE_URL}/user/${id}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async changeUserRole(id, role) {
    try {
      const response = await httpService.put(`${API_BASE_URL}/user/${id}/role`, { role });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async toggleUserAccess(id, isAllowed) {
    try {
      const response = await httpService.put(`${API_BASE_URL}/user/${id}/access`, { isAllowed });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  async getUserStats() {
    try {
      const response = await httpService.get(`${API_BASE_URL}/user/stats`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
}

export const userService = new UserService(); 