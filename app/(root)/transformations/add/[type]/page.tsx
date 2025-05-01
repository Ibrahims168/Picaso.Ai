import Header from '@/components/shared/Header'
import TransformationForm from '@/components/shared/transformationForm';
import { transformationTypes } from '@/constants'
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';


export default async function AddTransformationTypePage({
  params,
}: {
  params: { type: TransformationTypeKey };
}) {
  const authResult = await auth();
  const userId = authResult?.userId;

  if (!userId) redirect('/sign-in');

  const transformation = transformationTypes[params.type];
  if (!transformation) redirect('/404'); // optional, in case of bad route

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
