#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const dns = require('dns');
const XLSX = require('xlsx');

// Use Google DNS to avoid DNS resolution issues
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

function parseArgs(argv) {
  const args = {};
  for (const arg of argv.slice(2)) {
    const [key, val] = arg.replace(/^--/, '').split('=');
    args[key] = val === undefined ? true : val;
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv);
  const fileArg = 'src/data/ingestion.xlsx';
  const batchNumber = parseInt(args.rows || '1', 10); // rows arg now represents batch number
  const batchSize = 10; // Process 10 rows per batch
  const sheetIndex = parseInt(args.sheet || '0', 10);

  const filePath = path.resolve(process.cwd(), fileArg);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  try {
    const buffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[sheetIndex];
    if (!sheetName) {
      console.error(`Sheet index ${sheetIndex} not found. Available sheets: ${workbook.SheetNames.join(', ')}`);
      process.exit(1);
    }
    const worksheet = workbook.Sheets[sheetName];
    // Parse into array of objects using first row as headers
    const objects = XLSX.utils.sheet_to_json(worksheet, { defval: null });
    // Also parse header row to locate tag columns range
    const rowsHeader = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    const headers = Array.isArray(rowsHeader) && rowsHeader.length ? rowsHeader[0] : [];
    const startHeader = 'Stage of Menopause';
    const endHeader = 'Risk or Disease Associations';
    const startIdx = headers.indexOf(startHeader);
    const endIdx = headers.indexOf(endHeader);
    const hasTagRange = startIdx !== -1 && endIdx !== -1 && endIdx >= startIdx;

    const transformed = objects.map((row) => {
      if (!hasTagRange) return row;
      const tags = [];
      for (let i = startIdx; i <= endIdx; i += 1) {
        const key = headers[i];
        if (!key) continue;
        const value = row[key];
        const isEmpty = value === null || value === undefined || (typeof value === 'string' && value.trim() === '');
        if (!isEmpty) {
          tags.push({ [key]: value });
        }
      }
      // remove tag-range columns from the row object
      const cleaned = { ...row };
      for (let i = startIdx; i <= endIdx; i += 1) {
        const key = headers[i];
        if (key in cleaned) delete cleaned[key];
      }
      return { ...cleaned, tags };
    });

    if (!objects.length) {
      console.log('Sheet is empty.');
      process.exit(0);
    }

    // Calculate start and end indices for the batch
    const startIndex = (batchNumber - 1) * batchSize;
    const endIndex = startIndex + batchSize;
    const slice = transformed.slice(startIndex, endIndex);

    if (slice.length === 0) {
      console.log(`Batch ${batchNumber} is empty (rows ${startIndex + 1}-${endIndex} out of ${transformed.length} total).`);
      process.exit(0);
    }

    console.log(`Processing batch ${batchNumber}: rows ${startIndex + 1}-${Math.min(endIndex, transformed.length)} (${slice.length} items)`);

    
    // Download PDFs and upload them
    for (let i = 0; i < slice.length; i += 1) {
      const row = slice[i];
      const globalIndex = startIndex + i + 1; // Global row number in Excel
      const downloadedPath = path.resolve(process.cwd(), 'src/data/papers/', row.File);
      if (!fs.existsSync(downloadedPath)) {
        console.error(`[${globalIndex}/${transformed.length}] Skipping: file not found ${downloadedPath}`);
        continue;
      }
      
      // Upload the downloaded PDF using pdfService
      if (downloadedPath) {
        await uploadPdf(row, downloadedPath, globalIndex, transformed.length);
      }
    }
    console.log(`Batch ${batchNumber} complete.`);
  } catch (err) {
    console.error('Error reading XLSX:', err.message);
    process.exit(1);
  }
}

main();

/**
 * Upload PDF to backend (mimics pdfService.uploadPdf and handleSubmit from PDF.js)
 */
async function uploadPdf(row, pdfPath, index, total) {
  try {
    const doi = (row.DOI || '').toString().trim();
    const pmid = (row.PMID || '').toString().trim();
    const tags = row.tags ? JSON.stringify(row.tags) : '';
    const apiBase = 'https://vivianlab-claude-test.onrender.com';
    const apiEndpoint = '/pdf';

    if (pmid && !/^[0-9]+$/.test(pmid)) {
      console.error(`[${index}/${total}] Upload skipped: PMID must be numeric`);
      return;
    }

    console.log(`[${index}/${total}] Uploading PDF to ${apiBase}${apiEndpoint}...`);

    // Read PDF file and create Blob
    const pdfBuffer = fs.readFileSync(pdfPath);
    const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
    const filename = path.basename(pdfPath);

    // Create FormData (same as PDF.js handleSubmit)
    const formData = new FormData();
    formData.append('pdf', blob, filename);
    formData.append('doi', doi);
    if (pmid) formData.append('pmid', pmid);
    if (tags) formData.append('tags', tags);

    // Upload using fetch (same as pdfService.uploadPdf)
    const url = `${apiBase}${apiEndpoint}`;
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`HTTP error! status: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log(`[${index}/${total}] Upload successful:`, JSON.stringify(result.fileName, null, 2));
    
    // Delete the PDF file after successful upload
    fs.unlinkSync(pdfPath);
    console.log(`[${index}/${total}] Deleted local file: ${path.basename(pdfPath)}`);
  } catch (err) {
    console.error(`[${index}/${total}] Upload error:`, err.message);
  }
}

