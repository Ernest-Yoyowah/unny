import { Project } from "../api/services/project.service";

export interface ProjectMilestone {
  title: string;
  completed: boolean;
}

export const getProjectMilestones = (project: Project): ProjectMilestone[] => [
  { title: "Project draft created", completed: Boolean(project.createdAt) },
  {
    title: "Documents attached",
    completed: Boolean(project.documents?.length || project.fileUrl),
  },
  {
    title: "Submitted for review",
    completed: ["PENDING", "APPROVED"].includes(project.status),
  },
  { title: "Approved for archive", completed: project.status === "APPROVED" },
];

export const getProjectProgress = (project: Project): number => {
  const milestones = getProjectMilestones(project);
  return Math.round(
    (milestones.filter((milestone) => milestone.completed).length /
      milestones.length) *
      100,
  );
};
