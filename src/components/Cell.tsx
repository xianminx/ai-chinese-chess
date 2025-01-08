import { Piece } from "../types/GameTypes";
import { useEffect, useRef } from "react";

interface CellProps {
    piece: Piece;
    isSelected: boolean;
    onClick: () => void;
    style?: React.CSSProperties;
}

export default function Cell({ piece, isSelected, onClick, style }: CellProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        audioRef.current = new Audio("/audio/click.wav");
    }, []);

    const handleClick = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
        }
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
        bg-gray-100
        ${isSelected ? "ring-[15%] ring-yellow-400 bg-yellow-200" : ""}
        hover:brightness-95
      `}
            style={style}
            onClick={handleClick}
        >
            <span
                className={`
          w-full h-full flex items-center justify-center
          text-[60%] leading-none
          ${piece.color === "red" ? "text-red-600" : "text-black"}
        `}
                style={{ fontSize: fontSize }}
            >
                {piece.type}
            </span>
        </div>
    );
}
