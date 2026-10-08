import { z } from "zod";

// Shared between the API/actions (validation) and the UI (types).
export const taskStatusSchema = z.enum(["todo", "in-progress", "done"]);

export const taskSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(200),
  notes: z.string(),
  status: taskStatusSchema,
  createdAt: z.string(),
});

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Please enter a title")
    .max(200, "Keep the title under 200 characters"),
  notes: z.string().trim().max(1000, "Keep notes under 1000 characters").default(""),
});

export type Task = z.infer<typeof taskSchema>;
export type TaskStatus = z.infer<typeof taskStatusSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const taskStatusLabels: Record<TaskStatus, string> = {
  todo: "To do",
  "in-progress": "In progress",
  done: "Done",
};

/** Badge colour for each status (see src/components/ui/badge.tsx). */
export const taskStatusTones = {
  todo: "neutral",
  "in-progress": "warning",
  done: "success",
} as const satisfies Record<TaskStatus, "neutral" | "warning" | "success">;
