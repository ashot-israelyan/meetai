'use client';

import { useRouter } from 'next/navigation';

import { useSuspenseQuery } from '@tanstack/react-query';

import { DataTable } from '@/components/data-table';
import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { columns } from '@/modules/meetings/ui/components/columns';
import { useTRPC } from '@/trpc/client';

export const MeetingsView = () => {
  const router = useRouter();
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}));

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      <DataTable
        columns={columns}
        data={data.items}
        onRowClick={(row) => router.push(`/meetings/${row.id}`)}
      />
    </div>
  );
};

export const MeetingsViewLoading = () => {
  return <LoadingState title="Loading Meetings" description="This may take a few seconds" />;
};

export const MeetingsViewError = () => {
  return <ErrorState title="Error Loading Meetings" description="Something went wrong" />;
};
