import { Icon } from '@iconify/react';
import { forwardRef } from 'react';

export interface IconifyProps {
  icon: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const Iconify = forwardRef<SVGSVGElement, IconifyProps>(
  ({ icon, width = 20, height, className, style, onClick, ...other }, ref) => (
    <Icon
      ref={ref}
      icon={icon}
      width={width}
      height={height || width}
      className={className}
      style={style}
      onClick={onClick}
      {...other}
    />
  ),
);

Iconify.displayName = 'Iconify';
