
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { FileText } from 'lucide-react';
import { useFileUpload } from '@/hooks/useFileUpload';
import { FileDropzone } from './FileDropzone';
import { TextInputArea } from './TextInputArea';
import { InputModeToggle } from './InputModeToggle';

interface TermsUploaderProps {
  file: File | null;
  setFile: (file: File | null) => void;
  setText: (text: string) => void;
  onAnalyze: () => void;
  loading: boolean;
}

const TermsUploader = ({ file, setFile, setText, onAnalyze, loading }: TermsUploaderProps) => {
  const [inputMethod, setInputMethod] = useState<'file' | 'text'>('file');
  const [currentText, setCurrentText] = useState('');
  
  const handleContentUpdate = (content: string) => {
    setText(content);
    setCurrentText(content);
  };
  
  const {
    fileSizeError,
    getRootProps,
    getInputProps,
    isDragActive,
    isLoading,
    file: uploadedFile,
    setFile: setUploadedFile,
  } = useFileUpload(handleContentUpdate);

  // Synchronize the file state with parent component
  useEffect(() => {
    if (uploadedFile !== file) {
      setFile(uploadedFile);
    }
  }, [uploadedFile, file, setFile]);

  const handleTextInput = (text: string) => {
    setText(text);
    setCurrentText(text);
    setFile(null);
    setUploadedFile(null);
  };

  const handleInputMethodChange = (method: 'file' | 'text') => {
    setInputMethod(method);
    if (method === 'text') {
      setFile(null);
      setUploadedFile(null);
    }
  };

  return (
    <div className="space-y-6">
      <InputModeToggle
        inputMethod={inputMethod}
        onInputMethodChange={handleInputMethodChange}
      />

      {inputMethod === 'file' ? (
        <FileDropzone
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          isDragActive={isDragActive}
          file={file}
          fileSizeError={fileSizeError}
          isLoading={isLoading}
        />
      ) : (
        <TextInputArea onTextUpdate={handleTextInput} initialText={currentText} />
      )}

      <Button 
        onClick={onAnalyze} 
        disabled={isLoading || loading || (inputMethod === 'file' && !file) || (inputMethod === 'text' && !currentText) || !!fileSizeError}
        className={`w-full py-6 text-lg ${
          ((file || currentText) && !loading && !fileSizeError && !isLoading)
            ? 'bg-blue-600 hover:bg-blue-700'
            : 'bg-gray-300'
        }`}
      >
        {loading || isLoading ? (
          <>
            <span className="animate-pulse">{loading ? "Analyzing..." : "Processing file..."}</span>
          </>
        ) : (
          <>
            <FileText className="mr-2 h-5 w-5" />
            Analyze Contract
          </>
        )}
      </Button>
    </div>
  );
};

export default TermsUploader;
