import { useEffect, useRef } from 'react';

class Pixel {
  constructor(canvas, context, x, y, color, speed, delay) {
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = context;

    this.x = x;
    this.y = y;
    this.color = color;

    this.speed = this.getRandomValue(0.1, 0.9) * speed;

    this.size = 0;
    this.sizeStep = Math.random() * 0.4;

    this.minSize = 0.5;
    this.maxSizeInteger = 2;

    this.maxSize = this.getRandomValue(
      this.minSize,
      this.maxSizeInteger
    );

    this.delay = delay;
    this.counter = 0;

    this.counterStep =
      Math.random() * 4 +
      (this.width + this.height) * 0.01;

    this.isIdle = false;
    this.isReverse = false;
    this.isShimmer = false;
  }

  getRandomValue(min, max) {
    return Math.random() * (max - min) + min;
  }

  draw() {
    const centerOffset =
      this.maxSizeInteger * 0.5 -
      this.size * 0.5;

    this.ctx.fillStyle = this.color;

    this.ctx.fillRect(
      this.x + centerOffset,
      this.y + centerOffset,
      this.size,
      this.size
    );
  }

  appear() {
    this.isIdle = false;

    if (this.counter <= this.delay) {
      this.counter += this.counterStep;
      return;
    }

    if (this.size >= this.maxSize) {
      this.isShimmer = true;
    }

    if (this.isShimmer) {
      this.shimmer();
    } else {
      this.size += this.sizeStep;
    }

    this.draw();
  }

  disappear() {
    this.isShimmer = false;
    this.counter = 0;

    if (this.size <= 0) {
      this.isIdle = true;
      return;
    }

    this.size -= 0.1;
    this.draw();
  }

  shimmer() {
    if (this.size >= this.maxSize) {
      this.isReverse = true;
    } else if (this.size <= this.minSize) {
      this.isReverse = false;
    }

    if (this.isReverse) {
      this.size -= this.speed;
    } else {
      this.size += this.speed;
    }
  }
}

function getEffectiveSpeed(value, reducedMotion) {
  const min = 0;
  const max = 100;
  const throttle = 0.001;

  const parsed = parseInt(value, 10);

  if (parsed <= min || reducedMotion) {
    return min;
  }

  if (parsed >= max) {
    return max * throttle;
  }

  return parsed * throttle;
}

const VARIANTS = {
  default: {
    gap: 6,
    speed: 35,
    colors: '#f8fafc,#f1f5f9,#cbd5e1',
    noFocus: false,
  },

  blue: {
    gap: 9,
    speed: 24,
    colors: '#1e40af,#3b82f6,#60a5fa,#93c5fd,#ffffff',
    noFocus: false,
  },

  yellow: {
    gap: 5,
    speed: 20,
    colors: '#fef08a,#fde047,#eab308',
    noFocus: false,
  },

  pink: {
    gap: 7,
    speed: 80,
    colors: '#fecdd3,#fda4af,#e11d48',
    noFocus: true,
  },
};

