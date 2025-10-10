#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const dns = require('dns');

// Use Google DNS to avoid DNS resolution issues
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

/**
 * Get all unembedded PDFs from the backend
 * @returns {Promise<Array>} Array of PDF objects
 */
async function getAllUnembeddedPdfs() {
  try {
    const apiBase = 'https://vivian-claude.onrender.com';
    const apiEndpoint = '/pdf/unembedded';
    const url = `${apiBase}${apiEndpoint}`;

    console.log(`Fetching unembedded PDFs from ${url}...`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`HTTP error! status: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

async function main() {
  try {
    const data = await getAllUnembeddedPdfs();
    
    // Extract only IDs from data
    const ids = data.map(pdf => pdf._id || pdf.id);
    
    // Write IDs to JSON file
    const outputPath = path.resolve(process.cwd(), 'src/data/unembedded-ids.json');
    fs.writeFileSync(outputPath, JSON.stringify(ids, null, 2), 'utf8');
    
    console.log('Success: IDs written to', outputPath);
    console.log('Total unembedded PDFs:', ids.length);
  } catch (err) {
    console.error('Error fetching unembedded PDFs:', err.message);
    process.exit(1);
  }
}

main();
