import { addTaskAction, deleteTaskAction, setTaskStatusAction } from "@/actions/tasks";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { taskStatusLabels, taskStatusSchema, taskStatusTones } from "@/lib/schemas";
import { formatDate } from "@/lib/utils";
import { requireUser } from "@/server/auth";
import { listTasks } from "@/server/tasks";

type TasksPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const user = await requireUser();
  const [{ error }, tasks] = await Promise.all([searchParams, listTasks(user)]);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-foreground md:text-3xl">Tasks</h1>
        <p className="text-base text-muted">Add, update and remove your tasks.</p>
      </header>

      <Card>
        <form action={addTaskAction} className="flex flex-col gap-4">
          <CardTitle>New task</CardTitle>
          {error ? <Alert tone="danger">{error}</Alert> : null}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Title"
              name="title"
              required
              maxLength={200}
              placeholder="What needs doing?"
            />
            <Input
              label="Notes (optional)"
              name="notes"
              maxLength={1000}
              placeholder="Any details"
            />
          </div>
          <div>
            <Button type="submit">Add task</Button>
          </div>
        </form>
      </Card>

      <section aria-labelledby="all-tasks" className="flex flex-col gap-4">
        <h2 id="all-tasks" className="text-xl font-semibold text-foreground">
          All tasks ({tasks.length})
        </h2>

        {tasks.length === 0 ? (
          <Card>
            <CardTitle>Nothing here yet</CardTitle>
            <CardDescription className="mt-1">
              Use the form above to add your first task.
            </CardDescription>
          </Card>
        ) : (
          <ul className="flex flex-col gap-3">
            {tasks.map((task) => (
              <li key={task.id}>
                <Card className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 flex-col gap-1">
                      <p className="text-base font-medium break-words text-foreground">
                        {task.title}
                      </p>
                      {task.notes ? (
                        <p className="text-sm break-words text-muted">{task.notes}</p>
                      ) : null}
                      <p className="text-xs text-muted">Added {formatDate(task.createdAt)}</p>
                    </div>
                    <Badge tone={taskStatusTones[task.status]}>
                      {taskStatusLabels[task.status]}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {taskStatusSchema.options
                      .filter((status) => status !== task.status)
                      .map((status) => (
                        <form key={status} action={setTaskStatusAction}>
                          <input type="hidden" name="id" value={task.id} />
                          <input type="hidden" name="status" value={status} />
                          <Button type="submit" variant="secondary" size="sm">
                            Mark {taskStatusLabels[status].toLowerCase()}
                          </Button>
                        </form>
                      ))}
                    <form action={deleteTaskAction} className="sm:ml-auto">
                      <input type="hidden" name="id" value={task.id} />
                      <Button type="submit" variant="danger" size="sm">
                        Delete
                      </Button>
                    </form>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
