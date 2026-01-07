import React from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SkillBadgeProps {
  skill: string;
  matched?: boolean;
  showIcon?: boolean;
  className?: string;
}

const SkillBadge: React.FC<SkillBadgeProps> = ({
  skill,
  matched,
  showIcon = true,
  className,
}) => {
  return (
    <span
      className={cn(
        'skill-badge',
        matched === true && 'skill-badge-matched',
        matched === false && 'skill-badge-missing',
        matched === undefined && 'skill-badge-neutral',
        className
      )}
    >
      {showIcon && matched !== undefined && (
        matched ? (
          <Check className="w-3.5 h-3.5 mr-1.5" />
        ) : (
          <X className="w-3.5 h-3.5 mr-1.5" />
        )
      )}
      {skill}
    </span>
  );
};

export default SkillBadge;
