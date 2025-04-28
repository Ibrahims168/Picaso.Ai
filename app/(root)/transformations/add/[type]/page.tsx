// page.tsx
import { auth } from "@clerk/nextjs/server";
import { getUserById } from "@/lib/actions/user.actions";
import { transformationTypes } from "@/constants";
import Header from "@/components/shared/Header";
import TransformationForm from "@/components/shared/transformationForm";
import { redirect } from "next/navigation";

interface Props {
  params: {
    type: string;
  };
}

const AddTransformationTypePage = async ({ params }: Props) => {
  const type = params?.type; // no destructuring

  const { userId } = await auth();
  console.log("userId from auth:", userId);

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await getUserById(userId);

  if (!user) {
    console.error("User not found");
    redirect("/profile/create");
  }

  if (!type || !(type in transformationTypes)) {
    console.error("Invalid transformation type:", type);
    redirect("/");
  }

  const transformation = transformationTypes[type as keyof typeof transformationTypes];

  return (
    <>
      <Header title={transformation.title} subtitle={transformation.subTitle} />
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
