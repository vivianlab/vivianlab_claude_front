import { httpService } from './httpService';
import { API_ENDPOINTS, API_CONFIG } from '../constants/api';

class PdfService {
  /**
   * Get all PDFs from the backend
   * @returns {Promise<Array>} Array of PDF objects
   */
  async getAllPdfs() {
    try {
      const response = await httpService.get(`${API_ENDPOINTS.PDF.GET_ALL}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all unembedded PDFs from the backend
   * @returns {Promise<Array>} Array of PDF objects
   */

  async getAllUnembeddedPdfs() {
    try {
      const response = await httpService.get(`${API_ENDPOINTS.PDF.GET_ALL_UNEMBEDDED}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get PDF content by ID
   * @param {string} id - PDF ID
   * @returns {Promise<Object>} PDF object with content
   */
  async getPdfById(id) {
    try {
      const response = await httpService.get(`${API_ENDPOINTS.PDF.GET_BY_ID}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete PDF by ID
   * @param {string} id - PDF ID
   * @returns {Promise<Object>} Delete response
   */
  async deletePdf(id) {
    try {
      const response = await httpService.delete(`${API_ENDPOINTS.PDF.DELETE}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Upload PDF file with DOI
   * @param {FormData} formData - FormData containing PDF file and DOI
   * @returns {Promise<Object>} Upload response
   */
  async uploadPdf(formData) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.PDF.UPLOAD}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Embed PDF by ID
   * @param {string} id - PDF ID
   * @returns {Promise<Object>} Embed response
   */
  async embedPdf(id) {
    try {
      const response = await httpService.post(`${API_ENDPOINTS.PDF.EMBED}`, { id });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

// Export singleton instance
export const pdfService = new PdfService(); 