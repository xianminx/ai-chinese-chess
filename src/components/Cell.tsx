import { Piece } from '../types/GameTypes';
import { useEffect, useRef } from 'react';

interface CellProps {
  piece: Piece;
  isSelected: boolean;
  onClick: () => void;
  style?: React.CSSProperties;
}

export default function Cell({ piece, isSelected, onClick, style }: CellProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio('/audio/click.wav');
  }, []);

  const handleClick = () => {
    // Play sound and trigger the onClick handler
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Reset audio to start
      audioRef.current.play();
    }
    onClick();
  };

  return (
    <div
      className={`
        absolute -translate-x-1/2 -translate-y-1/2
        w-9 h-9
        rounded-full
        flex items-center justify-center
        cursor-pointer 
        transition-all duration-200
        bg-gray-100
        ${isSelected ? 'ring-4 ring-yellow-400 bg-yellow-200' : ''}
        hover:brightness-95
      `}
      style={style}
      onClick={handleClick}
    >
      {piece && (
        <span className={`
          text-2xl 
          ${piece.color === 'red' ? 'text-red-600' : 'text-black'}
        `}>
          {piece.type}
        </span>
      )}
    </div>
  );
} 