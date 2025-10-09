import { getCompanion } from "@/lib/actions/companion.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getSubjectColor } from "@/lib/utils";
import Image from "next/image";
import CompanionComponent from "@/components/CompanionComponents";

interface CompanionSessionPageProps {
  params: Promise<{ id: string }>;
}

const CompanionSession = async ({ params }: CompanionSessionPageProps) => {
  const { id } = await params;
  const user = await currentUser();

 
  const effectiveUser = user || {
    firstName: "", 
    username: "User", 
    imageUrl: "/images/avatar.png", //
  };

  try {
    const companion = await getCompanion(id);
    const { name, subject, title, topic, duration } = companion;

    // Debug: Log user info to see what we're getting
    console.log("User info:", {
      firstName: effectiveUser?.firstName,
      username: effectiveUser?.username,
      imageUrl: effectiveUser?.imageUrl,
      hasImage: !!effectiveUser?.imageUrl,
      isFallback: !user,
    });

    return (
      <main>
        <article className="flex rounded-border justify-between p-6 max-md:flex-col">
          <div className="flex items-center gap-2">
            <div
              className="size-[72px] flex items-center justify-center rounded-lg max-md:hidden"
              style={{ backgroundColor: getSubjectColor(subject) }}
            >
              <Image
                src={`/icons/${subject}.svg`}
                alt={subject}
                width={35}
                height={35}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <p className="font-bold text-2xl">{name}</p>
                <div className="subject-badge max-sm:hidden">{subject}</div>
              </div>
              <p className="text-lg">{topic}</p>
            </div>
          </div>
          <div className="items-start text-2xl max-md:hidden">
            {duration} minutes
          </div>
        </article>

        <CompanionComponent
          {...companion}
          companionId={id}
          userName={
            effectiveUser?.firstName || effectiveUser?.username || "User"
          }
          userImage={effectiveUser?.imageUrl || null}
        />
      </main>
    );
  } catch (error) {
    console.error("Error loading companion:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return (
      <main className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Companion
          </h1>
          <p className="text-gray-600 mb-2">
            The companion you're looking for could not be found.
          </p>
          <p className="text-sm text-gray-500 mb-4">{errorMessage}</p>
          <a href="/companions" className="text-primary hover:underline">
            ← Back to Companions
          </a>
        </div>
      </main>
    );
  }
};

export default CompanionSession;
