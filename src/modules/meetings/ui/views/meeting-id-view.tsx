'use client';

import { FC, useState } from 'react';

import { useRouter } from 'next/navigation';

import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { useConfirm } from '@/hooks/use-confirm';
import { ActiveState } from '@/modules/meetings/ui/components/active-state';
import { CancelledState } from '@/modules/meetings/ui/components/cancelled-state';
import { CompletedState } from '@/modules/meetings/ui/components/completed-state';
import { MeetingIdViewHeader } from '@/modules/meetings/ui/components/meeting-id-view-header';
import { ProcessingState } from '@/modules/meetings/ui/components/processing-state';
import { UpcomingState } from '@/modules/meetings/ui/components/upcoming-state';
import { UpdateMeetingDialog } from '@/modules/meetings/ui/components/update-meeting-dialog';
import { useTRPC } from '@/trpc/client';

interface Props {
  meetingId: string;
}

export const MeetingIdView: FC<Props> = ({ meetingId }) => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [updateMeetingDialogOpen, setUpdateMeetingDialogOpen] = useState(false);

  const [RemoveConfirmation, confirmRemove] = useConfirm(
    'Are you sure?',
    'The following action will remove this meeting'
  );

  const { data } = useSuspenseQuery(trpc.meetings.getOne.queryOptions({ id: meetingId }));

  const removeMeeting = useMutation(
    trpc.meetings.remove.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));

        await queryClient.invalidateQueries(trpc.premium.getFreeUsage.queryOptions());

        router.push('/meetings');
      },
    })
  );

  const handleRemoveMeeting = async () => {
    const ok = await confirmRemove();

    if (!ok) return;

    await removeMeeting.mutateAsync({ id: meetingId });
  };

  const isActive = data.status === 'active';
  const isUpcoming = data.status === 'upcoming';
  const isCancelled = data.status === 'cancelled';
  const isCompleted = data.status === 'completed';
  const isProcessing = data.status === 'processing';

  return (
    <>
      <RemoveConfirmation />
      <UpdateMeetingDialog
        open={updateMeetingDialogOpen}
        onOpenChange={setUpdateMeetingDialogOpen}
        initialValues={data}
      />
      <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <MeetingIdViewHeader
          meetingId={meetingId}
          meetingName={data.name}
          onEdit={() => setUpdateMeetingDialogOpen(true)}
          onRemove={handleRemoveMeeting}
        />
        {isCancelled && <CancelledState />}
        {isProcessing && <ProcessingState />}
        {isCompleted && <CompletedState data={data} />}
        {isUpcoming && <UpcomingState meetingId={meetingId} />}
        {isActive && <ActiveState meetingId={meetingId} />}
      </div>
    </>
  );
};

export const MeetingIdViewLoading = () => {
  return <LoadingState title="Loading Meeting" description="This may take a few seconds" />;
};

export const MeetingIdViewError = () => {
  return <ErrorState title="Error Loading Meeting" description="Something went wrong" />;
};
