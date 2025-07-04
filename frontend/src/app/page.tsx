"use client";

import { useState } from "react";
import Image from "next/image";
import './globals.css'

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [convertedFile, setConvertedFile] = useState<string | null>(null);
  const [conversionType, setConversionType] = useState<string>("png");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
    formData.append("requiredFormat", conversionType);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/process-image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to convert image.");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setConvertedFile(url);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
          Image Converter
        </h1>

        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
                <strong className="font-bold">Error:</strong>
                <span className="block sm:inline"> {error}</span>
            </div>
        )}

        {/* Conversion Type Tabs */}
        <div className="flex justify-center space-x-2 border-b-2 border-gray-200 dark:border-gray-700 pb-4">
          <button
            onClick={() => setConversionType("jpeg")}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              conversionType === "jpeg"
                ? "bg-blue-600 text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            JPEG
          </button>
          <button
            onClick={() => setConversionType("png")}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              conversionType === "png"
                ? "bg-blue-600 text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            PNG
          </button>
          <button
            onClick={() => setConversionType("webp")}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              conversionType === "webp"
                ? "bg-blue-600 text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            WEBP
          </button>
        </div>

        {/* File Upload Section */}
        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
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
            <span className="text-xs">PNG, JPG, WEBP, GIF, etc.</span>
          </label>
        </div>

        {file && (
          <div className="text-center">
            <button
              onClick={handleUpload}
              disabled={isLoading}
              className="w-full px-6 py-3 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition duration-300 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Converting...' : `Convert to ${conversionType.toUpperCase()}`}
            </button>
          </div>
        )}

        {/* Result Section */}
        {convertedFile && (
          <div className="text-center p-6 border-t-2 border-gray-200 dark:border-gray-700 mt-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Converted Image
            </h2>
            <div className="flex justify-center">
              <Image
                src={convertedFile}
                alt="Converted file"
                width={300}
                height={300}
                className="rounded-lg shadow-md"
              />
            </div>
            <a
              href={convertedFile}
              download={`converted-image.${conversionType}`}
              className="inline-block w-full px-6 py-3 mt-6 text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 transition duration-300"
            >
              Download
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
