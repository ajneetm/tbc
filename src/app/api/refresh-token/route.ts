import { refreshToken } from "@/app/libs/api/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await refreshToken(body.refresh);
    const response = await data.json();
    
    if (!data.ok) throw new Error(response.error.message);
    return new Response(JSON.stringify({ ...response }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    
    throw new Error(error instanceof Error ? error.message : "Something went wrong");
  }
}
