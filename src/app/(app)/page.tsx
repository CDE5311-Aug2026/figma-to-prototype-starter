import Link from "next/link";
import { addSampleTasksAction } from "@/actions/tasks";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { taskStatusLabels, taskStatusTones } from "@/lib/schemas";
import { formatDate } from "@/lib/utils";
import { requireUser } from "@/server/auth";
import { listTasks } from "@/server/tasks";

// Default screen. Replace this with your Figma design (see AGENTS.md).
export default async function DashboardPage() {
  const user = await requireUser();
  const tasks = await listTasks(user);

  const counts = {
    total: tasks.length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    done: tasks.filter((t) => t.status === "done").length,
  };
  const stats = [
    { label: "Total tasks", value: counts.total },
    { label: "In progress", value: counts.inProgress },
    { label: "Done", value: counts.done },
  ];
  const name = user.email.split("@")[0] ?? "there";

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-foreground md:text-3xl">Welcome back, {name}</h1>
        <p className="text-base text-muted">Here is what is happening in your workspace.</p>
      </header>

      {user.isDemo ? (
        <Alert tone="warning">
          <strong className="font-semibold">Demo mode.</strong> Supabase is not connected, so there
          is no login and data resets when the server restarts. See the README, section
          &quot;Connect Supabase&quot;, for real accounts and saved data.
        </Alert>
      ) : null}

      <section aria-label="Summary" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="flex flex-col gap-1">
            <CardDescription>{stat.label}</CardDescription>
            <p className="text-3xl font-semibold text-foreground">{stat.value}</p>
          </Card>
        ))}
      </section>

      <section aria-labelledby="recent" className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <h2 id="recent" className="text-xl font-semibold text-foreground">
            Recent tasks
          </h2>
          <Link href="/tasks" className="text-sm font-medium text-primary hover:text-primary-hover">
            View all
          </Link>
        </div>

        {tasks.length === 0 ? (
          <Card className="flex flex-col items-start gap-4">
            <div className="flex flex-col gap-1">
              <CardTitle>No tasks yet</CardTitle>
              <CardDescription>
                Add your first task, or load a few samples to see how the app looks with data.
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/tasks"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-base font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                Add a task
              </Link>
              <form action={addSampleTasksAction}>
                <Button type="submit" variant="secondary">
                  Add sample tasks
                </Button>
              </form>
            </div>
          </Card>
        ) : (
          <ul className="flex flex-col gap-3">
            {tasks.slice(0, 5).map((task) => (
              <li key={task.id}>
                <Card className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 flex-col gap-1">
                    <p className="truncate text-base font-medium text-foreground">{task.title}</p>
                    <p className="text-sm text-muted">Added {formatDate(task.createdAt)}</p>
                  </div>
                  <Badge tone={taskStatusTones[task.status]}>{taskStatusLabels[task.status]}</Badge>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
