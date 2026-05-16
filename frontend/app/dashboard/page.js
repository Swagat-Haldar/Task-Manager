"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Folder, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Users, 
  ArrowUpRight,
  Zap
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const res = await api.get('/dashboard/');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch stats', err);
    } finally {
      setFetching(false);
    }
  };

  if (loading || (user && fetching)) {
    return <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  if (!user) return null;

  const statCards = [
    { label: 'Active Projects', value: stats?.total_projects || 0, icon: Folder, color: 'text-blue-600', bg: 'bg-blue-500/10' },
    { label: 'Total Tasks', value: stats?.total_tasks || 0, icon: Zap, color: 'text-indigo-600', bg: 'bg-indigo-500/10' },
    { label: 'In Progress', value: stats?.in_progress_tasks || 0, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-500/10' },
    { label: 'Completed', value: stats?.done_tasks || 0, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-500/10' },
  ];

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-10">
      <header className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight">Workspace</h1>
          <p className="text-muted-foreground text-lg">Welcome back, {user.full_name.split(' ')[0]}. Here's what's happening today.</p>
        </div>
        <Link href="/projects">
          <Button size="lg" className="rounded-xl shadow-xl shadow-primary/20 gap-2">
            View All Projects <ArrowUpRight className="h-4 w-4" />
          </Button>
        </Link>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, idx) => (
          <Card key={idx} className="card-hover border-none bg-white/50 backdrop-blur-sm shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`${stat.bg} p-2.5 rounded-xl`}>
                  <stat.icon className={stat.color} size={22} />
                </div>
                {stat.label === 'Overdue' && stats?.overdue_tasks > 0 && (
                  <Badge variant="destructive" className="animate-pulse">Critical</Badge>
                )}
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-bold mt-1 tracking-tight">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none bg-white/50 backdrop-blur-sm shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between px-8 pt-8">
            <div>
              <CardTitle className="text-xl">Recent Tasks</CardTitle>
              <CardDescription>Latest updates from your projects</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="font-semibold text-xs uppercase tracking-wider">Task</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider">Status</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider">Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats?.recent_tasks?.length > 0 ? (
                  stats.recent_tasks.map((task) => (
                    <TableRow key={task.id} className="group hover:bg-gray-50/50 transition-colors border-b-gray-100 last:border-0">
                      <TableCell className="py-4">
                        <span className="font-medium text-gray-900 group-hover:text-primary transition-colors">{task.title}</span>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className="rounded-full px-2.5 py-0.5 border-none"
                          variant={
                            task.status === 'DONE' ? 'secondary' : 
                            task.status === 'IN_PROGRESS' ? 'warning' : 'outline'
                          }
                        >
                          {task.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={cn(
                          "text-xs font-semibold px-2 py-1 rounded-md",
                          task.priority === 'HIGH' ? "text-red-600 bg-red-50" : 
                          task.priority === 'MEDIUM' ? "text-amber-600 bg-amber-50" : "text-gray-500 bg-gray-50"
                        )}>
                          {task.priority}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={3} className="h-48 text-center text-muted-foreground">No tasks found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-none bg-indigo-600 text-white shadow-xl shadow-indigo-200">
          <CardHeader className="pt-8 px-8">
            <CardTitle className="text-xl">Progress Analytics</CardTitle>
            <CardDescription className="text-indigo-100">Overall completion status</CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8 space-y-8 mt-4">
            {[
              { label: 'Completed', value: stats?.done_tasks, color: 'bg-white', total: stats?.total_tasks },
              { label: 'In Progress', value: stats?.in_progress_tasks, color: 'bg-indigo-300', total: stats?.total_tasks },
              { label: 'To Do', value: stats?.todo_tasks, color: 'bg-indigo-800', total: stats?.total_tasks },
            ].map((item, i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-lg font-bold">{Math.round((item.value / item.total) * 100) || 0}%</span>
                </div>
                <div className="w-full bg-indigo-900/30 h-2 rounded-full overflow-hidden border border-white/10">
                  <div 
                    className={cn("h-full transition-all duration-1000", item.color)} 
                    style={{ width: `${(item.value / item.total) * 100 || 0}%` }}
                  ></div>
                </div>
              </div>
            ))}

            <div className="pt-6 border-t border-white/10 mt-8 flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <AlertCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold">{stats?.overdue_tasks || 0} Overdue Tasks</p>
                <p className="text-xs text-indigo-200">Needs immediate attention</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
