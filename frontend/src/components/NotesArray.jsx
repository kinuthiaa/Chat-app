import React from 'react'
import { useParams } from 'react-router'
import NoteTakingComponent from "../components/NoteTakingComponent"
import { createNote, getNotes } from '../lib/api'
import toast from 'react-hot-toast'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FileText, PlusIcon, Save, Trash2 } from 'lucide-react'

const NotesArray = ({ notebook }) => {
    const queryClient = useQueryClient();
    const { id: notebookId } = useParams();
    const [isCreating, setIsCreating] = React.useState(false);
    const [newNotename, setNewNoteName] = React.useState('');

    // Remove the notebook effect since we'll use prop directly
    React.useEffect(() => {
        if (!notebook?.id) {
            toast.error('Invalid notebook');
        }
    }, [notebook]);

    if (!notebook?._id) {
        return <div className="p-4 text-center">
            <span className="loading loading-bars loading-lg" />
            <p className="mt-4">Loading notebook details...</p>
        </div>;
    }

    // Update query to use notebook._id instead of notebookId from params
    const { data: notes = [], isLoading, error } = useQuery({
        queryKey: ['notes', notebook._id],
        queryFn: async () => {
            console.log('Fetching notes for notebook:', notebook._id);
            return await getNotes(notebook._id);
        },
        enabled: !!notebook._id
    });

    if(error){
        return <div className='p-4 text-center text-error'>Error Loading Notes: {error.message}</div>
    }

    // Improved mutation with proper error handling
    const createNoteMutation = useMutation({
        mutationFn: (noteData) => createNote(notebookId, noteData),
        onSuccess: () => {
            queryClient.invalidateQueries(['notes', notebookId]);
            setIsCreating(false);
            setNewNoteName('');
            toast.success('Note created successfully');
        },
        onError: (error) => {
            console.error('Error creating note:', error);
            toast.error(error.response?.data?.message || 'Failed to create note');
        }
    });

    const handleCreateNote = () => {
        if (!newNotename.trim()) {
            toast.error('Please enter a note title');
            return;
        }

        createNoteMutation.mutate({
            title: newNotename.trim(),
            content: 'lorem ipsum dolor si amet privallada'
        });
    };

    if (isLoading) {
        return <div className="flex justify-center py-12">
            <span className="loading loading-bars loading-lg" />
        </div>;
    }

    // Add type checking before mapping
    const notesArray = Array.isArray(notes) ? notes : [];

    // Add this before the return statement
    console.log('Current notesArray:', notesArray);

    return (
        <div className='p-4 md:p-6 lg:p-8'>
            <div className="container mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        {notebook?.notebookName || 'Loading...'}
                    </h1>
                    <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => setIsCreating(true)}  // Add onClick handler
                    >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        New Note
                    </button>
                </div>

                {isCreating && (
                    <div className="card bg-base-200 p-4">
                        <input 
                            type="text"
                            value={newNotename}
                            onChange={(e) => setNewNoteName(e.target.value)} 
                            placeholder='Note Title'
                            className='input input-bordered w-full max-w-xs mr-2'
                        />
                        <div className="mt-4 space-x-2">
                            <button 
                                className='btn btn-primary'
                                disabled={createNoteMutation.isPending} 
                                onClick={handleCreateNote}
                            >
                                {createNoteMutation.isPending ? (
                                    <span className="loading loading-spinner loading-sm"></span>
                                ) : (
                                    'Create Note'
                                )}
                            </button>
                            <button 
                                className='btn' 
                                onClick={() => {
                                    setIsCreating(false);
                                    setNewNoteName('');
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Use notesArray instead of notes directly */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {notesArray.map((note) => (
                        <div key={note._id} className="card bg-base-200 hover:shadow-lg transition-shadow">
                            <div className="card-body">
                                <div className="flex items-center justify-between">
                                    <h3 className="card-title">{note.title}</h3>
                                    <div className="dropdown dropdown-end">
                                        <button className="btn btn-ghost btn-sm btn-circle">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                            </svg>
                                        </button>
                                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                            <li><button className="text-error"><Trash2 className="w-4 h-4" />Delete</button></li>
                                            <li><button><Save className="w-4 h-4" />Export PDF</button></li>
                                        </ul>
                                    </div>
                                </div>
                                <p className="text-sm opacity-70">{note.content.substring(0, 100)}...</p>
                                <div className="card-actions justify-end mt-4">
                                    <span className="text-xs opacity-50">
                                        Last updated: {new Date(note.updatedAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {notesArray.length === 0 && (
                    <div className="card bg-base-200 p-6 text-center">
                        <FileText className="w-12 h-12 mx-auto opacity-50 mb-4" />
                        <h3 className="font-semibold text-lg mb-2">No Notes Yet</h3>
                        <p className="text-base-content opacity-70">
                            Create your first note in this notebook to get started.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default NotesArray