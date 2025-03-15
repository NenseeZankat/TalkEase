// src/components/chat/DateDivider.tsx
import { FC } from "react";

interface DateDividerProps {
  text: string;
  themeStyles: any;
}

const DateDivider: FC<DateDividerProps> = ({ text, themeStyles }) => {
  return (
    <div className="flex justify-center my-6">
      <div className={`${themeStyles.divider} text-purple-200 text-xs px-3 py-1 rounded-full shadow-lg`}>
        {text}
      </div>
    </div>
  );
};

export default DateDivider;