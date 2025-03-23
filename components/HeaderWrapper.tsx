import Header from "./Header";
import { getUserCredits } from "@/app/actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const HeaderWrapper = async () => {
  const session = await getServerSession(authOptions);

  let credits = 0;
  if (session?.user?.email) {
    credits = await getUserCredits(session.user.email);
  }

  return <Header credits={credits} />;
};

export default HeaderWrapper;
