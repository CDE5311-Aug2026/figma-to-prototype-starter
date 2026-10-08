"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sampleTasks } from "@/data/mock";
import { createTaskSchema, taskStatusSchema } from "@/lib/schemas";
import { requireUser } from "@/server/auth";
import { createTask, deleteTask, updateTaskStatus } from "@/server/tasks";

// Server actions: called by forms in the UI. Validate input, call the service, refresh the pages.
// Keep logic in src/server/, not here.

function refresh() {
  revalidatePath("/");
  revalidatePath("/tasks");
}

export async function addTaskAction(formData: FormData) {
  const user = await requireUser();
  const parsed = createTaskSchema.safeParse({
    title: formData.get("title") ?? "",
    notes: formData.get("notes") ?? "",
  });

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Please check the form";
    redirect(`/tasks?error=${encodeURIComponent(message)}`);
  }

  await createTask(user, parsed.data);
  refresh();
  redirect("/tasks");
}

export async function setTaskStatusAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const status = taskStatusSchema.safeParse(formData.get("status"));
  if (!id || !status.success) return;

  await updateTaskStatus(user, id, status.data);
  refresh();
}

export async function deleteTaskAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await deleteTask(user, id);
  refresh();
}

export async function addSampleTasksAction() {
  const user = await requireUser();
  for (const task of [...sampleTasks].reverse()) {
    await createTask(user, task);
  }
  refresh();
}
