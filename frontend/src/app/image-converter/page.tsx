"use client";

import { useState } from "react";
import Image from "next/image";

export default function ImageConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [convertedFile, setConvertedFile] = useState<string | null>(null);
  const [conversionType, setConversionType] = useState<string>("png");
  const [quality, setQuality] = useState<number>(80);
  const [width, setWidth] = useState<number | undefined>(undefined);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<{
    width: number;
    height: number;
    format: string;
    size: number;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files ? e.target.files[0] : null);
    setConvertedFile(null);
    setError(null);
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = e.target.value ? parseInt(e.target.value) : undefined;
    setWidth(newWidth);
    
    // Maintain aspect ratio if enabled and we have original dimensions
    if (maintainAspectRatio && newWidth && metadata) {
      const aspectRatio = metadata.width / metadata.height;
      setHeight(Math.round(newWidth / aspectRatio));
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = e.target.value ? parseInt(e.target.value) : undefined;
    setHeight(newHeight);
    
    // Maintain aspect ratio if enabled and we have original dimensions
    if (maintainAspectRatio && newHeight && metadata) {
      const aspectRatio = metadata.width / metadata.height;
      setWidth(Math.round(newHeight * aspectRatio));
    }
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
    formData.append("requiredQuality", quality.toString());
    
    if (width) {
      formData.append("requiredWidth", width.toString());
    }
    if (height) {
      formData.append("requiredHeight", height.toString());
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/process-image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to convert image.");
      }

      const blob = await response.blob();

      const metadata = response.headers.get('X-File-Metadata');
      const url = URL.createObjectURL(blob);
      setConvertedFile(url);
      setMetadata(JSON.parse(metadata || '{}'));
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
            className={`px-4 py-2 text-sm font-medium rounded-lg ${conversionType === "jpeg"
                ? "bg-blue-600 text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
          >
            JPEG
          </button>
          <button
            onClick={() => setConversionType("png")}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${conversionType === "png"
                ? "bg-blue-600 text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
          >
            PNG
          </button>
          <button
            onClick={() => setConversionType("webp")}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${conversionType === "webp"
                ? "bg-blue-600 text-white"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
          >
            WEBP
          </button>
        </div>

        {/* Dimensions Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Dimensions</h3>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="maintain-ratio"
              checked={maintainAspectRatio}
              onChange={(e) => setMaintainAspectRatio(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="maintain-ratio" className="text-sm text-gray-700 dark:text-gray-300">
              Maintain aspect ratio
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Width (px)
              </label>
              <input
                type="number"
                value={width || ''}
                onChange={handleWidthChange}
                placeholder="Auto"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Height (px)
              </label>
              <input
                type="number"
                value={height || ''}
                onChange={handleHeightChange}
                placeholder="Auto"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Leave empty to keep original dimensions
          </div>
        </div>

        {/* Quality Slider */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Quality: {quality}%
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            disabled={isLoading}
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Low Quality (Smaller file)</span>
            <span>High Quality (Larger file)</span>
          </div>
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
              {isLoading ? 'Converting...' : `Convert to ${conversionType.toUpperCase()} (${quality}% quality)`}
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
              <div className="w-1/2">
                <Image
                  src={convertedFile}
                  alt="Converted file"
                  width={300}
                  height={300}
                  className="rounded-lg shadow-md"
                />
              </div>
              <div className="w-1/2">
                <p>Width: {metadata?.width}</p>
                <p>Height: {metadata?.height}</p>
                <p>Format: {metadata?.format}</p>
                <p>Size: {metadata?.size}</p>
              </div>
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