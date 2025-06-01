import { Dispatch, FC, SetStateAction } from 'react';

import { CommandDialog, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DashboardCommand: FC<Props> = ({ open, setOpen }) => {
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Find a meeting or agent" />
      <CommandList>
        <CommandItem>Test</CommandItem>
      </CommandList>
    </CommandDialog>
  );
};