export default function PixelCard({
  variant = 'default',
  gap,
  speed,
  colors,
  noFocus,
  className = '',
  children,
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const pixelsRef = useRef([]);
  const animationRef = useRef(null);
  const timePreviousRef = useRef(performance.now());

  const reducedMotion = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches
  ).current;

  const variantCfg =
    VARIANTS[variant] || VARIANTS.default;

  const finalGap = gap ?? variantCfg.gap;
  const finalSpeed = speed ?? variantCfg.speed;
  const finalColors =
    colors ?? variantCfg.colors;
  const finalNoFocus =
    noFocus ?? variantCfg.noFocus;

  const initPixels = () => {
    if (
      !containerRef.current ||
      !canvasRef.current
    ) {
      return;
    }

    const rect =
      containerRef.current.getBoundingClientRect();

    const width = Math.floor(rect.width);
    const height = Math.floor(rect.height);

    if (width <= 0 || height <= 0) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    canvas.width = width;
    canvas.height = height;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const colorsArray = finalColors
      .split(',')
      .map((color) => color.trim())
      .filter(Boolean);

    const pixelGap = Math.max(
      1,
      parseInt(finalGap, 10)
    );

    const effectiveSpeed =
      getEffectiveSpeed(
        finalSpeed,
        reducedMotion
      );

    const pixels = [];

    for (
      let x = 0;
      x < width;
      x += pixelGap
    ) {
      for (
        let y = 0;
        y < height;
        y += pixelGap
      ) {
        const color =
          colorsArray[
            Math.floor(
              Math.random() *
                colorsArray.length
            )
          ];

        const dx = x - width / 2;
        const dy = y - height / 2;

        const distance = Math.sqrt(
          dx * dx + dy * dy
        );

        const delay = reducedMotion
          ? 0
          : distance;

        pixels.push(
          new Pixel(
            canvas,
            ctx,
            x,
            y,
            color,
            effectiveSpeed,
            delay
          )
        );
      }
    }

    pixelsRef.current = pixels;
  };

  const doAnimate = (fnName) => {
    animationRef.current =
      requestAnimationFrame(() =>
        doAnimate(fnName)
      );

    const timeNow = performance.now();

    const timePassed =
      timeNow -
      timePreviousRef.current;

    const timeInterval = 1000 / 60;

    if (timePassed < timeInterval) {
      return;
    }

    timePreviousRef.current =
      timeNow -
      (timePassed % timeInterval);

    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    let allIdle = true;

    for (
      let i = 0;
      i < pixelsRef.current.length;
      i++
    ) {
      const pixel =
        pixelsRef.current[i];

      pixel[fnName]();

      if (!pixel.isIdle) {
        allIdle = false;
      }
    }

    if (allIdle) {
      cancelAnimationFrame(
        animationRef.current
      );

      animationRef.current = null;
    }
  };

  const handleAnimation = (name) => {
    cancelAnimationFrame(
      animationRef.current
    );

    animationRef.current = null;

    timePreviousRef.current =
      performance.now();

    animationRef.current =
      requestAnimationFrame(() =>
        doAnimate(name)
      );
  };

  const onMouseEnter = () => {
    handleAnimation('appear');
  };

  const onMouseLeave = () => {
    handleAnimation('disappear');
  };

  const onFocus = (event) => {
    if (
      event.currentTarget.contains(
        event.relatedTarget
      )
    ) {
      return;
    }

    handleAnimation('appear');
  };

  const onBlur = (event) => {
    if (
      event.currentTarget.contains(
        event.relatedTarget
      )
    ) {
      return;
    }

    handleAnimation('disappear');
  };

  useEffect(() => {
    initPixels();

    if (
      typeof ResizeObserver ===
      'undefined'
    ) {
      return undefined;
    }

    const observer =
      new ResizeObserver(() => {
        cancelAnimationFrame(
          animationRef.current
        );

        animationRef.current = null;

        initPixels();
      });

    if (containerRef.current) {
      observer.observe(
        containerRef.current
      );
    }

    return () => {
      observer.disconnect();

      cancelAnimationFrame(
        animationRef.current
      );

      animationRef.current = null;
    };
  }, [
    finalGap,
    finalSpeed,
    finalColors,
    finalNoFocus,
  ]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={
        finalNoFocus
          ? undefined
          : onFocus
      }
      onBlur={
        finalNoFocus
          ? undefined
          : onBlur
      }
      tabIndex={
        finalNoFocus
          ? -1
          : 0
      }
      style={{
        position: 'relative',
        isolation: 'isolate',
      }}
    >
      {/* Atmospheric blue glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background:
            'radial-gradient(circle at 76% 50%, rgba(37, 99, 235, 0.20) 0%, rgba(30, 64, 175, 0.08) 30%, transparent 62%)',
        }}
      />

      {/* Secondary subtle glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background:
            'radial-gradient(circle at 25% 100%, rgba(30, 64, 175, 0.10), transparent 42%)',
        }}
      />

      {/* Pixel animation */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 0.28,
          mixBlendMode: 'screen',
        }}
      />

      {/* Content */}
      <div
        className="relative w-full h-full"
        style={{
          position: 'relative',
          zIndex: 10,
        }}
      >
        {children}
      </div>
    </div>
  );
}