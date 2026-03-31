import { motion } from 'framer-motion'
import { memo } from 'react'

// ============================================================
// OQUVCHI  : QUDRAT
// BRANCH   : feature/qudrat-loading
// FAYL     : src/components/loading/PageLoader.jsx
// ============================================================

const PageLoader = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-base-100/80 backdrop-blur-sm"
    >
      <div className="relative flex items-center justify-center">
        {/* Outer Pulsing Ring */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-24 h-24 rounded-full border border-indigo-500/30"
        />
        
        {/* DaisyUI Spinner */}
        <span className="loading loading-spinner loading-lg text-indigo-500 scale-125"></span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 flex flex-col items-center gap-1"
      >
        <h3 className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
          Aidevix
        </h3>
        <p className="text-xs text-base-content/40 uppercase tracking-widest font-medium">
          Loading Page...
        </p>
      </motion.div>
    </motion.div>
  )
}

export default memo(PageLoader)
