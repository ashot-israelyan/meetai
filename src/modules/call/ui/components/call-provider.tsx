'use client';

import { FC } from 'react';

import { LoaderIcon } from 'lucide-react';

import { authClient } from '@/lib/auth-client';
import { generateAvatarUri } from '@/lib/avatar';
import { CallConnect } from '@/modules/call/ui/components/call-connect';

interface Props {
  meetingId: string;
  meetingName: string;
}

export const CallProvider: FC<Props> = ({ meetingId, meetingName }) => {
  const { data, isPending } = authClient.useSession();

  if (!data || isPending) {
    return (
      <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar">
        <LoaderIcon className="size-6 animate-spin text-white " />
      </div>
    );
  }

  return (
    <CallConnect
      meetingId={meetingId}
      meetingName={meetingName}
      userId={data.user.id}
      userName={data.user.name}
      userImage={
        data.user.image ?? generateAvatarUri({ seed: data.user.name, variant: 'initials' })
      }
    />
  );
};
