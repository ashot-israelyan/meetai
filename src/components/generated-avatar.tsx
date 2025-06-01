import { botttsNeutral, initials } from '@dicebear/collection';
import { createAvatar, Result } from '@dicebear/core';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface GeneratedAvatarProps {
  seed: string;
  variant?: 'botttsNeutral' | 'initials';
  className?: string;
}

export const GeneratedAvatar = ({ seed, variant, className }: GeneratedAvatarProps) => {
  let avatar: Result;

  if (variant === 'botttsNeutral') {
    avatar = createAvatar(botttsNeutral, { seed });
  } else {
    avatar = createAvatar(initials, { seed, fontWeight: 500, fontSize: 42 });
  }

  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={avatar.toDataUri()} alt="avatar" />
      <AvatarFallback>{seed.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
};
