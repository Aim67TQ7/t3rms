
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useToast } from "@/hooks/use-toast";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export const useFileUpload = (onContentUpdate: (content: string) => void) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileSizeError, setFileSizeError] = useState<string | null>(null);
  const { toast } = useToast();

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    
    if (file.size > MAX_FILE_SIZE) {
      setFileSizeError(`File is too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`);
      toast({
        title: "File too large",
        description: `Please upload a file smaller than ${MAX_FILE_SIZE / 1024 / 1024}MB or paste the text directly.`,
        variant: "destructive",
      });
      return;
    }
    
    setFileSizeError(null);
    setFile(file);

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (event.target?.result) {
        const content = event.target.result as string;
        onContentUpdate(content);
        console.log("File content read successfully, length:", content.length);
      }
    };
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      toast({
        title: "Error",
        description: "Failed to read file. Please try again or paste the text directly.",
        variant: "destructive",
      });
    };
    reader.readAsText(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: { 
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    multiple: false,
    maxSize: MAX_FILE_SIZE
  });

  return {
    file,
    fileSizeError,
    getRootProps,
    getInputProps,
    isDragActive,
    setFile,
    setFileSizeError,
  };
};
