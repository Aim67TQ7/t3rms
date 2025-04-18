
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { FileUp, FileText, AlertCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DropzoneUploaderProps {
  file: File | null;
  setFile: (file: File | null) => void;
  setText: (text: string) => void;
  onAnalyze: () => void;
  loading: boolean;
}

const DropzoneUploader = ({ file, setFile, setText, onAnalyze, loading }: DropzoneUploaderProps) => {
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    // Only allow one file
    const file = acceptedFiles[0];
    setFile(file);

    const reader = new FileReader();
    reader.onload = (event: any) => {
      setText(event.target.result);
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
    multiple: false
  });

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-t3rms-charcoal">Upload Document</h2>
          <Tooltip>
            <TooltipTrigger>
              <AlertCircle className="h-5 w-5 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>Supported formats: PDF, DOC, DOCX, TXT</p>
              <p className="mt-2">File size limit: 10MB</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <p className="text-sm text-muted-foreground">
          Upload your Terms & Conditions for AI analysis
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div 
          {...getRootProps()} 
          className={`
            dropzone border-2 border-dashed rounded-lg p-8 text-center 
            transition-colors duration-200 cursor-pointer
            ${isDragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-primary hover:bg-primary/5'
            }
          `}
        >
          <input {...getInputProps()} />
          <div className="space-y-4">
            <div className="flex justify-center">
              {file ? (
                <FileText className="h-12 w-12 text-primary" />
              ) : (
                <FileUp className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
            
            {file ? (
              <div className="space-y-2">
                <p className="text-sm font-medium">Selected file:</p>
                <p className="text-sm text-muted-foreground break-all">
                  {file.name}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  {isDragActive ? 'Drop your file here' : 'Drag & drop your file here'}
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse your files
                </p>
              </div>
            )}
          </div>
        </div>

        <Button 
          onClick={onAnalyze} 
          disabled={!file || loading} 
          className="w-full"
        >
          {loading ? (
            <>
              <span className="animate-pulse">Analyzing...</span>
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Analyze Document
            </>
          )}
        </Button>

        <div className="rounded-lg bg-muted/50 p-4">
          <h3 className="text-sm font-medium mb-2">How it works:</h3>
          <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
            <li>Upload your Terms & Conditions document</li>
            <li>Our AI analyzes the content</li>
            <li>Get detailed insights and suggestions</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default DropzoneUploader;
