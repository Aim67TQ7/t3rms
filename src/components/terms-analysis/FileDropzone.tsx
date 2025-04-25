
import { FileUp, FileText, AlertCircle } from 'lucide-react';

interface FileDropzoneProps {
  getRootProps: any;
  getInputProps: any;
  isDragActive: boolean;
  file: File | null;
  fileSizeError: string | null;
  onFileSelected?: (file: File | null) => void;
}

export const FileDropzone = ({ 
  getRootProps, 
  getInputProps, 
  isDragActive, 
  file, 
  fileSizeError,
  onFileSelected
}: FileDropzoneProps) => {
  // Create a modified version of getRootProps that will trigger onFileSelected
  const getModifiedRootProps = () => {
    const originalProps = getRootProps();
    return {
      ...originalProps,
      onDrop: (acceptedFiles: File[]) => {
        originalProps.onDrop?.(acceptedFiles);
        if (acceptedFiles.length > 0 && onFileSelected) {
          onFileSelected(acceptedFiles[0]);
        }
      }
    };
  };

  return (
    <div 
      {...getModifiedRootProps()} 
      className={`
        dropzone border-2 border-dashed rounded-lg p-12 text-center 
        transition-all duration-300 cursor-pointer
        ${isDragActive 
          ? 'border-blue-500 bg-blue-50' 
          : file 
            ? 'border-green-500 bg-green-50'
            : fileSizeError 
              ? 'border-red-500 bg-red-50'
              : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
        }
      `}
    >
      <input {...getInputProps()} />
      <div className="space-y-4">
        <div className="flex justify-center">
          {file ? (
            <FileText className="h-16 w-16 text-green-500" />
          ) : fileSizeError ? (
            <AlertCircle className="h-16 w-16 text-red-500" />
          ) : (
            <FileUp className={`h-16 w-16 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
          )}
        </div>
        
        {file ? (
          <div className="space-y-2">
            <p className="text-lg font-medium text-green-600">File ready for analysis</p>
            <p className="text-sm text-green-600 break-all">
              {file.name}
            </p>
          </div>
        ) : fileSizeError ? (
          <div className="space-y-2">
            <p className="text-lg font-medium text-red-600">Error</p>
            <p className="text-sm text-red-600">
              {fileSizeError}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-700">
              {isDragActive ? 'Drop your file here' : 'Drag & drop your contract here'}
            </p>
            <p className="text-sm text-gray-500">
              or click to browse your files (max size: 2MB)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
