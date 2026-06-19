import type { ReactNode } from "react";

type ActionCardProps = {
  title: string;
  icon: ReactNode;
};

const ActionCard = ({
  title,
  icon,
}: ActionCardProps) => {
  return (
    <div
      className="
      w-48
      h-48
      bg-white
      border
      rounded-xl
      shadow-sm
      hover:shadow-lg
      transition-all
      cursor-pointer
      flex
      flex-col
      items-center
      justify-center
      gap-4
      "
    >
      {icon}

      <h3 className="font-semibold text-gray-700">
        {title}
      </h3>
    </div>
  );
};

export default ActionCard;