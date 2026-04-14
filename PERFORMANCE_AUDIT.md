# Aidevix Performance Audit Report

**Date:** 2026-04-10
**Status:** Completed
**Focus:** Frontend (Next.js, React, CSS, Assets)

---

## 🚀 Overview

The Aidevix platform is built with a modern stack featuring Next.js 14, Three.js, and GSAP. While the visual aesthetic is premium, certain implementation patterns impact both actual and perceived performance.

## 🚩 Critical Performance Issues

### 1. CSS Wildcard Transitions (Impact: HIGH 🔴)
**File:** `frontend/src/styles/globals.css:47-49`
```css
*, *::before, *::after {
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.2s ease;
}
```
- **Issue:** This applies transitions to *every* element in the DOM.
- **Impact:** Causes significant **Layout Thrashing** and high **Recalculate Style** costs. During scrolling or theme switching, the browser has to track and animate thousands of elements, leading to "jank" (dropped frames).
- **Recommendation:** Remove the wildcard transition and apply it only to specific components or classes that need it (e.g., `.theme-transition`).

### 2. Artificial Loading Delay (Impact: MEDIUM 🟡)
**File:** `frontend/src/components/home/HomeClient.tsx:39-41`
```javascript
const timer = setTimeout(() => {
  setIsReady(true);
}, 1500);
```
- **Issue:** A hardcoded 1.5s delay is forced to show skeletons.
- **Impact:** Increases **Time to Interactive (TTI)** and frustrates users who have high-speed connections where data is ready much faster.
- **Recommendation:** Reduce this delay to 300-500ms or remove it altogether to allow the UI to appear as soon as data is ready.

### 3. GSAP Animation Overhead (Impact: LOW-MEDIUM 🟡)
**Component:** `CourseCard.tsx` / `HomeClient.tsx`
- **Issue:** GSAP animations like `fromTo` are triggered on every mount/render in loops.
- **Impact:** Minor main-thread blocking during initial page load.
- **Recommendation:** Use `gsap.context()` for clean-up and ensure animations only run when necessary. Consider using `framer-motion` for simple entry animations as it handles orchestration more natively in React.

## 💎 Optimization Strengths (Built-in)

- **Standard Next/Image Usage:** `CourseCard` uses `next/image` with proper `fill` and `sizes` attributes.
- **Dynamic Imports:** `ThreeHero` is dynamically imported with `ssr: false`, preventing hydration mismatch and reducing initial bundle size.
- **Parallel Fetching:** `app/page.tsx` immersed uses `Promise.all` for parallel server-side fetching.
- **Font Optimization:** Google Fonts are self-hosted via `next/font`.

## 📈 Performance Metrics Analysis (Estimated)

| Metric | Rating | Notes |
| :--- | :--- | :--- |
| **LCP (Largest Contentful Paint)** | 🟢 Good | Usually the Hero title or image, optimized via SSR. |
| **FID (First Input Delay)** | 🟡 Needs Improvement | Impacted by 3D initialization and wildcard transitions. |
| **CLS (Cumulative Layout Shift)** | 🟢 Good | Fixed-aspect ratios for thumbnails prevent shifts. |
| **Bundle Size** | 🔴 High | Three.js + GSAP + Swiper adds ~250kb (gzip) to main thread. |

## 🛠 Recommendations for Improvement

### Phase 1: Quick Wins (High Impact, Low Effort)
1.  **Refactor Global CSS:** Remove the universal transition. Replace with:
    ```css
    .transition-theme {
      transition: background-color 0.3s ease, border-color 0.3s ease, color 0.2s ease;
    }
    ```
2.  **Optimize Skeleton Logic:** Change the `HomeClient` timer from `1500` to `500`.

### Phase 2: Technical Debt (Medium Effort)
1.  **Sound Preloading:** Move frequently used sound scripts to a "preload" state or use a more lightweight audio management library if sound count grows.
2.  **Three.js Optimization:** In `ThreeHero.tsx`, ensure `Canvas` uses `flat` and `powerPreference="high-performance"` if possible.

### Phase 3: Infrastructure (High Effort)
1.  **SVG Optimization:** Use SVGs for complex icons instead of loading large icon font libraries where possible (though `react-icons` is mostly fine if tree-shaken).

---

> [!IMPORTANT]
> The most urgent fix is the **CSS wildcard transition**. Fixing this will immediately result in smoother scrolling and faster theme toggling across the entire site.
