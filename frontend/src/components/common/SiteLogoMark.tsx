'use client'

import Image from 'next/image'
import clsx from 'clsx'
import { SITE_LOGO_PATH } from '@/utils/constants'

type SiteLogoMarkProps = {
  size?: number
  className?: string
  imgClassName?: string
  priority?: boolean
}

export default function SiteLogoMark({
  size = 36,
  className,
  imgClassName = 'object-cover',
  priority,
}: SiteLogoMarkProps) {
  return (
    <div
      className={clsx('relative shrink-0 overflow-hidden rounded-2xl bg-indigo-500/10 ring-1 ring-white/10', className)}
      style={{ width: size, height: size }}
    >
      <Image
        src={SITE_LOGO_PATH}
        alt="Aidevix"
        width={size}
        height={size}
        className={imgClassName}
        priority={priority}
        sizes={`${size}px`}
      />
    </div>
  )
}
