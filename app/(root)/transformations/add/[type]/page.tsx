import Header from '@/components/shared/Header'
import TransformationForm from '@/components/shared/transformationForm';
import { transformationTypes } from '@/constants'
// import { getUserById } from '@/lib/actions/user.actions';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const AddTransformationTypePage = async ({
  params,
}: {
  params: { type: TransformationTypeKey };
}) => {
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
