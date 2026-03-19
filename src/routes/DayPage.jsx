import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import { toast } from "sonner";

import { useDay } from "../hooks/useDay";
import { useTask } from "../hooks/useTask";
import { useDragSort } from "../hooks/useDragSort";

import { DayPageSkeleton } from "../components/day/DayPageSkeleton";
import { DayHeader } from "../components/day/DayHeader";
import { TaskSection } from "../components/day/TaskSection";
import { NoteSection } from "../components/day/NoteSection";

import { DaySettingsDialog } from "../components/day/dialogs/DaySettingsDialog";
import { CreateTaskDialog } from "../components/day/dialogs/CreateTaskDialog";
import { TaskSettingsDialog } from "../components/day/dialogs/TaskSettingsDialog";
import { CreateNoteDialog } from "../components/day/dialogs/CreateNoteDialog";
import { NoteSettingsDialog } from "../components/day/dialogs/NoteSettingsDialog";

export function DayPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { getDay, loading, error } = useDay();
  const { updateTask } = useTask();

  const [data, setData] = useState(null);

  const [draggingTask, setDraggingTask] = useState(null);
  const [draggingNote, setDraggingNote] = useState(null);

  const [showDaySettings, setShowDaySettings] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [taskSettings, setTaskSettings] = useState(null);
  const [showCreateNote, setShowCreateNote] = useState(false);
  const [noteSettings, setNoteSettings] = useState(null);

  const taskDrag = useDragSort(data?.tasks ?? [], id, "tasks");
  const noteDrag = useDragSort(data?.notes ?? [], id, "notes");

  useEffect(() => {
    const wrapper = () => {
      if (!id) return;
      setData(null);
      getDay(id)
        .then(setData)
        .catch((e) => console.log(e));
    };
    wrapper();
  }, [id, getDay]);

  // ── Task mutations ───────────────────────────────────────────────────────────
  const addTask = (task) => {
    setData((prev) => ({ ...prev, tasks: [...(prev?.tasks ?? []), task] }));
    taskDrag.addSorted(task);
  };

  const patchTask = (updated) => {
    setData((prev) => ({
      ...prev,
      tasks: (prev?.tasks ?? []).map((t) =>
        String(t.id) === String(updated.id) ? { ...t, ...updated } : t,
      ),
    }));
    taskDrag.patchSorted(updated);
  };

  const removeTask = (taskId) => {
    setData((prev) => ({
      ...prev,
      tasks: (prev?.tasks ?? []).filter((t) => String(t.id) !== String(taskId)),
    }));
    taskDrag.removeSorted(taskId);
  };

  const toggleTask = async (task) => {
    const newStatus = task.status === "finished" ? "pending" : "finished";

    // Optimistic update
    taskDrag.patchSorted({ ...task, status: newStatus });

    // Let UI animation happen before we re-sort finished tasks to bottom
    setTimeout(() => {
      taskDrag.setSorted((prev) =>
        [...prev]
          .map((t) =>
            String(t.id) === String(task.id) ? { ...t, status: newStatus } : t,
          )
          .sort(
            (a, b) =>
              (a.status === "finished" ? 1 : 0) -
              (b.status === "finished" ? 1 : 0),
          ),
      );
    }, 600);

    try {
      const updated = await updateTask(task.id, { status: newStatus });
      taskDrag.patchSorted({ ...task, ...updated });
    } catch {
      taskDrag.patchSorted(task);
      toast.error("Failed to update task.");
    }
  };

  // ── Note mutations ───────────────────────────────────────────────────────────
  const addNote = (note) => {
    setData((prev) => ({ ...prev, notes: [...(prev?.notes ?? []), note] }));
    noteDrag.addSorted(note);
  };

  const patchNote = (updated) => {
    setData((prev) => ({
      ...prev,
      notes: (prev?.notes ?? []).map((n) =>
        String(n.id) === String(updated.id) ? { ...n, ...updated } : n,
      ),
    }));
    noteDrag.patchSorted(updated);
  };

  const removeNote = (noteId) => {
    setData((prev) => ({
      ...prev,
      notes: (prev?.notes ?? []).filter((n) => String(n.id) !== String(noteId)),
    }));
    noteDrag.removeSorted(noteId);
  };

  if (loading) return <DayPageSkeleton />;
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
        <CalendarDays size={32} strokeWidth={1.25} />
        <p className="text-sm">{error}</p>
      </div>
    );
  }
  if (!data) return <DayPageSkeleton />;

  const tasks = taskDrag.sorted;
  const notes = noteDrag.sorted;

  return (
    <>
      <div className="flex flex-col h-full overflow-hidden">
        <DayHeader
          data={data}
          tasks={tasks}
          onOpenSettings={() => setShowDaySettings(true)}
        />

        <div className="flex flex-col md:flex-row flex-1 md:divide-x divide-border overflow-hidden">
          <TaskSection
            tasks={tasks}
            draggingId={draggingTask}
            dragHandlers={taskDrag}
            onSetDragging={setDraggingTask}
            onToggle={toggleTask}
            onOpenSettings={setTaskSettings}
            onOpenCreate={() => setShowCreateTask(true)}
          />

          <NoteSection
            notes={notes}
            draggingId={draggingNote}
            dragHandlers={noteDrag}
            onSetDragging={setDraggingNote}
            onOpenSettings={setNoteSettings}
            onOpenCreate={() => setShowCreateNote(true)}
          />
        </div>
      </div>

      {showCreateTask && (
        <CreateTaskDialog
          dayId={data.id}
          onClose={() => setShowCreateTask(false)}
          onCreated={addTask}
        />
      )}
      {taskSettings && (
        <TaskSettingsDialog
          task={taskSettings}
          onClose={() => setTaskSettings(null)}
          onUpdated={patchTask}
          onDeleted={removeTask}
        />
      )}
      {showCreateNote && (
        <CreateNoteDialog
          dayId={data.id}
          onClose={() => setShowCreateNote(false)}
          onCreated={addNote}
        />
      )}
      {noteSettings && (
        <NoteSettingsDialog
          note={noteSettings}
          onClose={() => setNoteSettings(null)}
          onUpdated={patchNote}
          onDeleted={removeNote}
        />
      )}
      {showDaySettings && (
        <DaySettingsDialog
          data={data}
          onClose={() => setShowDaySettings(false)}
          onUpdated={(updated) => setData((prev) => ({ ...prev, ...updated }))}
          onDeleted={() => navigate("/")}
        />
      )}
    </>
  );
}
