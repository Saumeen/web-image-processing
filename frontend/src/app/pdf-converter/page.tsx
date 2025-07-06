"use client";

import { useState } from "react";

export default function PDFConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [convertedFile, setConvertedFile] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<{
    fileName:string;
    originalSize?: string;
    compressedSize?: string;
    compressionRatio?: string;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files ? e.target.files[0] : null);
    setConvertedFile(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setConvertedFile(null);

    const formData = new FormData();
    formData.append("file", file);
    
    // Add the required fields for PDF compression
    const requestData = {
      compressionLevel: "medium" as const,
      quality: 80,
      removeMetadata: false
    };
    
    // Append the JSON data as a string
    formData.append("data", JSON.stringify(requestData));

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/process-pdf`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to compress PDF.");
      }

      const blob = await response.blob();
      const metadata = response.headers.get('X-PDF-Metadata');
      const url = URL.createObjectURL(blob);
      setConvertedFile(url);
      setMetadata(JSON.parse(metadata || '{}'));
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const getConversionDescription = () => {
    return "Compress PDF files to reduce file size while maintaining quality";
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
          PDF Compressor
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {/* PDF Compression Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div>
              <h4 className="font-medium text-gray-800 dark:text-white">PDF Compression</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Reduce PDF file size while maintaining quality</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            {getConversionDescription()}
          </p>
        </div>

        {/* File Upload Section */}
        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf"
            disabled={isLoading}
          />
          <label
            htmlFor="file-upload"
            className={`cursor-pointer flex flex-col items-center space-y-2 text-gray-600 dark:text-gray-400 ${isLoading ? 'opacity-50' : ''}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span className="font-medium">
              {file ? file.name : "Click to select a file or drag and drop"}
            </span>
            <span className="text-xs">PDF files only</span>
          </label>
        </div>

        {file && (
          <div className="text-center">
            <button
              onClick={handleUpload}
              disabled={isLoading}
              className="w-full px-6 py-3 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition duration-300 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Compressing...' : 'Compress PDF'}
            </button>
          </div>
        )}

        {/* Result Section */}
        {convertedFile && (
          <div className="text-center p-6 border-t-2 border-gray-200 dark:border-gray-700 mt-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Compression Complete
            </h2>
            {metadata && (
              <div className="mb-4 text-sm text-gray-600 dark:text-gray-400 space-y-1">
              
                {metadata.originalSize && <p>Original Size: {metadata.originalSize}</p>}
                {metadata.compressedSize && <p>Compressed Size: {metadata.compressedSize}</p>}
                {metadata.compressionRatio && <p>Compression Ratio: {metadata.compressionRatio}</p>}
              </div>
            )}
            <a
              href={convertedFile}
              download={`${metadata?.fileName || 'compressed'}.pdf`}
              className="inline-block w-full px-6 py-3 mt-6 text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 transition duration-300"
            >
              Download Compressed PDF
            </a>
          </div>
        )}
      </div>
    </main>
  );
} 