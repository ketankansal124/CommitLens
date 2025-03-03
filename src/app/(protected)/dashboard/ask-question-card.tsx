"use client"

import MDEditor from "@uiw/react-md-editor"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import useProject from '@/hooks/use-project'
import { DialogTitle } from '@radix-ui/react-dialog'
import Image from 'next/image'
import React from 'react'
import { askQuestion } from './actions'
import { readStreamableValue } from 'ai/rsc'
import CodeReferences from "./code-references"
import { api } from "@/trpc/react"
import { toast } from "sonner"
import useRefetch from "@/hooks/use-refetch"

const AskQuestionCard = () => {
    const { project } = useProject()
    const [open, setOpen] = React.useState(false);
    const [question, setQuestion] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [filesReferences, setFileReferences] = React.useState<{ fileName: string; sourceCode: string; summary: string }[]>([])

    const [answer, setAnswer] = React.useState("");
    const saveAnswer = api.project.saveAnswer.useMutation()

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setAnswer('');
        setFileReferences([]);
        if (!project?.id) return
        e.preventDefault();
        setLoading(true);

        const { output, filesReferences } = await askQuestion(question, project.id);
        setOpen(true);
        setFileReferences(filesReferences);

        for await (const delta of readStreamableValue(output)) {
            if (delta) {
                setAnswer(ans => ans + delta)
            }
        }
        setLoading(false);
    }

    const refetch = useRefetch();

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[80vw]">
                    <DialogHeader>
                        <div className="flex items-center gap-2">
                            <DialogTitle>
                                <Image src="/logo.png" alt="GitHub" width={40} height={40} />
                            </DialogTitle>
                            <Button disabled={saveAnswer.isPending} variant={"outline"} onClick={
                                () => {
                                    saveAnswer.mutate({
                                        projectId: project!.id,
                                        question,
                                        answer,
                                        filesReferences
                                    }, {
                                        onSuccess: () => {
                                            toast.success("Answer Saved");
                                            refetch();
                                        },
                                        onError: () => {
                                            toast.error("Failed to save answer!")
                                        }
                                    })
                                }
                            }>
                                Save Answer
                            </Button>
                        </div>
                    </DialogHeader>

                    <MDEditor.Markdown source={answer} className="mx-w-[70vw] !h-full max-h-[40vh] overflow-scroll" />
                    <div className="h-4"></div>
                    <CodeReferences filesReferences={filesReferences} />
                    <Button type="button" onClick={() => { setOpen(false) }} >Close</Button>
                </DialogContent>
            </Dialog>
            <Card className='relative col-span-3'>
                <CardHeader>
                    <CardTitle>Ask a Question</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit}>
                        <Textarea placeholder='Which file should i edit to change the Home Page?' value={question} onChange={e => setQuestion(e.target.value)} />
                        <div className="h-4"></div>
                        <Button type="submit" disabled={loading}>
                            Ask Github
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </>
    )
}

export default AskQuestionCard