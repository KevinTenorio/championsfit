"use client";

import React, { useState } from "react";
import { pokemonSpriteUrl, pokemonFallbackUrl, itemSpriteUrl, itemSpriteSize } from "@/lib/sprites";

interface PokemonSpriteProps {
  name: string;
  size?: number;
  className?: string;
}

export function PokemonSprite({ name, size = 40, className }: PokemonSpriteProps) {
  const [src, setSrc] = useState(pokemonSpriteUrl(name));
  const [failed, setFailed] = useState(false);

  if (failed) return <div style={className ? undefined : { width: size, height: size }} className={className} />;

  function handleError() {
    const fallback = pokemonFallbackUrl(name);
    if (fallback && src !== fallback) {
      setSrc(fallback);
    } else {
      setFailed(true);
    }
  }

  const sizeStyle = className
    ? ({ imageRendering: "pixelated", objectFit: "contain" } as React.CSSProperties)
    : ({ imageRendering: "pixelated", width: size, height: size, objectFit: "contain" } as React.CSSProperties);

  return (
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      className={className}
      onError={handleError}
      style={sizeStyle}
    />
  );
}

interface ItemSpriteProps {
  name: string;
}

export function ItemSprite({ name }: ItemSpriteProps) {
  const [failed, setFailed] = useState(false);
  if (failed || !name) return null;
  const size = itemSpriteSize(name);
  return (
    <img
      src={itemSpriteUrl(name)}
      alt={name}
      width={size}
      height={size}
      onError={() => setFailed(true)}
      style={{ width: size, height: size, objectFit: "contain" }}
    />
  );
}
