#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const dns = require('dns');

// Use Google DNS to avoid DNS resolution issues
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

/**
 * Embed PDF by ID
 * @param {string} id - PDF ID
 * @returns {Promise<Object>} Embed response
 */
async function embedPdf(id) {
  try {
    const apiBase = 'https://vivian-claude.onrender.com';
    const apiEndpoint = '/pdf/embed';
    const url = `${apiBase}${apiEndpoint}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ id })
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
    // Read IDs from JSON file
    const idsFilePath = path.resolve(process.cwd(), 'src/data/unembedded-ids.json');
    
    if (!fs.existsSync(idsFilePath)) {
      console.error(`File not found: ${idsFilePath}`);
      process.exit(1);
    }

    const idsContent = fs.readFileSync(idsFilePath, 'utf8');
    const ids = JSON.parse(idsContent);

    if (!Array.isArray(ids) || ids.length === 0) {
      console.log('No IDs found in the file.');
      process.exit(0);
    }

    console.log(`Found ${ids.length} PDF(s) to embed`);

    // Embed each PDF
    for (let i = 0; i < ids.length; i += 1) {
      const id = ids[i];
      console.log(`[${i + 1}/${ids.length}] Embedding PDF with ID: ${id}...`);
      
      try {
        const result = await embedPdf(id);
        console.log(`[${i + 1}/${ids.length}] Success`);
      } catch (error) {
        console.error(`[${i + 1}/${ids.length}] Error embedding PDF ${id}:`, error.message);
      }
    }

    console.log('\nAll PDFs processed.');
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();

