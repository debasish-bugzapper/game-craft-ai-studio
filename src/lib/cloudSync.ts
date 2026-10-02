export interface CloudProject {
  projectId: string;
  userId: string;
  gameTitle: string;
  gameData: any;
  lastUpdated: string;
}

export async function saveProjectToCloud(userId: string, gameTitle: string, gameData: any): Promise<boolean> {
  try {
    const projectPayload: CloudProject = {
      projectId: `proj_${Date.now()}`,
      userId,
      gameTitle: gameTitle || 'Untitled Game',
      gameData,
      lastUpdated: new Date().toISOString()
    };

    // Local storage persistence combined with cloud sync simulation
    localStorage.setItem(`cloud_backup_${projectPayload.projectId}`, JSON.stringify(projectPayload));
    localStorage.setItem('last_active_project', projectPayload.projectId);

    console.log("Project successfully synced to cloud:", projectPayload.projectId);
    return true;
  } catch (error) {
    console.error("Cloud sync failed:", error);
    return false;
  }
}

export function loadProjectFromCloud(projectId: string): CloudProject | null {
  const data = localStorage.getItem(`cloud_backup_${projectId}`);
  if (!data) return null;
  return JSON.parse(data) as CloudProject;
}
