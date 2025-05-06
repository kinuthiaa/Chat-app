import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import NoteTakingComponent from "../components/NoteTakingComponent"
import NoNotes from '../components/NoNotes';
import { PlusIcon, FolderIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { getNotebooks, createNotebook } from '../lib/api';
import { useNavigate, useParams } from 'react-router';

const NotesPage = () => {
  const { id: notebookId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedNotebook, setSelectedNotebook] = React.useState(null);
  const [isCreating, setIsCreating] = React.useState(false);
  const [newNotebookName, setNewNotebookName] = React.useState('');

  const {data: notebooks = [], isLoading} = useQuery({
    queryKey: ['notebooks'],
    queryFn: getNotebooks
  });

  const createNotebookMutation = useMutation({
    mutationFn: createNotebook,
    onSuccess: () => {
      queryClient.invalidateQueries(['notebooks']);
      setIsCreating(false);
      setNewNotebookName('');
      toast.success('Notebook created successfully!');
    },
    onError: (error) => {
      console.error('Error creating notebook:', error);
      toast.error(error.response?.data?.message || 'Failed to create notebook');
    }
  });

  if (isLoading) {
    return <div className="flex justify-center py-12">
      <span className="loading loading-bars loading-lg" />
    </div>;
  }

  const currentNotebook = React.useMemo(() => {
    return notebooks.find(n => n._id === notebookId);
  }, [notebooks, notebookId]);

  React.useEffect(() => {
    if (notebooks.length > 0 && notebookId && !currentNotebook) {
      toast.error('Notebook not found');
      navigate('/notes');
    }
  }, [notebooks, notebookId, currentNotebook, navigate]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Notebooks</h1>
        <button
          className="btn btn-primary"
          onClick={() => setIsCreating(true)}  // Changed to handle notebook creation
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          New Notebook
        </button>
      </div>

      {isCreating && (
        <div className="card bg-base-200 p-4">
          <input
            type="text"
            value={newNotebookName}
            onChange={(e) => setNewNotebookName(e.target.value)}
            placeholder="Notebook name"
            className="input input-bordered w-full max-w-xs mr-2"
          />
          <div className="mt-4 space-x-2">
            <button
              className="btn btn-primary"
              onClick={() => createNotebookMutation.mutate(newNotebookName)}
            >
              Create
            </button>
            <button
              className="btn"
              onClick={() => setIsCreating(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {notebooks.length === 0 ? (
        <NoNotes />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notebooks.map((notebook) => (
            <div
              key={notebook._id}
              className="card bg-base-200 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/notebook/${notebook._id}`)}
            >
              <div className="card-body">
                <div className="flex items-center gap-3">
                  <FolderIcon className="w-6 h-6 text-primary" />
                  <h2 className="card-title">{notebook.notebookName}</h2>
                </div>
                <p className="text-sm opacity-70">
                  {notebook.notes.length} notes
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {currentNotebook && <NotesArray notebook={currentNotebook} />}
    </div>
  )
}

export default NotesPage;