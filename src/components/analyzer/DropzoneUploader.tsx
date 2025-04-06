
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

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

  const { getRootProps, getInputProps } = useDropzone({ 
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
    <Card className="mb-6">
      <CardHeader>
        <h2 className="text-lg font-semibold">Upload File (Single File Only)</h2>
      </CardHeader>
      <CardContent>
        <div {...getRootProps()} className="dropzone mb-4 border-2 border-dashed rounded-md p-4 text-center cursor-pointer">
          <input {...getInputProps()} />
          <p>Drag a file here, or click to select a file</p>
          {file && (
            <div className="mt-2">
              <p>Selected file: {file.name}</p>
            </div>
          )}
        </div>

        <Button onClick={onAnalyze} disabled={loading} className="w-full">
          {loading ? "Analyzing..." : "Analyze"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DropzoneUploader;
