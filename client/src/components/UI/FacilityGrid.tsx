import React from 'react';
import { motion } from 'framer-motion';
import FacilityCard from './FacilityCard';
import type { FacilityData } from './FacilityCard';

interface FacilityGridProps {
  facilities: FacilityData[];
}

const FacilityGrid: React.FC<FacilityGridProps> = ({ facilities }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
        {facilities.map((facility, index) => (
          <motion.div
            key={facility.id}
            layout
            initial={{ opacity: 0, rotateX: 20, y: 100 }}
            whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 0.8, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            <FacilityCard facility={facility} />
          </motion.div>
        ))}
    </div>
  );
};

export default FacilityGrid;
