import { useMutation, useQuery } from '@tanstack/react-query'
import React from 'react'
import { deleteNote } from '../lib/api';
import toast from 'react-hot-toast';
import { FileTypeIcon, MoreVerticalIcon } from 'lucide-react';
import Notes from '../../../backend/src/models/Notes';


const NoteCard = ({ note, showActions = false }) => {
    const queryClient = useQuery();
    const { mutate: deleteNoteMutation, isPending } = useMutation({
        mutationFn: deleteNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
            toast.success("File successfully deleted");
        },
        onError: (error) => {
            console.error("Error deleting note", error);
            toast.error(error.response?.data?.message || "Failed to delete");
        }
    });

    return (
        <div className='card bg-base-200 hover:shadow-md transition-shadow'>
            <div className="card-body p-4">
                <div className="flex items-center gap-3 mb-3">
                    <div className="avatar size-12 rounded-full">
                        <FileTypeIcon className='s-5' />
                    </div>
                    <div className="flex-1">
                        <h3 className='font-semibold truncate'>{note.title}</h3>
                    </div>
                    {showActions && (
                        <div className="dropdown dropdown-end">
                            <button className="btn btn-ghost btn-sm btn-circle" tabIndex={0}>
                                <MoreVerticalIcon className='s-5' />
                            </button>
                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-200 rounded-box w-52">
                                <li>
                                    <button
                                        className="text-error"
                                        onClick={() => deleteNoteMutation(note.id)}
                                        disabled={isPending}
                                    >
                                        Delete Note
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-1.5 mb-3">
                    <h3 className='text-sm text-primary font-semibold text-left'>{Notes.title}</h3>
                    <p className='text-base-content text-sm text-left'>{Notes.content}</p>
                    <div className="flex flex-row gap-1 items-center justify-start">
                        <span className='badge badge-outline text-xs'>Created on:{Notes.createdAt}</span>
                        <span className='badge badge-outline text-xs'>Last updated:{Notes.updatedAt}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NoteCard