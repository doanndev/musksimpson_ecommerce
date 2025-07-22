'use client';

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import React from 'react';
const CreateEditProductForm = dynamic(() => import('../../components/CreateEditProductForm'), {
  ssr: false,
});

const EditProductPage = () => {
  const { id } = useParams();

  return (
    <div>
      <CreateEditProductForm productId={id as string} />
    </div>
  );
};

export default EditProductPage;
