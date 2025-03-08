"use client";

import { Button } from "@/components/ui/button";
import useProject from "@/hooks/use-project";
import useRefetch from "@/hooks/use-refetch"
import React from "react";
import { api } from "@/trpc/react";
import { toast } from "sonner";

const ArchiveButton = () => {
    const archiveProject = api.project.archiveProject.useMutation();
    const { projectId } = useProject();
    const refetch = useRefetch();
    return (
        <Button disabled={archiveProject.isPending} size="sm" variant="destructive"
            onClick={() => {
                const isConfirmed = window.confirm("Are you sure you want to archive this project?");
                if (isConfirmed) {
                    archiveProject.mutate(
                        { projectId },
                        {
                            onSuccess: () => {
                                toast.success("Project Archived");
                                refetch();
                            },
                            onError: (error) => {
                                toast.error(`Failed to archive project: ${error.message}`);
                            }
                        }
                    );
                }
            }}
        >
            Archive Project
        </Button>
    );
};

export default ArchiveButton;
