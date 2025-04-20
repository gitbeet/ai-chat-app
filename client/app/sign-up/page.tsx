"use client";

import { SignUpForm } from "@/components/sign-up-form";
import { useUserStore } from "@/store";
import { useRouter } from "next/navigation";
import { type ChangeEvent, FormEvent, useState } from "react";

const Page = () => {
  const [userData, setUserdata] = useState<{ name: string; email: string }>({
    name: "",
    email: "",
  });

  const router = useRouter();
  const { setUser } = useUserStore();

  const handleCreateUser = async (e: FormEvent) => {
    e.preventDefault();
    if (!userData.name || !userData.email) return;
    try {
      const responseJSON = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/register-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      const response = await responseJSON.json();
      setUser(response);
      router.push("/chat");
    } catch (error) {
      alert(`Error ${error}`);
    }
  };

  const handleChangeUserData = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserdata((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <h1 className="text-xl font-bold pt-12 text-center">Sign up</h1>
      <SignUpForm
        name={userData.name}
        email={userData.email}
        handleChangeUserData={handleChangeUserData}
        handleCreateUser={handleCreateUser}
        className="mt-12 max-w-[400px] mx-auto"
      />
    </div>
  );
};

export default Page;
