// ============================================================
// OQUVCHI  : DONIYOR
// BRANCH   : feature/doniyor-courses
// FAYL     : src/components/courses/CourseCard.jsx
// ============================================================
//
// VAZIFA: Bitta kurs kartasini (CourseCard) yaratish
//
// KARTA TARKIBI:
//
//  1. THUMBNAIL:
//     - h-44 rasm yoki kurs kategoriyasiga mos emoji
//     - Hover: play tugmasi overlay (opacity: 0 → 1)
//     - Kategoriya badge (chap yuqori burchak):
//       - html: 🟠, css: 🔵, javascript: 🟡, react: ⚛️, nodejs: 🟢
//
//  2. KARTA TANASI (p-4):
//     - Kurs sarlavhasi (line-clamp-2, hover: text-primary-300)
//     - Qisqacha tavsif (line-clamp-2, text-zinc-500)
//     - Statistika: darslar soni + davomiylik (formatDuration())
//     - Rating + narx (flex justify-between)
//       - Rating: yulduzlar + ball + soni
//       - Narx: course.price > 0 ? `$${course.price}` : 'Bepul'
//
//  ANIMATSIYALAR:
//   - Kirish: gsap.fromTo staggered (index * 0.08 kechikish)
//   - Hover: gsap.to y: -6 (ko'tariladi), mouseLeave: y: 0
//
//  PROPS:
//   - course: { _id, title, description, thumbnail, category, price, rating, videos }
//   - index: number (stagger animatsiya uchun)
//   - className: string (optional)
//
//  LINK: Link to={`/courses/${course._id}`}
//
// KERAKLI IMPORTLAR:
//   import { Link } from 'react-router-dom'
//   import { useRef, useEffect } from 'react'
//   import { gsap } from 'gsap'
//   import { IoPlay, IoTime } from 'react-icons/io5'
//   import { ROUTES } from '@utils/constants'
// ============================================================

export default function CourseCard({ course, index = 0, className }) {
  // TODO: DONIYOR bu komponentni to'liq yozadi
  return null
}
