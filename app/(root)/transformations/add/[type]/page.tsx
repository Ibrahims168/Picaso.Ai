import Header from '@/components/shared/Header';
import TransformationForm from '@/components/shared/transformationForm';
import { transformationTypes } from '@/constants';
import { getUserById } from '@/lib/actions/user.actions';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';



type TransformationTypeKey = keyof typeof transformationTypes;

const AddTransformationTypePage = async ({ params }: { params: { type: string } }) => {
  const { userId } = await auth();
  console.log("USER ID: " + userId); // Log userId to check if it's correct

  if (!userId) {
    console.error("User ID is missing or invalid.");
    redirect('/sign-in');
  }

  try {
    const user = await getUserById(userId);

    if (!user) {
      // If user is not found, log a helpful error message
      console.error(`User with ID ${userId} not found.`);
      return <div>User not found. Please check your login or register.</div>;
    }

    // Check transformation type and proceed as usual
    const transformationTypeKey = params.type as TransformationTypeKey;

    if (!(transformationTypeKey in transformationTypes)) {
      return <div>Error: Invalid transformation type.</div>;
    }

    const transformation = transformationTypes[transformationTypeKey];

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
            type={transformationTypeKey}
            creditBalance={user.creditBalance}
          />
        </section>
      </>
    );
  } catch (error) {
    console.error(error);
    return <div>Error: Unable to load transformation page. Please try again later.</div>;
  }
};


export default AddTransformationTypePage;
