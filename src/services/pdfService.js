import { httpService } from './httpService';

const API_BASE_URL = 'https://vivian-claude.onrender.com';

class PdfService {
  /**
   * Get all PDFs from the backend
   * @returns {Promise<Array>} Array of PDF objects
   */
  async getAllPdfs() {
    try {
      const response = await httpService.get(`${API_BASE_URL}/pdf`);
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
      const response = await httpService.get(`${API_BASE_URL}/pdf/${id}`);
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
      const response = await httpService.delete(`${API_BASE_URL}/pdf/${id}`);
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
      const response = await fetch(`${API_BASE_URL}/pdf`, {
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
}

// Export singleton instance
export const pdfService = new PdfService(); 