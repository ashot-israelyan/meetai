import { FC, PropsWithChildren } from 'react';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';

const Layout: FC<PropsWithChildren> = async ({ children }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!!session) {
    redirect('/');
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">{children}</div>
    </div>
  );
};

export default Layout;
