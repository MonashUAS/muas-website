import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Project } from "./project-data";

const PANEL_WIDTH = "min(82vw,430px)";
const CLOSED_OFFSET = `calc(${PANEL_WIDTH} + 48px - 120px)`;

// ProjectInfoPanel renders the sliding tab and scrollable project detail content.
export function ProjectInfoPanel({
  project,
  infoOpen,
  onToggleInfo,
}: {
  project: Project;
  infoOpen: boolean;
  onToggleInfo: () => void;
}) {
  return (
    <aside
      data-project-controls="true"
      className="pointer-events-none absolute inset-y-0 right-0 z-10 flex max-w-full overflow-hidden"
      style={{ width: `calc(${PANEL_WIDTH} + 48px)` }}
    >
      <div
        className="flex h-full w-full items-center group transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: infoOpen ? "translateX(0)" : `translateX(${CLOSED_OFFSET})` }}
      >
        <div className="flex w-12 shrink-0">
          <button
            type="button"
            aria-expanded={infoOpen}
            className="pointer-events-auto flex h-14 w-12 items-center justify-center bg-blue-900 text-white transition-colors group-hover:bg-blue-700 cursor-pointer"
            onClick={(event) => {
              event.stopPropagation();
              onToggleInfo();
            }}
          >
            {infoOpen ? (
              <ChevronRight aria-hidden="true" size={15} />
            ) : (
              <ChevronLeft aria-hidden="true" size={15} />
            )}
          </button>
        </div>

        <div
          className="pointer-events-auto max-h-full overflow-y-auto bg-blue-900/85 backdrop-blur-md"
          style={{ width: PANEL_WIDTH }}
        >
          {infoOpen ? (
            <div className="p-6 sm:p-8">
              <ProjectInfoContent project={project} />
            </div>
          ) : (
            <button
              type="button"
              className="flex h-14 w-[72px] items-center justify-center whitespace-nowrap bg-blue-900 px-4 text-center text-caption text-white transition-colors hover:bg-blue-700 cursor-pointer"
              onClick={(event) => {
                event.stopPropagation();
                onToggleInfo();
              }}
            >
              Project Info
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

// ProjectInfoContent formats each project's description, decisions, lead, and members.
function ProjectInfoContent({ project }: { project: Project }) {
  return (
    <div className="space-y-7 text-white">
      <p className="text-b1 leading-6">{project.description}</p>

      <div>
        <h4 className="text-subtitle uppercase">Design Decisions</h4>
        <div className="mt-4 space-y-5">
          {project.decisions.map((decision, index) => (
            <div key={decision.title} className="grid grid-cols-[36px_minmax(0,1fr)] gap-4">
              <p className="text-h6 leading-none">{index + 1}</p>
              <div>
                <h5 className="text-b1">{decision.title}</h5>
                <p className="mt-3 text-b2 leading-5 text-white/85">{decision.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-subtitle uppercase">Project Lead</h4>
        <p className="mt-3 text-b1">{project.lead}</p>
      </div>

      <div>
        <h4 className="text-subtitle uppercase">Project Team</h4>
        <p className="mt-3 text-b1 text-white/85">{project.members.join(", ")}</p>
      </div>
    </div>
  );
}
