'use client';

import { FC, useState } from 'react';

import { useRouter } from 'next/navigation';

import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { VideoIcon } from 'lucide-react';
import { toast } from 'sonner';

import { ErrorState } from '@/components/error-state';
import { GeneratedAvatar } from '@/components/generated-avatar';
import { LoadingState } from '@/components/loading-state';
import { Badge } from '@/components/ui/badge';
import { useConfirm } from '@/hooks/use-confirm';
import { AgentIdViewHeader } from '@/modules/agents/ui/components/agent-id-view-header';
import { UpdateAgentDialog } from '@/modules/agents/ui/components/update-agent-dialog';
import { useTRPC } from '@/trpc/client';

interface Props {
  agentId: string;
}

export const AgentIdView: FC<Props> = ({ agentId }) => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [updateAgentDialogOpen, updateAgentDialog] = useState(false);

  const { data } = useSuspenseQuery(trpc.agents.getOne.queryOptions({ id: agentId }));

  const removeAgent = useMutation(
    trpc.agents.remove.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));

        await queryClient.invalidateQueries(trpc.premium.getFreeUsage.queryOptions());

        router.push('/agents');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const [RemoveConfirmation, confirmRemove] = useConfirm(
    'Are ypu sure?',
    `The following action will remove ${data.meetingCount} associated meetings`
  );

  const handleRemoveAgent = async () => {
    const ok = await confirmRemove();

    if (!ok) return;

    await removeAgent.mutateAsync({ id: agentId });
  };

  return (
    <>
      <RemoveConfirmation />
      <UpdateAgentDialog
        open={updateAgentDialogOpen}
        onOpenChange={updateAgentDialog}
        initialValues={data}
      />
      <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <AgentIdViewHeader
          agentId={agentId}
          agentName={data.name}
          onEdit={() => updateAgentDialog(true)}
          onRemove={handleRemoveAgent}
        />

        <div className="bg-white rounded-lg border">
          <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
            <div className="flex items-center gap-x-3">
              <GeneratedAvatar seed={data.name} variant="botttsNeutral" className="size-10" />

              <h2 className="text-2xl font-medium">{data.name}</h2>
            </div>

            <Badge variant="outline" className="flex items-center gap-x-2 [&>svg]:size-4">
              <VideoIcon className="text-blue-700" />
              {data.meetingCount} {data.meetingCount === 1 ? 'meeting' : 'meetings'}
            </Badge>
            <div className="flex flex-col gap-y-4">
              <p className="text-lg font-medium">Instructions</p>
              <p className="text-neutral-800">{data.instructions}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const AgentIdViewLoading = () => {
  return <LoadingState title="Loading Agent" description="This may take a few seconds" />;
};

export const AgentIdViewError = () => {
  return <ErrorState title="Error Loading Agent" description="Something went wrong" />;
};
