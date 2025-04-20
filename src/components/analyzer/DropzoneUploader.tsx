import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { FileUp, FileText, ArrowRight, AlertCircle } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface DropzoneUploaderProps {
  file: File | null;
  setFile: (file: File | null) => void;
  setText: (text: string) => void;
  onAnalyze: () => void;
  loading: boolean;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const DropzoneUploader = ({ file, setFile, setText, onAnalyze, loading }: DropzoneUploaderProps) => {
  const [directInputText, setDirectInputText] = useState('');
  const [inputMethod, setInputMethod] = useState<'file' | 'text'>('file');
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
    setInputMethod('file');

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (event.target?.result) {
        const content = event.target.result as string;
        setText(content);
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

  const handleTextInput = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    if (value.length > MAX_FILE_SIZE / 2) {
      toast({
        title: "Text too long",
        description: "The text is too long for analysis. Please shorten it or upload a smaller document.",
        variant: "destructive",
      });
      return;
    }
    
    setDirectInputText(value);
    setText(value);
    setInputMethod('text');
    setFile(null);
    setFileSizeError(null);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center mb-8 space-x-4">
        <div className={`flex items-center ${!file && !directInputText ? 'text-blue-600' : 'text-green-600'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${!file && !directInputText ? 'bg-blue-100 border-2 border-blue-600' : 'bg-green-100'}`}>
            1
          </div>
          <span className="ml-2 font-medium">Upload</span>
        </div>
        <ArrowRight className="w-4 h-4 text-gray-400" />
        <div className={`flex items-center ${(file || directInputText) && !loading ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${(file || directInputText) && !loading ? 'bg-blue-100 border-2 border-blue-600' : 'bg-gray-100'}`}>
            2
          </div>
          <span className="ml-2 font-medium">Analyze</span>
        </div>
      </div>

      <div className="flex gap-4 mb-2">
        <Button 
          variant={inputMethod === 'file' ? "default" : "outline"} 
          onClick={() => setInputMethod('file')}
          className={`flex-1 ${inputMethod === 'file' ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
        >
          Upload File
        </Button>
        <Button 
          variant={inputMethod === 'text' ? "default" : "outline"} 
          onClick={() => setInputMethod('text')}
          className={`flex-1 ${inputMethod === 'text' ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
        >
          Paste Text
        </Button>
      </div>

      {inputMethod === 'file' ? (
        <div 
          {...getRootProps()} 
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
                  {isDragActive ? 'Drop your file here' : 'Drag & drop your file here'}
                </p>
                <p className="text-sm text-gray-500">
                  or click to browse your files (max size: 2MB)
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <Textarea 
            placeholder="Paste your terms and conditions here..."
            className={`min-h-[200px] transition-all duration-300 ${
              directInputText 
                ? 'border-green-500 focus:border-green-500 focus:ring-green-500' 
                : 'focus:border-blue-500 focus:ring-blue-500'
            }`}
            value={directInputText}
            onChange={handleTextInput}
          />
          <p className="text-xs text-gray-500 text-right">Max ~1MB of text</p>
        </div>
      )}

      <Button 
        onClick={onAnalyze} 
        disabled={(inputMethod === 'file' && !file) || (inputMethod === 'text' && !directInputText) || loading || !!fileSizeError}
        className={`w-full py-6 text-lg ${
          ((file || directInputText) && !loading && !fileSizeError)
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
            Analyze Document
          </>
        )}
      </Button>
    </div>
  );
};

export default DropzoneUploader;
