import { useState, type CSSProperties } from 'react'

/* Remote editorial images are the one thing on these pages we do not
   control. If one fails or is still in flight, this degrades to a branded
   gradient rather than a broken-image box or a white hole in the layout. */
export default function SmartImage({
  src,
  alt = '',
  style,
  className,
}: {
  src: string
  alt?: string
  style?: CSSProperties
  className?: string
}) {
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading')

  return (
    <span
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        display: 'block',
        overflow: 'hidden',
        background: 'linear-gradient(140deg, #0c4a6e 0%, #0284c7 55%, #38bdf8 100%)',
      }}
    >
      {state !== 'error' && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setState('ok')}
          onError={() => setState('error')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            opacity: state === 'ok' ? 1 : 0,
            transition: 'opacity 0.5s ease',
            ...style,
          }}
        />
      )}
    </span>
  )
}
