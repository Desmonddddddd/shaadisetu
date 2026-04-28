"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePersistentState } from "@/hooks/usePersistentState";
import { PrimitiveCheckbox } from "@/components/editorial/PrimitiveCheckbox";
import {
  TIMELINE_BUCKETS,
  DEFAULT_TASKS,
  type Priority,
  type DefaultTask,
} from "@/data/checklistDefaults";

const STORAGE_KEY = "shaadisetu.checklist.v1";

interface UserTask {
  id: string;
  title: string;
  bucket: string;
  priority: Priority;
  custom: boolean;
}

interface TaskState {
  done: boolean;
  dueDate: string | null;
  notes: string;
}

interface ChecklistState {
  tasks: Record<string, TaskState>;
  customTasks: UserTask[];
  hiddenDefaults: string[];
}

const INITIAL: ChecklistState = {
  tasks: {},
  customTasks: [],
  hiddenDefaults: [],
};

type FilterMode = "all" | "open" | "done";
type SortMode = "timeline" | "priority" | "due";

export function ChecklistApp() {
  const [state, setState, hydrated] = usePersistentState<ChecklistState>(
    STORAGE_KEY,
    INITIAL,
  );

  const [filter, setFilter] = useState<FilterMode>("all");
  const [sort, setSort] = useState<SortMode>("timeline");
  const [expandedBucket, setExpandedBucket] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskBucket, setNewTaskBucket] = useState<string>(TIMELINE_BUCKETS[0].id);
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>("medium");
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);

  const allTasks = useMemo(() => {
    const visibleDefaults: UserTask[] = DEFAULT_TASKS
      .filter((t) => !state.hiddenDefaults.includes(t.id))
      .map((t: DefaultTask) => ({
        id: t.id,
        title: t.title,
        bucket: t.bucket,
        priority: t.priority,
        custom: false,
      }));
    return [...visibleDefaults, ...state.customTasks];
  }, [state.hiddenDefaults, state.customTasks]);

  const stateFor = (id: string): TaskState =>
    state.tasks[id] ?? { done: false, dueDate: null, notes: "" };

  const totalCount = allTasks.length;
  const doneCount = allTasks.reduce((sum, t) => sum + (stateFor(t.id).done ? 1 : 0), 0);
  const progress = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const filteredTasks = useMemo(() => {
    return allTasks.filter((t) => {
      const s = stateFor(t.id);
      if (filter === "open" && s.done) return false;
      if (filter === "done" && !s.done) return false;
      return true;
    });
  }, [allTasks, filter, state.tasks]);

  const sortedAndGrouped = useMemo(() => {
    const buckets = new Map<string, UserTask[]>();
    for (const b of TIMELINE_BUCKETS) buckets.set(b.id, []);
    for (const t of filteredTasks) {
      if (!buckets.has(t.bucket)) buckets.set(t.bucket, []);
      buckets.get(t.bucket)!.push(t);
    }

    const priorityRank: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
    for (const list of buckets.values()) {
      list.sort((a, b) => {
        if (sort === "priority") {
          return priorityRank[a.priority] - priorityRank[b.priority];
        }
        if (sort === "due") {
          const ad = stateFor(a.id).dueDate ?? "9999";
          const bd = stateFor(b.id).dueDate ?? "9999";
          return ad.localeCompare(bd);
        }
        return 0;
      });
    }
    return buckets;
  }, [filteredTasks, sort, state.tasks]);

  function patchTask(id: string, patch: Partial<TaskState>) {
    setState((prev) => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        [id]: { ...stateFor(id), ...patch },
      },
    }));
  }

  function toggleDone(id: string) {
    patchTask(id, { done: !stateFor(id).done });
  }

  function addCustomTask() {
    const title = newTaskTitle.trim();
    if (!title) return;
    const id = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setState((prev) => ({
      ...prev,
      customTasks: [
        ...prev.customTasks,
        { id, title, bucket: newTaskBucket, priority: newTaskPriority, custom: true },
      ],
    }));
    setNewTaskTitle("");
  }

  function removeTask(t: UserTask) {
    setState((prev) => {
      if (t.custom) {
        return {
          ...prev,
          customTasks: prev.customTasks.filter((c) => c.id !== t.id),
          tasks: Object.fromEntries(Object.entries(prev.tasks).filter(([k]) => k !== t.id)),
        };
      }
      return {
        ...prev,
        hiddenDefaults: [...prev.hiddenDefaults, t.id],
        tasks: Object.fromEntries(Object.entries(prev.tasks).filter(([k]) => k !== t.id)),
      };
    });
  }

  function resetAll() {
    if (!confirm("Reset everything — tasks, due dates, notes? This cannot be undone.")) return;
    setState(INITIAL);
  }

  function restoreDefaults() {
    setState((prev) => ({ ...prev, hiddenDefaults: [] }));
  }

  if (!hydrated) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="space-y-4">
          <div className="h-10 skeleton-shimmer w-1/2" />
          <div className="h-32 skeleton-shimmer" />
          <div className="h-32 skeleton-shimmer" />
        </div>
      </section>
    );
  }

  return (
    <>
      {/* PROGRESS + CONTROLS */}
      <section className="border-b border-ink/10 bg-cream-soft">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="text-[0.7rem] uppercase tracking-[0.22em] text-ink-soft">
                Progress
              </p>
              <p className="font-serif-display text-3xl md:text-4xl text-bordeaux mt-1">
                {doneCount} <span className="text-ink-soft text-2xl">/ {totalCount}</span>
              </p>
              <div className="mt-3 h-1 w-64 bg-ink/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-bordeaux to-champagne transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <Filter label="View" value={filter} onChange={setFilter}
                opts={[
                  { v: "all", l: "All" },
                  { v: "open", l: "Open" },
                  { v: "done", l: "Done" },
                ]} />
              <Filter label="Sort" value={sort} onChange={setSort}
                opts={[
                  { v: "timeline", l: "Timeline" },
                  { v: "priority", l: "Priority" },
                  { v: "due", l: "Due date" },
                ]} />
              <button
                onClick={restoreDefaults}
                disabled={state.hiddenDefaults.length === 0}
                className="text-[0.65rem] uppercase tracking-[0.22em] text-ink-soft hover:text-bordeaux disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Restore defaults
              </button>
              <button
                onClick={resetAll}
                className="text-[0.65rem] uppercase tracking-[0.22em] text-ink-soft hover:text-bordeaux"
              >
                Reset all
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ADD TASK */}
      <section className="border-b border-ink/10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-end">
            <div className="flex-1">
              <label className="text-[0.65rem] uppercase tracking-[0.22em] text-ink-soft block mb-2">
                Add a custom task
              </label>
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomTask()}
                placeholder="Block hotel rooms in Phaltan for outstation cousins…"
                className="editorial-input w-full"
              />
            </div>
            <div>
              <label className="text-[0.65rem] uppercase tracking-[0.22em] text-ink-soft block mb-2">
                Bucket
              </label>
              <select
                value={newTaskBucket}
                onChange={(e) => setNewTaskBucket(e.target.value)}
                className="editorial-input"
              >
                {TIMELINE_BUCKETS.map((b) => (
                  <option key={b.id} value={b.id}>{b.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[0.65rem] uppercase tracking-[0.22em] text-ink-soft block mb-2">
                Priority
              </label>
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
                className="editorial-input"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <button onClick={addCustomTask} className="btn-editorial whitespace-nowrap">
              Add task
            </button>
          </div>
        </div>
      </section>

      {/* BUCKETS */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-6 space-y-4">
          {TIMELINE_BUCKETS.map((bucket) => {
            const list = sortedAndGrouped.get(bucket.id) ?? [];
            const bucketDone = list.filter((t) => stateFor(t.id).done).length;
            const isExpanded = expandedBucket === null || expandedBucket === bucket.id;

            return (
              <div key={bucket.id} className="editorial-card">
                <button
                  onClick={() => setExpandedBucket(isExpanded ? bucket.id === expandedBucket ? null : bucket.id : bucket.id)}
                  className="w-full flex items-center justify-between px-6 py-5 border-b border-ink/8 group"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="font-serif-display text-3xl text-champagne">
                      {String(TIMELINE_BUCKETS.indexOf(bucket) + 1).padStart(2, "0")}
                    </span>
                    <div className="text-left">
                      <h3 className="font-serif-display text-xl md:text-2xl text-ink group-hover:text-bordeaux transition-colors">
                        {bucket.label}
                      </h3>
                      <p className="text-[0.65rem] uppercase tracking-[0.22em] text-ink-soft mt-1">
                        {bucketDone} / {list.length} complete
                      </p>
                    </div>
                  </div>
                  <span className="text-champagne text-2xl transition-transform" style={{ transform: isExpanded ? "rotate(45deg)" : "none" }}>
                    +
                  </span>
                </button>

                {isExpanded && list.length === 0 && (
                  <p className="px-6 py-8 text-center text-ink-soft italic text-sm">
                    Nothing here yet — add a custom task above.
                  </p>
                )}

                {isExpanded && list.length > 0 && (
                  <div className="divide-y divide-ink/8">
                    {list.map((t) => {
                      const s = stateFor(t.id);
                      const isOpen = openTaskId === t.id;
                      return (
                        <div key={t.id} className="px-6 py-4">
                          <div className="flex items-start gap-4">
                            <PrimitiveCheckbox
                              checked={s.done}
                              onChange={() => toggleDone(t.id)}
                              ariaLabel={`Mark "${t.title}" ${s.done ? "incomplete" : "done"}`}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-3">
                                <p className={`text-sm md:text-base leading-snug ${s.done ? "text-ink-soft line-through" : "text-ink"}`}>
                                  {t.title}
                                  {t.custom && (
                                    <span className="ml-2 text-[0.55rem] uppercase tracking-[0.2em] text-champagne align-middle">
                                      · custom
                                    </span>
                                  )}
                                </p>
                                <PriorityChip priority={t.priority} />
                              </div>

                              <div className="mt-2 flex items-center gap-3 flex-wrap">
                                {s.dueDate && (
                                  <span className="text-[0.65rem] uppercase tracking-[0.2em] text-bordeaux">
                                    Due {new Date(s.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                  </span>
                                )}
                                {s.notes && (
                                  <span className="text-[0.65rem] uppercase tracking-[0.2em] text-ink-soft/70">
                                    Has note
                                  </span>
                                )}
                                <button
                                  onClick={() => setOpenTaskId(isOpen ? null : t.id)}
                                  className="text-[0.65rem] uppercase tracking-[0.2em] text-ink-soft editorial-link"
                                >
                                  {isOpen ? "Close" : "Edit"}
                                </button>
                                <button
                                  onClick={() => removeTask(t)}
                                  className="text-[0.65rem] uppercase tracking-[0.2em] text-ink-soft/70 hover:text-bordeaux"
                                >
                                  Remove
                                </button>
                              </div>

                              {isOpen && (
                                <div className="mt-4 pt-4 border-t border-ink/8 space-y-3">
                                  <div>
                                    <label className="text-[0.65rem] uppercase tracking-[0.22em] text-ink-soft block mb-2">
                                      Due date
                                    </label>
                                    <input
                                      type="date"
                                      value={s.dueDate ?? ""}
                                      onChange={(e) => patchTask(t.id, { dueDate: e.target.value || null })}
                                      className="editorial-input"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[0.65rem] uppercase tracking-[0.22em] text-ink-soft block mb-2">
                                      Notes
                                    </label>
                                    <textarea
                                      value={s.notes}
                                      onChange={(e) => patchTask(t.id, { notes: e.target.value })}
                                      placeholder="Tasting at 6 pm. Ask about jain menu."
                                      rows={3}
                                      className="editorial-input w-full resize-y"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER LINK */}
      <section className="border-t border-ink/10 py-12 text-center">
        <p className="text-[0.7rem] uppercase tracking-[0.22em] text-ink-soft mb-4">
          Working on the money side too?
        </p>
        <Link href="/plan/budget" className="btn-editorial-ghost">
          Open Budget Planner
        </Link>
      </section>
    </>
  );
}

function PriorityChip({ priority }: { priority: Priority }) {
  const styles =
    priority === "high"
      ? "border-bordeaux text-bordeaux"
      : priority === "medium"
        ? "border-champagne text-champagne"
        : "border-ink/20 text-ink-soft";
  return (
    <span className={`text-[0.55rem] uppercase tracking-[0.2em] px-2 py-0.5 border ${styles} shrink-0`}>
      {priority}
    </span>
  );
}

function Filter<T extends string>({
  label,
  value,
  onChange,
  opts,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  opts: { v: T; l: string }[];
}) {
  return (
    <div>
      <p className="text-[0.6rem] uppercase tracking-[0.22em] text-ink-soft mb-1.5">
        {label}
      </p>
      <div className="flex gap-1.5">
        {opts.map((o) => (
          <button
            key={o.v}
            onClick={() => onChange(o.v)}
            className="filter-pill"
            data-active={value === o.v ? "true" : "false"}
          >
            {o.l}
          </button>
        ))}
      </div>
    </div>
  );
}
