/**
 * SVG definitions referenced by id from CSS and from the mark components.
 * Rendered once, at the end of <body>, in a zero-size svg.
 *
 * The ink-bleed filter is applied only to display-size type, and only after
 * the preloader adds `.printed` to <html>. Tune `scale` down until you have
 * to compare filtered and unfiltered side by side to see it; if it reads as
 * an effect it is too strong.
 */
export function PrintDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
      <defs>
        <filter
          id="ink-bleed"
          x="-3%"
          y="-3%"
          width="106%"
          height="106%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9 0.7"
            numOctaves={2}
            seed={7}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={1.2}
            xChannelSelector="R"
            yChannelSelector="G"
            result="bled"
          />
          <feMorphology in="bled" operator="dilate" radius={0.2} />
        </filter>
      </defs>
    </svg>
  );
}
