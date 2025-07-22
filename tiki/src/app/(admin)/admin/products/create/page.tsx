'use client';

import dynamic from 'next/dynamic';
import React from 'react';
const CreateEditProductForm = dynamic(() => import('../components/CreateEditProductForm'), {
  ssr: false,
});

const CreateProductPage = () => {
  return (
    <div>
      <CreateEditProductForm />
    </div>
  );
};

export default CreateProductPage;
