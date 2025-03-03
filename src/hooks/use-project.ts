import { api } from '@/trpc/react'
import React from 'react'
import { useLocalStorage } from "usehooks-ts";

const useProject = () => {
    const { data: projects = [] } = api.project.getProjects.useQuery(); 
    const [projectId, setProjectId] = useLocalStorage('github-projectId', ''); 

    const project = projects.find(project => project.id === projectId) || null; 

    return {
        projects,
        project,
        projectId,
        setProjectId
    }
}

export default useProject;
