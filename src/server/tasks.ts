import "server-only";
import { z } from "zod";
import { sampleTasks } from "@/data/mock";
import { taskStatusSchema, type CreateTaskInput, type Task, type TaskStatus } from "@/lib/schemas";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { CurrentUser } from "./auth";

// Business logic for tasks. Two storage modes, same functions:
//   - Supabase mode: rows live in the `tasks` table, protected by Row Level Security.
//   - Demo mode (no Supabase keys): an in-memory list that resets when the server restarts.
// Pages, actions and API routes only call these functions, so they never care which mode is on.

const rowSchema = z.object({
  id: z.string(),
  title: z.string(),
  notes: z.string(),
  status: taskStatusSchema,
  created_at: z.string(),
});

function fromRow(row: z.infer<typeof rowSchema>): Task {
  return {
    id: row.id,
    title: row.title,
    notes: row.notes,
    status: row.status,
    createdAt: row.created_at,
  };
}

// ---- demo mode store (survives hot reloads in dev) ----
const globalForDemo = globalThis as unknown as { demoTasks?: Task[] };

function demoStore(): Task[] {
  if (!globalForDemo.demoTasks) {
    const now = Date.now();
    globalForDemo.demoTasks = sampleTasks.map((task, index) => ({
      id: crypto.randomUUID(),
      title: task.title,
      notes: task.notes,
      status: task.status,
      createdAt: new Date(now - index * 3_600_000).toISOString(),
    }));
  }
  return globalForDemo.demoTasks;
}

// ---- public API ----
export async function listTasks(_user: CurrentUser): Promise<Task[]> {
  if (!isSupabaseConfigured()) {
    return [...demoStore()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  const supabase = await createClient();
  // Row Level Security makes sure only the signed-in user's rows come back.
  const { data, error } = await supabase
    .from("tasks")
    .select("id, title, notes, status, created_at")
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Could not load tasks: ${error.message}`);

  return z.array(rowSchema).parse(data).map(fromRow);
}

export async function createTask(
  _user: CurrentUser,
  input: CreateTaskInput & { status?: TaskStatus },
): Promise<Task> {
  const status = input.status ?? "todo";

  if (!isSupabaseConfigured()) {
    const task: Task = {
      id: crypto.randomUUID(),
      title: input.title,
      notes: input.notes,
      status,
      createdAt: new Date().toISOString(),
    };
    demoStore().push(task);
    return task;
  }

  const supabase = await createClient();
  // user_id is filled in by the database (default auth.uid()).
  const { data, error } = await supabase
    .from("tasks")
    .insert({ title: input.title, notes: input.notes, status })
    .select("id, title, notes, status, created_at")
    .single();
  if (error) throw new Error(`Could not create task: ${error.message}`);

  return fromRow(rowSchema.parse(data));
}

export async function updateTaskStatus(
  _user: CurrentUser,
  id: string,
  status: TaskStatus,
): Promise<void> {
  if (!isSupabaseConfigured()) {
    const task = demoStore().find((t) => t.id === id);
    if (task) task.status = status;
    return;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("tasks").update({ status }).eq("id", id);
  if (error) throw new Error(`Could not update task: ${error.message}`);
}

export async function deleteTask(_user: CurrentUser, id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    const store = demoStore();
    const index = store.findIndex((t) => t.id === id);
    if (index >= 0) store.splice(index, 1);
    return;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw new Error(`Could not delete task: ${error.message}`);
}
