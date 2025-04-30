import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Header from '@/components/shared/Header';
import TransformationForm from '@/components/shared/transformationForm';
import { transformationTypes } from '@/constants';
import { getUserById } from '@/lib/actions/user.actions';

type SearchParamProps  = {
  params: {
    type: TransformationTypeKey;
  };
};

const AddTransformationTypePage = async ({ params }: SearchParamProps ) => {
  const { userId } = await auth();

  const transformation = transformationTypes[params.type];

  if (!userId) redirect('/sign-in');

  const user = await getUserById(userId);
  if (!user) {
    console.error('User not found for ID:', userId);
    redirect('/sign-up');
  }

  return (
    <>
      <Header
        title={transformation.title}
        subtitle={transformation.subTitle}
      />

      <section className="mt-10">
        <TransformationForm
          action="Add"
          userId={user._id}
          type={transformation.type as TransformationTypeKey}
          creditBalance={user.creditBalance}
        />
      </section>
    </>
  );
};

export default AddTransformationTypePage;
