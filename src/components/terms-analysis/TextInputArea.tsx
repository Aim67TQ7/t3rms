
import { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface TextInputAreaProps {
  onTextUpdate: (text: string) => void;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB for consistency

export const TextInputArea = ({ onTextUpdate }: TextInputAreaProps) => {
  const [directInputText, setDirectInputText] = useState('');
  const { toast } = useToast();

  const handleTextInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
    onTextUpdate(value);
  };

  return (
    <div className="space-y-2">
      <Textarea 
        placeholder="Paste your contract text here..."
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
  );
};
