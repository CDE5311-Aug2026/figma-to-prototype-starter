import type { CreateTaskInput } from "@/lib/schemas";

// Sample tasks. Used to seed demo mode and by the "Add sample tasks" button.
export const sampleTasks: (CreateTaskInput & { status: "todo" | "in-progress" | "done" })[] = [
  {
    title: "Import the Figma design",
    notes: "Pull the frame with the Figma MCP and map it to tokens.",
    status: "done",
  },
  {
    title: "Build the first screen",
    notes: "Compose the page from components in src/components/ui.",
    status: "in-progress",
  },
  {
    title: "Deploy to Vercel",
    notes: "Push to GitHub and share the preview link.",
    status: "todo",
  },
];
