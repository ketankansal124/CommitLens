"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useProject from "@/hooks/use-project";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

const InviteButton = () => {
    const { projectId } = useProject();
    const [open, setOpen] = useState(false);
    const [inviteLink, setInviteLink] = useState("");

    // Ensure `window.location.origin` is accessed only on the client
    useEffect(() => {
        if (typeof window !== "undefined") {
            setInviteLink(`${window.location.origin}/join/${projectId}`);
        }
    }, [projectId]);

    const handleCopy = () => {
        if (!inviteLink) return;
        navigator.clipboard.writeText(inviteLink)
            .then(() => toast.success("Copied to Clipboard"))
            .catch(() => toast.error("Failed to copy"));
    };

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Invite Team Members</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-gray-500">
                        Ask them to copy and paste this link:
                    </p>
                    <Input 
                        className="mt-4 cursor-pointer" 
                        readOnly 
                        value={inviteLink || "Loading..."} 
                        onClick={handleCopy}
                    />
                </DialogContent>
            </Dialog>
            <Button size="sm" onClick={() => setOpen(true)}>Invite Members</Button>
        </>
    );
};

export default InviteButton;
