import { Piece } from "../types/GameTypes";

interface CellProps {
    piece: Piece | undefined;
    isSelected: boolean;
    onClick: () => void;
    style?: React.CSSProperties;
}

export default function Cell({ piece, isSelected, onClick, style }: CellProps) {

    const handleClick = () => {
        onClick();
    };

    const fontSize = style?.width
        ? `${parseInt(style.width as string) * 0.6}px`
        : "inherit";

    return (
        <div
            className={`
        absolute -translate-x-1/2 -translate-y-1/2
        rounded-full
        flex items-center justify-center
        cursor-pointer 
        transition-all duration-200
        ${piece ? "bg-gray-100 ring-2 ring-inset ring-gray-300" : ""}
        ${isSelected ? "ring-2 ring-yellow-400 bg-yellow-200" : ""}
        hover:brightness-95
      `}
            style={style}
            onClick={handleClick}
        >
            {piece && (
                <span
                    className={`
          w-[85%] h-[85%] flex items-center justify-center
          text-[60%] leading-none rounded-full ring-1 ring-inset ring-gray-800
          ${piece.color === "red" ? "text-red-600" : "text-black"}
        `}
                    style={{ fontSize: fontSize }}
                >
                    {piece.type}
                </span>
            )}
        </div>
    );
}
