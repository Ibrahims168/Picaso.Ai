import Header from '@/components/shared/Header';
import TransformationForm from '@/components/shared/transformationForm';
import { transformationTypes } from '@/constants';
import { getUserById } from '@/lib/actions/user.actions';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

// Optional: If this page depends on dynamic data
export const dynamic = 'force-dynamic';

// Type for the page props
type PageProps = {
  params: {
    type: 'restore' | 'removeBackground' | 'fill' | 'remove' | 'recolor';
  };
};

const AddTransformationTypePage = async ({ params }: PageProps) => {
  const { type } = params;

  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const transformation = transformationTypes[type];
  const user = await getUserById(userId);

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
