import { auth } from "@clerk/nextjs/server";
import AuthForm from "./AuthForm";

export default async function HomePage() {
  const { getToken } = await auth();

  const token = await getToken();

  console.log("Token:", token);

  // const response = await axios.get("/api/auth/me", {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // });

  return (
    <div>
      <span className="bg-white">Dashboard Base</span>
      <AuthForm />
    </div>
  );
}
