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

export default function DynamicSVG({ src, className = '', alt = '' }: DynamicSVGProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>(() => {
    // Proactively initialize from cache on mount/render if available
    if (src && svgCache.has(src)) {
      const cachedContent = svgCache.get(src)!;
      return alt ? cachedContent.replace('<svg ', `<svg aria-label="${alt}" role="img" `) : cachedContent;
    }
    return '';
  });

  useEffect(() => {
    if (!src) return;

    // Use cached content if it exists
    if (svgCache.has(src)) {
      const cachedContent = svgCache.get(src)!;
      setSvgContent(alt ? cachedContent.replace('<svg ', `<svg aria-label="${alt}" role="img" `) : cachedContent);
      return;
    }

    const processSvg = (rawText: string) => {
      const svgStart = rawText.indexOf('<svg');
      if (svgStart !== -1) {
        const svgOnly = rawText.substring(svgStart);
        svgCache.set(src, svgOnly);
        
        setSvgContent(alt ? svgOnly.replace('<svg ', `<svg aria-label="${alt}" role="img" `) : svgOnly);
      } else {
        throw new Error('No SVG element found in response');
      }
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
