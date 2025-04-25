
import { Button } from "@/components/ui/button";

interface InputModeToggleProps {
  inputMethod: 'file' | 'text';
  onInputMethodChange: (method: 'file' | 'text') => void;
}

export const InputModeToggle = ({ inputMethod, onInputMethodChange }: InputModeToggleProps) => {
  return (
    <div className="flex gap-4 mb-2">
      <Button 
        variant={inputMethod === 'file' ? "default" : "outline"} 
        onClick={() => onInputMethodChange('file')}
        className={`flex-1 ${inputMethod === 'file' ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
      >
        Upload File
      </Button>
      <Button 
        variant={inputMethod === 'text' ? "default" : "outline"} 
        onClick={() => onInputMethodChange('text')}
        className={`flex-1 ${inputMethod === 'text' ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
      >
        Paste Text
      </Button>
    </div>
  );
};
