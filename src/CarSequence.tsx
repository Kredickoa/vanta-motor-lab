import { useEffect, useRef, useState } from 'react';
import type { MotionValue } from 'motion/react';

const FRAME_COUNT = 157;
const CACHE_LIMIT = 12;

export default function CarSequence({ progress }: { progress: MotionValue<number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const cache = new Map<number, HTMLImageElement>();
    const pending = new Set<number>();
    let desired = 0;
    let displayed = 0;
    let request = 0;
    let disposed = false;

    const paint = () => {
      const image = cache.get(desired) ?? cache.get(displayed);
      if (!image) return;
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.round(bounds.width * ratio));
      const height = Math.max(1, Math.round(bounds.height * ratio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;
      const x = (width - drawWidth) / 2;
      const y = (height - drawHeight) / 2;
      context.fillStyle = '#efefef';
      context.fillRect(0, 0, width, height);
      if (x > 0) {
        context.drawImage(image, 0, 0, 1, image.naturalHeight, 0, y, x + 1, drawHeight);
        context.drawImage(image, image.naturalWidth - 1, 0, 1, image.naturalHeight, x + drawWidth - 1, y, x + 1, drawHeight);
      }
      if (y > 0) {
        context.drawImage(image, 0, 0, image.naturalWidth, 1, x, 0, drawWidth, y + 1);
        context.drawImage(image, 0, image.naturalHeight - 1, image.naturalWidth, 1, x, y + drawHeight - 1, drawWidth, y + 1);
      }
      context.drawImage(image, x, y, drawWidth, drawHeight);
      if (cache.has(desired)) displayed = desired;
    };

    const load = (index: number) => {
      if (index < 0 || index >= FRAME_COUNT || cache.has(index) || pending.has(index) || pending.size >= 4) return;
      pending.add(index);
      const image = new Image();
      image.decoding = 'async';
      image.onload = () => {
        pending.delete(index);
        if (disposed) return;
        cache.set(index, image);
        while (cache.size > CACHE_LIMIT) {
          const stale = [...cache.keys()].find(key => key !== desired && key !== displayed);
          if (stale === undefined) break;
          cache.delete(stale);
        }
        if (index === desired) {
          paint();
          setReady(true);
        } else if (!cache.has(desired)) {
          load(desired);
        }
      };
      image.onerror = () => { pending.delete(index); };
      image.src = `./frames/car-${String(index).padStart(3, '0')}.webp`;
    };

    const update = (value: number) => {
      desired = Math.round(Math.max(0, Math.min(1, (value - .15) / .85)) * (FRAME_COUNT - 1));
      if (request) return;
      request = requestAnimationFrame(() => {
        request = 0;
        paint();
        load(desired);
        for (const offset of [1, -1, 2]) load(desired + offset);
      });
    };

    const unsubscribe = progress.on('change', update);
    window.addEventListener('resize', paint);
    update(progress.get());
    return () => {
      disposed = true;
      unsubscribe();
      cancelAnimationFrame(request);
      window.removeEventListener('resize', paint);
      cache.clear();
    };
  }, [progress]);

  return (
    <div className="relative h-full w-full bg-[#efefef]">
      <canvas ref={canvasRef} role="img" aria-label="Scroll-controlled car disassembly animation" className="block h-full w-full" />
      {!ready && <img src="./frames/car-000.webp" alt="" className="absolute inset-0 h-full w-full object-contain" />}
    </div>
  );
}
