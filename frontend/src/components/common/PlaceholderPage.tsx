'use client';
import { motion } from 'framer-motion';

const PlaceholderPage = ({ title, description }: { title: string, description: string }) => (
  <div className="min-h-[70vh] flex items-center justify-center px-4">
    <div className="max-w-2xl w-full text-center">
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl font-black mb-6"
      >{title}</motion.h1>
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-lg text-base-content/60"
      >{description}</motion.p>
    </div>
  </div>
);

export default PlaceholderPage;
