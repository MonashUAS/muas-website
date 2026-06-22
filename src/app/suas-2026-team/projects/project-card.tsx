import { ProjectInfoPanel } from "./project-info";
import type { Project } from "./project-data";
import { placeholderImage } from "./project-data";

// ProjectCard displays the current project image area and expandable details panel.
export function ProjectCard({
  project,
  imageIndex,
  infoOpen,
  onToggleInfo,
}: {
  project: Project;
  imageIndex: number;
  infoOpen: boolean;
  onToggleInfo: () => void;
}) {
  return (
    <div className="relative mt-8 w-full max-w-6xl animate-[project-fade_420ms_ease] overflow-hidden bg-blue-900/40 shadow-2xl shadow-blue-900/20">
      <ProjectImageBlock imageIndex={imageIndex} project={project} />
      <ProjectInfoPanel infoOpen={infoOpen} project={project} onToggleInfo={onToggleInfo} />
    </div>
  );
}

// ProjectImageBlock shows either the active project image or the lightweight placeholder state.
function ProjectImageBlock({
  project,
  imageIndex,
}: {
  project: Project;
  imageIndex: number;
}) {
  const image = project.images[imageIndex];

  return (
    <div className="relative h-[420px] overflow-hidden bg-blue-900 sm:h-[520px] lg:h-[560px]">
      {image ? (
        <img
          key={image}
          alt={`${project.name} project`}
          className="h-full w-full animate-[project-fade_420ms_ease] object-cover"
          draggable={false}
          src={image}
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center p-8 text-center"
          style={{ background: placeholderImage }}
        >
          <p className="max-w-sm text-subtitle uppercase text-white/80">
            {project.name} images coming soon
          </p>
        </div>
      )}
    </div>
  );
}
