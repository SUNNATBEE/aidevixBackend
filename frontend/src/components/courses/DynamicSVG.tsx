'use client';

import { useEffect, useState, useRef } from 'react';

interface DynamicSVGProps {
  src: string;
  className?: string;
  alt?: string;
}

// Global cache to store fetched SVG contents to avoid duplicate network calls
const svgCache = new Map<string, string>();
// Track active fetches to deduplicate parallel requests for the same SVG
const pendingFetches = new Map<string, Promise<string>>();

const escapeAttr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// SVG'ni dangerouslySetInnerHTML'dan oldin tozalash — stored XSS himoyasi.
// Browser DOMParser orqali parse qilamiz (regex'dan mustahkam), xavfli element/atributlarni olib tashlaymiz.
function sanitizeSvg(raw: string): string {
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') return '';
  const doc = new DOMParser().parseFromString(raw, 'image/svg+xml');
  if (doc.querySelector('parsererror')) return '';
  const svg = doc.querySelector('svg');
  if (!svg) return '';

  const all: Element[] = [svg, ...Array.from(svg.querySelectorAll('*'))];
  for (const el of all) {
    const tag = el.tagName.toLowerCase();
    // Skript bajaradigan / tashqi kontent yuklaydigan elementlarni butunlay o'chiramiz
    if (tag === 'script' || tag === 'foreignobject' || tag === 'iframe' || tag === 'animate' || tag === 'set' || tag === 'handler') {
      el.remove();
      continue;
    }
    for (const attr of Array.from(el.attributes)) {
      const name = attr.name.toLowerCase();
      const val = attr.value.replace(/\s+/g, '').toLowerCase();
      if (name.startsWith('on')) el.removeAttribute(attr.name); // event handlerlar
      else if ((name === 'href' || name === 'xlink:href' || name === 'src') && val.startsWith('javascript:')) el.removeAttribute(attr.name);
      else if (name === 'style' && (val.includes('javascript:') || val.includes('expression('))) el.removeAttribute(attr.name);
    }
  }
  return new XMLSerializer().serializeToString(svg);
}

function withAria(svg: string, alt: string): string {
  if (!alt) return svg;
  return svg.replace('<svg ', `<svg aria-label="${escapeAttr(alt)}" role="img" `);
}

export default function DynamicSVG({ src, className = '', alt = '' }: DynamicSVGProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>(() => {
    // Proactively initialize from cache on mount/render if available (cache = sanitized)
    if (src && svgCache.has(src)) {
      return withAria(svgCache.get(src)!, alt);
    }
    return '';
  });

  useEffect(() => {
    if (!src) return;

    // Use cached (already sanitized) content if it exists
    if (svgCache.has(src)) {
      setSvgContent(withAria(svgCache.get(src)!, alt));
      return;
    }

    const processSvg = (rawText: string) => {
      const svgStart = rawText.indexOf('<svg');
      if (svgStart === -1) {
        throw new Error('No SVG element found in response');
      }
      const sanitized = sanitizeSvg(rawText.substring(svgStart));
      if (!sanitized) return; // tozalashda yaroqsiz/xavfli — render qilmaymiz
      svgCache.set(src, sanitized);
      setSvgContent(withAria(sanitized, alt));
    };

    // Deduplicate concurrent fetch requests for the same SVG URL
    let fetchPromise = pendingFetches.get(src);
    if (!fetchPromise) {
      fetchPromise = fetch(src)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.text();
        })
        .then((text) => {
          pendingFetches.delete(src);
          return text;
        })
        .catch((err) => {
          pendingFetches.delete(src);
          throw err;
        });
      pendingFetches.set(src, fetchPromise);
    }

    fetchPromise
      .then((data) => {
        processSvg(data);
      })
      .catch((err) => console.error('Error fetching SVG:', src, err));
  }, [src, alt]);

  // Dynamically measure paths and shapes to calculate exact lengths for draw animations
  useEffect(() => {
    if (!svgContent || !containerRef.current) return;

    const measureLengths = () => {
      if (!containerRef.current) return;
      const shapes = containerRef.current.querySelectorAll('path, circle, rect, line, polyline, polygon, ellipse');
      shapes.forEach((shape: any) => {
        try {
          const length = shape.getTotalLength ? shape.getTotalLength() : 1500;
          if (length > 0) {
            shape.style.setProperty('--path-length', `${length}`);
          } else {
            shape.style.setProperty('--path-length', '1500');
          }
        } catch (e) {
          shape.style.setProperty('--path-length', '1500');
        }
      });
    };

    // Run immediately
    measureLengths();

    // Run after 100ms to ensure the browser has computed layouts and resolved display:none states
    const timer = setTimeout(measureLengths, 100);
    return () => clearTimeout(timer);
  }, [svgContent]);

  if (!svgContent) {
    return (
      <div 
        className={`animate-pulse bg-white/5 rounded-full ${className}`} 
        style={{ width: '100%', height: '100%' }}
      />
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`svg-draw-container ${className}`}
      style={{ width: '100%', height: '100%' }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
