import React from 'react';
import { QueryProvider } from './query-provider';
import { Toaster } from 'react-hot-toast';

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <QueryProvider>
        {children}
        <Toaster />
      </QueryProvider>
    </>
  );
};

export default Provider;
