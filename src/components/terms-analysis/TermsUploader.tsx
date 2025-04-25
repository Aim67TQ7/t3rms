
import { useState } from 'react';
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
  
  const {
    fileSizeError,
    getRootProps,
    getInputProps,
    isDragActive,
    setFile: setUploadedFile,
  } = useFileUpload((content: string) => {
    setText(content);
    setCurrentText(content);
  });

  const handleTextInput = (text: string) => {
    setText(text);
    setCurrentText(text);
    setFile(null);
  };

  const handleInputMethodChange = (method: 'file' | 'text') => {
    setInputMethod(method);
    if (method === 'text') {
      setFile(null);
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
        />
      ) : (
        <TextInputArea onTextUpdate={handleTextInput} />
      )}

      <Button 
        onClick={onAnalyze} 
        disabled={(inputMethod === 'file' && !file) || (inputMethod === 'text' && !currentText) || loading || !!fileSizeError}
        className={`w-full py-6 text-lg ${
          ((file || currentText) && !loading && !fileSizeError)
            ? 'bg-blue-600 hover:bg-blue-700'
            : 'bg-gray-300'
        }`}
      >
        {loading ? (
          <>
            <span className="animate-pulse">Analyzing...</span>
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
