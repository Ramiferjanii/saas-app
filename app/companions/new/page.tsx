import CompanionsForm from "@/components/CompanionsForm";
import React from "react";

const page = () => {
  return (
    <main className="min-lg:w1/3 min-md:w-2/3 items-center justify-center ">
      <article className="w-full gap-' flex flex-col ">
        <h1>Companions Builder </h1>
        <CompanionsForm />
      </article>
    </main>
  );
};

export default page;
