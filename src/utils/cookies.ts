import { cookies } from "next/headers";

const deleteCookie = async (name: string) => {
  const cookieStore = await cookies();
  cookieStore.delete(name);
};

const getCookie = async (name: string) => {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value;
};

const setSecureCookie = async (name: string, value: string) => {
  const cookieStore = await cookies();
  cookieStore.set(name, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });
};

const setInsecureCookie = async (name: string, value: string) => {
  const cookieStore = await cookies();
  cookieStore.set(name, value);
};

export { deleteCookie, getCookie, setSecureCookie, setInsecureCookie };
