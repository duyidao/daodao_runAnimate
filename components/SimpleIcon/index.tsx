// components/SimpleIcon.tsx
import React from 'react';
import { Icon } from '@iconify/react';

interface SimpleIconProps {
  icon: string; // simple-icons 图标对象
  size?: number | string;
  color?: string;
}

const SimpleIcon: React.FC<SimpleIconProps> = ({ 
  icon,
  size = 24,
  color = '#fff',
}) => {
  return (
    <Icon icon={`simple-icons:${icon}`} color={color} width={size} height={size} />
  );
};

export default SimpleIcon;