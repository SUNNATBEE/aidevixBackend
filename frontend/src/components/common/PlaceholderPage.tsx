'use client';

import { motion } from 'framer-motion';
import { useLang } from '@/context/LangContext';

type KeyProps = { titleKey: string; descriptionKey: string };
type LegacyProps = { title: string; description: string };
export type PlaceholderPageProps = KeyProps | LegacyProps;

function isKeys(p: PlaceholderPageProps): p is KeyProps {
  return 'titleKey' in p;
}

export default function PlaceholderPage(props: PlaceholderPageProps) {
  const { t } = useLang();
  const title = isKeys(props) ? t(props.titleKey) : props.title;
  const description = isKeys(props) ? t(props.descriptionKey) : props.description;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl font-black mb-6"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-base-content/60"
        >
          {description}
        </motion.p>
      </div>
    </div>
  );
}
