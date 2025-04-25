
import { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";

interface TextInputAreaProps {
  onTextUpdate: (text: string) => void;
  initialText?: string;
}

export const TextInputArea = ({ onTextUpdate, initialText = '' }: TextInputAreaProps) => {
  const [text, setText] = useState(initialText);

  useEffect(() => {
    if (initialText !== text) {
      setText(initialText);
    }
  }, [initialText]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    onTextUpdate(newText);
  };

  return (
    <div className="space-y-2">
      <Textarea
        placeholder="Paste your contract text here..."
        className={`min-h-[200px] ${
          text ? 'border-green-500 focus-visible:ring-green-500' : 'focus-visible:ring-blue-500'
        }`}
        value={text}
        onChange={handleChange}
      />
      <p className="text-xs text-gray-500 text-right">
        {text.length > 0 && `${text.length} characters`}
      </p>
    </div>
  );
};
