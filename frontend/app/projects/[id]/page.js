"use client";

import { useEffect, useState, use } from 'react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import Link from 'next/link';
import { 
  Plus, 
  Users, 
  LayoutDashboard, 
  CheckCircle2, 
  Clock, 
  MoreVertical, 
  Trash2, 
  Edit, 
  ChevronLeft,
  Loader2,
  Calendar,
  Flag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function ProjectDetailPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { id } = params;
  const { user, loading } = useAuth();
  
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [myRole, setMyRole] = useState('MEMBER');
  const [fetching, setFetching] = useState(true);

  // Form states
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'MEDIUM', assigned_to_id: '' });
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProjectData();
    }
  }, [user, id]);

  const fetchProjectData = async () => {
    try {
      const [projRes, tasksRes, membersRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/projects/${id}/tasks`),
        api.get(`/projects/${id}/members`)
      ]);
      setProject(projRes.data);
      setTasks(tasksRes.data);
      setMembers(membersRes.data);
      
      const me = membersRes.data.find(m => m.user_id === user.id);
      if (me) setMyRole(me.role);
    } catch (err) {
      console.error('Failed to fetch project data', err);
    } finally {
      setFetching(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/projects/${id}/tasks`, newTask);
      setIsTaskDialogOpen(false);
      setNewTask({ title: '', description: '', priority: 'MEDIUM', assigned_to_id: '' });
      fetchProjectData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/projects/${id}/members`, { email: newMemberEmail, role: 'MEMBER' });
      setIsMemberDialogOpen(false);
      setNewMemberEmail('');
      fetchProjectData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to add member');
    } finally {
      setSubmitting(false);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await api.patch(`/tasks/${taskId}`, { status: newStatus });
      fetchProjectData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to update status');
    }
  };

  const isAdmin = myRole === 'ADMIN';

  if (loading || fetching) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="animate-spin h-8 w-8 text-primary" />
    </div>
  );

  if (!project) return (
    <div className="flex flex-col h-screen items-center justify-center space-y-4">
      <div className="bg-red-50 p-4 rounded-full text-red-500"><Flag size={32} /></div>
      <h2 className="text-2xl font-bold">Project not found</h2>
      <Link href="/projects"><Button variant="outline">Back to Projects</Button></Link>
    </div>
  );

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-10">
      <header className="space-y-6">
        <Link href="/projects" className="group flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Projects
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">{project.name}</h1>
            <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">{project.description || 'No description provided for this workspace.'}</p>
          </div>
          
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Dialog open={isMemberDialogOpen} onOpenChange={setIsMemberDialogOpen}>
                <DialogTrigger render={<Button variant="outline" className="h-12 px-6 rounded-2xl font-bold gap-2" />}>
                  <Users size={18} />
                  Manage Team
                </DialogTrigger>
                <DialogContent className="rounded-3xl p-8 max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Invite Member</DialogTitle>
                    <CardDescription>Add a collaborator to this project workspace.</CardDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddMember} className="space-y-6 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">User Email</Label>
                      <Input id="email" type="email" value={newMemberEmail} onChange={(e) => setNewMemberEmail(e.target.value)} required placeholder="colleague@company.com" className="rounded-xl h-12" />
                    </div>
                    <DialogFooter><Button type="submit" disabled={submitting} className="w-full h-12 rounded-2xl font-bold">{submitting ? <Loader2 className="animate-spin" /> : 'Add to Team'}</Button></DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
            {isAdmin && (
              <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
                <DialogTrigger render={<Button className="h-12 px-6 rounded-2xl font-bold gap-2 shadow-xl shadow-primary/20" />}>
                  <Plus size={18} />
                  New Task
                </DialogTrigger>
                <DialogContent className="rounded-3xl p-8 max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Create Task</DialogTitle>
                    <CardDescription>Assign a new objective to your team.</CardDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateTask} className="space-y-6 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Objective Title</Label>
                      <Input id="title" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} required className="rounded-xl h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="desc" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Details</Label>
                      <Input id="desc" value={newTask.description} onChange={(e) => setNewTask({...newTask, description: e.target.value})} className="rounded-xl h-12" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Priority</Label>
                        <Select value={newTask.priority} onValueChange={(v) => setNewTask({...newTask, priority: v})}>
                          <SelectTrigger className="rounded-xl h-12"><SelectValue /></SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="LOW">Low</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="HIGH">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Assignee</Label>
                        <Select value={newTask.assigned_to_id} onValueChange={(v) => setNewTask({...newTask, assigned_to_id: v})}>
                          <SelectTrigger className="rounded-xl h-12"><SelectValue placeholder="Select member" /></SelectTrigger>
                          <SelectContent className="rounded-xl">
                            {members.map(m => (
                              <SelectItem key={m.user_id} value={m.user_id}>{m.user.full_name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter className="pt-4"><Button type="submit" disabled={submitting} className="w-full h-12 rounded-2xl font-bold">{submitting ? <Loader2 className="animate-spin" /> : 'Create Objective'}</Button></DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </header>

      <Tabs defaultValue="tasks" className="space-y-8">
        <TabsList className="bg-white/50 backdrop-blur-sm p-1 rounded-2xl border border-gray-100 h-14 shadow-sm">
          <TabsTrigger value="tasks" className="rounded-xl h-12 px-8 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <LayoutDashboard className="mr-2 h-4 w-4" /> Tasks
          </TabsTrigger>
          <TabsTrigger value="members" className="rounded-xl h-12 px-8 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Users className="mr-2 h-4 w-4" /> Team
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="border-none bg-white/50 backdrop-blur-sm shadow-sm overflow-hidden rounded-3xl">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="font-bold text-xs uppercase tracking-widest pl-8 py-6">Objective</TableHead>
                    <TableHead className="font-bold text-xs uppercase tracking-widest">Assignee</TableHead>
                    <TableHead className="font-bold text-xs uppercase tracking-widest">Priority</TableHead>
                    <TableHead className="font-bold text-xs uppercase tracking-widest">Status</TableHead>
                    <TableHead className="text-right pr-8 font-bold text-xs uppercase tracking-widest">Modified</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="h-48 text-center text-muted-foreground italic">No objectives defined for this project yet.</TableCell></TableRow>
                  ) : (
                    tasks.map((task) => (
                      <TableRow key={task.id} className="group hover:bg-white/80 transition-colors border-b border-gray-100 last:border-0">
                        <TableCell className="pl-8 py-6">
                          <p className="font-bold text-gray-900 group-hover:text-primary transition-colors">{task.title}</p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{task.description}</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6 border border-white shadow-sm">
                              <AvatarFallback className="text-[10px] bg-primary/10 text-primary">{task.assigned_user?.full_name?.charAt(0) || '?'}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{task.assigned_user?.full_name || 'Unassigned'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={cn(
                            "text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-tighter",
                            task.priority === 'HIGH' ? "text-red-700 bg-red-100" : 
                            task.priority === 'MEDIUM' ? "text-amber-700 bg-amber-100" : "text-slate-600 bg-slate-100"
                          )}>
                            {task.priority}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Select 
                            disabled={!isAdmin && task.assigned_to_id !== user.id}
                            value={task.status} 
                            onValueChange={(v) => updateTaskStatus(task.id, v)}
                          >
                            <SelectTrigger className="w-[140px] h-9 rounded-xl border-none bg-gray-100/50 hover:bg-gray-100 group-hover:bg-white transition-colors">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              <SelectItem value="TODO">To Do</SelectItem>
                              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                              <SelectItem value="DONE">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right pr-8">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Today</span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((m) => (
              <Card key={m.id} className="card-hover border-none bg-white/50 backdrop-blur-sm shadow-sm rounded-3xl p-2">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-4">
                  <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                    <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold text-lg">
                      {m.user.full_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base font-bold truncate">{m.user.full_name}</CardTitle>
                    <CardDescription className="truncate text-xs">{m.user.email}</CardDescription>
                  </div>
                  <Badge className="ml-auto rounded-lg border-none font-bold text-[10px] px-2" variant={m.role === 'ADMIN' ? 'default' : 'secondary'}>
                    {m.role}
                  </Badge>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
