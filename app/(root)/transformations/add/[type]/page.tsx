// app/(root)/transformations/add/[type]/page.tsx

import Header from '@/components/shared/Header';
import TransformationForm from '@/components/shared/transformationForm';
import { transformationTypes } from '@/constants';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

type Props = {
  params: {
    type: keyof typeof transformationTypes;
  };
};

// ✅ Do NOT annotate return type at all – let Next.js handle it
const AddTransformationTypePage = async ({ params }: Props) => {
  const { userId } = await auth();
  const transformation = transformationTypes[params.type];

  if (!userId) redirect('/sign-in');

  return (
    <>
      <Header 
        title={transformation.title}
        subtitle={transformation.subTitle}
      />
      <section className="mt-10">
        <TransformationForm 
          action="Add"
          userId={userId}
          type={params.type}
          creditBalance={25}
        />
      </section>
    </>
  );
};

export default AddTransformationTypePage;
