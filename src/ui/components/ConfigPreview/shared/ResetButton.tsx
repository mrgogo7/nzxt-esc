import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface ResetButtonProps {
  onClick: () => void;
  tooltipId?: string;
  tooltipContent?: string;
  className?: string;
}

/**
 * Reusable reset button component with consistent styling and animations.
 */
export default function ResetButton({
  onClick,
  tooltipId = 'reset-tooltip',
  tooltipContent,
  className = 'reset-icon',
}: ResetButtonProps) {
  return (
    <motion.button
      className={className}
      data-tooltip-id={tooltipId}
      data-tooltip-content={tooltipContent}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <RefreshCw size={14} />
    </motion.button>
  );
}

