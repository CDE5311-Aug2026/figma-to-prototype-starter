import { NextResponse } from "next/server";
import { createTaskSchema } from "@/lib/schemas";
import { getCurrentUser } from "@/server/auth";
import { createTask, listTasks } from "@/server/tasks";

// Thin route: check who is calling, validate input, call the service, return typed JSON.
// (The app's own forms use server actions in src/actions/. This route is for other clients,
// or for a client component that needs to fetch data.)
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  return NextResponse.json(await listTasks(user));
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = createTaskSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  return NextResponse.json(await createTask(user, parsed.data), { status: 201 });
}
