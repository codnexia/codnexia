export function HexGrid() {
  return (
    <svg width="100%" height="100%" className="absolute top-0 left-0 opacity-[0.03] pointer-events-none">
      <defs>
        <pattern id="hg" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(1.5)">
          <path d="M28 0L56 16.66V50L28 66.66L0 50V16.66Z" fill="none" stroke="#2DD4A8" strokeWidth="0.5" />
          <path d="M28 33.33L56 50V83.33L28 100L0 83.33V50Z" fill="none" stroke="#2DD4A8" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hg)" />
    </svg>
  );
}
