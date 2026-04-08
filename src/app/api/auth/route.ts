import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { password } = await request.json();
  const valid = password === process.env.CONSTRUCTOR_PASSWORD;

  if (!valid) {
    return Response.json({ error: "Password incorrecto" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set("constructor-auth", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 días
    path: "/",
  });

  return Response.json({ ok: true });
}
