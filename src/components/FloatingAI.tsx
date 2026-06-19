import { Bot } from "lucide-react";

const FloatingAI = () => {
  return (
    <button
      className="
      fixed
      bottom-8
      right-8
      w-16
      h-16
      rounded-full
      bg-purple-600
      text-white
      shadow-lg
      hover:scale-110
      transition
      flex
      items-center
      justify-center
      z-50
      "
    >
      <Bot size={28} />
    </button>
  );
};

export default FloatingAI;