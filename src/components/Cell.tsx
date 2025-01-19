import { Piece, ShowType } from "../lib/engine/types";
import ChessPiece from "./ChessPiece";

interface CellProps {
  piece: Piece | null;
  isSelected: boolean;
  onClick: () => void;
  style?: React.CSSProperties;
  showType?: ShowType;
}

export default function Cell({ piece, isSelected, onClick, style, showType }: CellProps) {
  const handleClick = () => {
    onClick();
  };

  return (
    <div
      className={`
        absolute -translate-x-1/2 -translate-y-1/2
        rounded-full
        flex items-center justify-center
        cursor-pointer 
        transition-all duration-200
        ${isSelected ? "ring-2 ring-yellow-400 bg-yellow-200" : ""}
        hover:brightness-95
      `}
      style={style}
      onClick={handleClick}
    >
      {piece && (
        <ChessPiece className="w-[85%] h-[85%]" piece={piece} showType={showType || "Character"} />
      )}
    </div>
  );
}
