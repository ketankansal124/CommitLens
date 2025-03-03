"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import useRefetch from '@/hooks/use-refetch'
import { api } from '@/trpc/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

type FormInnput = {
    repoUrl: string,
    projectName: string,
    githubToken?: string
}
const CreatePage = () => {
    const { register, handleSubmit, reset } = useForm<FormInnput>();
    const createProject = api.project.createProject.useMutation();
    const refetch=useRefetch()

    const onSubmit = (data: FormInnput) => {
        createProject.mutate({
            githubUrl: data.repoUrl,
            name: data.projectName,
            githubToken: data.githubToken
        }, {
            onSuccess: () => {
                toast.success("Project Created Succesfuly");
                refetch()
                reset()
            },
            onError: () => {
                toast.error("Failed to create Project")
            }
        })
        return true;
    }
    return (
        <div className='flex items-center gap-12 h-full justify-center'>
            <img src="github-create-project.svg" className='h-46 w-auto' />
            <div>
                <div>
                    <h1 className='font-semibold text-2xl'>
                        Link your Github Repository
                    </h1>
                    <p className='text-sm text-muted-foreground'>
                        Enter the URL of your repository to link it to Github
                    </p>
                </div>
                <div className='h-4'>
                    <div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Input
                                {...register('projectName', { required: true })}
                                placeholder='Project Name'
                                required
                            />
                            <div className='h-2'></div>
                            <Input
                                {...register('repoUrl', { required: true })}
                                placeholder='GitHub URL'
                                type="url"
                                required
                            />
                            <div className='h-2'></div>
                            <Input
                                {...register('githubToken')}
                                placeholder='GitHub Token (Optional)'
                            />
                            <div className="h-4"></div>
                            <Button type='submit' disabled={createProject.isPending}>
                                Create Project
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreatePage