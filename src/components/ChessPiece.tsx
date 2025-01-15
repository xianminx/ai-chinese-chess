"use client";
import { Piece, ShowType, isRed } from "@/lib/GameTypes";
import { useMemo } from "react";

const PieceImage: { [key in Uppercase<Piece>]: string } = {
  K: "/pieces/Xiangqi_King.svg",
  R: "/pieces/Xiangqi_Rook.svg",
  H: "/pieces/Xiangqi_Horse.svg",
  E: "/pieces/Xiangqi_Elephant.svg",
  A: "/pieces/Xiangqi_Advisor.svg",
  C: "/pieces/Xiangqi_Cannon.svg",
  P: "/pieces/Xiangqi_Pawn.svg",
} as const;

interface ChessPieceProps {
  piece: Piece;
  showType: ShowType;
  className?: string;
}

export default function ChessPiece({
  piece,
  showType = "Character",
  className,
}: ChessPieceProps) {
  //  the image contains 4 states,
  // 0: red character,
  // 1. red icon
  // 2. black character
  // 3. black icon
  const SpriteCount = 4;

  const { state, image } = useMemo(() => {
    const red = isRed(piece) ? 0 : 1;
    const showImage = showType === "Character" ? 0 : 1;
    return {
      state: ((red * 2 + showImage) / (SpriteCount - 1)) * 100, // note the state is the percentage of the image, see https://developer.mozilla.org/en-US/docs/Web/CSS/background-position#regarding_percentages
      image: PieceImage[piece.toUpperCase() as Uppercase<Piece>],
    };
  }, [piece, showType]);

  return (
    <div className={className}>
      <div
        style={{
          width: `100%`,
          height: "100%",
          backgroundImage: `url(${image})`,
          backgroundSize: `${SpriteCount * 100}% 100%`,
          backgroundPosition: `${state}% 0%`,
          backgroundRepeat: "no-repeat",
        }}
      />
    </div>
  );
}
