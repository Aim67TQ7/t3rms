
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useToast } from "@/hooks/use-toast";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export const useFileUpload = (onContentUpdate: (content: string) => void) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileSizeError, setFileSizeError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    console.log("File dropped:", file.name, "size:", file.size);
    
    if (file.size > MAX_FILE_SIZE) {
      setFileSizeError(`File is too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`);
      toast({
        title: "File too large",
        description: `Please upload a file smaller than ${MAX_FILE_SIZE / 1024 / 1024}MB or paste the text directly.`,
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setFileSizeError(null);
    setFile(file);

    try {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (event.target?.result) {
          const content = event.target.result as string;
          onContentUpdate(content);
          console.log("File content read successfully, length:", content.length);
          toast({
            title: "File uploaded",
            description: "Your file has been successfully uploaded.",
          });
        }
        setIsLoading(false);
      };
      
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        toast({
          title: "Error",
          description: "Failed to read file. Please try again or paste the text directly.",
          variant: "destructive",
        });
        setFile(null);
        setIsLoading(false);
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error("Error processing file:", error);
      setFile(null);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to process file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    multiple: false,
    maxSize: MAX_FILE_SIZE
  });

  return {
    file,
    fileSizeError,
    isLoading,
    getRootProps,
    getInputProps,
    isDragActive,
    setFile,
    setFileSizeError,
  };
};
