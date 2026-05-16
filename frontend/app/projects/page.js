"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import Link from 'next/link';
import { Plus, Folder, Users, ChevronRight, Search, LayoutGrid, List as ListIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export default function ProjectsPage() {
  const { user, loading } = useAuth();
  const [projects, setProjects] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects/');
      setProjects(res.data);
    } catch (err) {
      console.error('Failed to fetch projects', err);
    } finally {
      setFetching(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/projects/', newProject);
      setIsDialogOpen(false);
      setNewProject({ name: '', description: '' });
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || (user && fetching)) {
    return <div className="flex h-screen items-center justify-center">
      <Loader2 className="animate-spin h-8 w-8 text-primary" />
    </div>;
  }

  if (!user) return null;

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground text-lg">Manage and collaborate on your team's initiatives.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search projects..." className="pl-10 w-64 rounded-xl bg-white/50 border-gray-100" />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger render={<Button className="h-12 px-6 rounded-2xl font-bold shadow-xl shadow-primary/20 gap-2" />}>
              <Plus size={20} />
              New Project
            </DialogTrigger>
            <DialogContent className="rounded-3xl p-8 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Create Project</DialogTitle>
                <CardDescription>Launch a new workspace for your team.</CardDescription>
              </DialogHeader>
              <form onSubmit={handleCreateProject} className="space-y-6 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Project Name</Label>
                  <Input 
                    id="name" 
                    value={newProject.name} 
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})} 
                    placeholder="e.g. Website Redesign"
                    className="rounded-xl h-12"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Description</Label>
                  <Input 
                    id="description" 
                    value={newProject.description} 
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})} 
                    placeholder="Briefly describe the goal..."
                    className="rounded-xl h-12"
                  />
                </div>
                <DialogFooter className="pt-4">
                  <Button type="submit" disabled={submitting} className="w-full h-12 rounded-2xl font-bold text-lg">
                    {submitting ? <Loader2 className="animate-spin" /> : 'Launch Project'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {projects.length === 0 ? (
        <Card className="border-dashed border-2 bg-transparent h-64 flex flex-col items-center justify-center text-center p-10 rounded-3xl">
          <div className="bg-gray-100 p-4 rounded-2xl mb-4">
            <Folder className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">No projects yet</h3>
          <p className="text-muted-foreground max-w-xs mt-2">Create your first project to start managing tasks and collaborating with your team.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="card-hover border-none bg-white/70 backdrop-blur-sm shadow-sm h-full flex flex-col rounded-3xl overflow-hidden group">
                <CardHeader className="p-8">
                  <div className="flex justify-between items-start">
                    <div className="bg-indigo-50 p-3 rounded-2xl group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                      <Folder className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <Badge variant="outline" className="rounded-full border-gray-100 text-[10px] font-bold uppercase tracking-widest">Active</Badge>
                  </div>
                  <div className="mt-6">
                    <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">{project.name}</CardTitle>
                    <p className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-relaxed">{project.description || 'No description provided.'}</p>
                  </div>
                </CardHeader>
                <CardContent className="px-8 pb-4 flex-grow">
                  <div className="flex items-center -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-primary">
                        {i === 3 ? '+5' : 'JD'}
                      </div>
                    ))}
                    <span className="ml-4 text-xs font-semibold text-muted-foreground italic">3 active tasks</span>
                  </div>
                </CardContent>
                <CardFooter className="px-8 py-6 border-t border-gray-50 flex justify-between items-center bg-gray-50/30">
                  <span className="text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                    Open Workspace <ChevronRight size={14} />
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">Updated 2h ago</span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
