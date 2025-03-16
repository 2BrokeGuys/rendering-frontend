import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Profile | RenderBro",
  description: "Your Profile on RenderBro",
};

function page() {
  return (
    <div className="min-h-screen flex justify-center items-center">Profile</div>
  );
}

export default page;
