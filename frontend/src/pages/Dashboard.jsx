
import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';

import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  PieChart,
  BarChart3,
  TrendingUp,
  Sparkles
} from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError('');

      const endpoint =
        user?.role === 'employee'
          ? '/dashboard/my-tasks'
          : '/dashboard';

      const res = await API.get(endpoint);

      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to load dashboard statistics'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardStats();
    }
  }, [user]);

  const byStatus = stats?.byStatus || {};

  const activeTasks =
    user?.role === 'employee'
      ? stats?.activeTasks || 0
      : (byStatus.todo || 0) +
        (byStatus.in_progress || 0) +
        (byStatus.review || 0);

  const totalTasks =
    stats?.totalTasks ?? stats?.totalAssigned ?? 0;

  const statusData = [
    {
      label: 'To Do',
      count: byStatus.todo || 0,
      color: 'bg-[#A68A78]'
    },
    {
      label: 'In Progress',
      count: byStatus.in_progress || 0,
      color: 'bg-[#C18A5B]'
    },
    {
      label: 'Under Review',
      count: byStatus.review || 0,
      color: 'bg-[#D9B895]'
    },
    {
      label: 'Done',
      count: byStatus.done || 0,
      color: 'bg-[#8C9B72]'
    }
  ];

  const priorityData = [
    {
      label: 'High Priority',
      count: stats?.byPriority?.high || 0,
      color: 'bg-[#B96A57]'
    },
    {
      label: 'Medium Priority',
      count: stats?.byPriority?.medium || 0,
      color: 'bg-[#C18A5B]'
    },
    {
      label: 'Low Priority',
      count: stats?.byPriority?.low || 0,
      color: 'bg-[#A68A78]'
    }
  ];

  const renderProgress = (count, total) => {
    const percentage =
      total > 0 ? Math.min((count / total) * 100, 100) : 0;

    return `${percentage}%`;
  };

  return (
    <div className="dashboard-page min-h-screen text-[#F5E9DC] transition-colors duration-300 pb-20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* Banner Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#21130F] via-[#40251D] to-[#21130F] border border-[#70432F] p-6 sm:p-8 mb-8 shadow-2xl text-[#F5E9DC]">

          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C18A5B]/15 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C18A5B]/15 text-[#D9B895] border border-[#C18A5B]/30 text-xs font-bold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                Executive Intelligence
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Analytics & Insights
              </h1>

              <p className="text-sm text-[#BBA795] mt-2 max-w-xl">
                Real-time aggregated task metrics, active workloads,
                priority breakdown, and overdue task alerts.
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-[#702F28]/30 border border-[#B96A57]/40 text-[#E6A092] text-sm">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-36 rounded-3xl bg-[#2B1913] border border-[#70432F]/40 animate-pulse"
              />
            ))}
          </div>
        ) : stats ? (
          <>
            {/* Summary Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

              {/* Total Tasks */}
              <div className="chocolate-card p-6 relative overflow-hidden group hover:border-[#C18A5B]/60 transition-all hover:-translate-y-1 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#BBA795] uppercase tracking-wider">
                      {user?.role === 'employee'
                        ? 'My Assigned Tasks'
                        : 'Total System Tasks'}
                    </p>

                    <h3 className="text-4xl font-black text-[#F5E9DC] mt-2">
                      {totalTasks}
                    </h3>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#C18A5B]/15 text-[#D9B895] border border-[#C18A5B]/30 group-hover:scale-110 transition-transform">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Active Tasks */}
              <div className="chocolate-card p-6 relative overflow-hidden group hover:border-[#C18A5B]/60 transition-all hover:-translate-y-1 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#BBA795] uppercase tracking-wider">
                      Active Workload
                    </p>

                    <h3 className="text-4xl font-black text-[#D9B895] mt-2">
                      {activeTasks}
                    </h3>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#C18A5B]/15 text-[#D9B895] border border-[#C18A5B]/30 group-hover:scale-110 transition-transform">
                    <Clock className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Completed Tasks */}
              <div className="chocolate-card p-6 relative overflow-hidden group hover:border-[#8C9B72]/60 transition-all hover:-translate-y-1 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#BBA795] uppercase tracking-wider">
                      Completed Tasks
                    </p>

                    <h3 className="text-4xl font-black text-[#A9BD8C] mt-2">
                      {user?.role === 'employee'
                        ? stats?.completedTasks || 0
                        : byStatus.done || 0}
                    </h3>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#8C9B72]/15 text-[#A9BD8C] border border-[#8C9B72]/30 group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Overdue Tasks */}
              <div className="chocolate-card p-6 relative overflow-hidden group hover:border-[#B96A57]/60 transition-all hover:-translate-y-1 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#BBA795] uppercase tracking-wider">
                      Overdue Alerts
                    </p>

                    <h3 className="text-4xl font-black text-[#D98B7C] mt-2">
                      {stats?.overdueTasks || 0}
                    </h3>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#B96A57]/15 text-[#D98B7C] border border-[#B96A57]/30 group-hover:scale-110 transition-transform">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>

            {/* Breakdown Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

              {/* Status Distribution */}
              <div className="chocolate-card p-6 shadow-lg">
                <h3 className="text-lg font-extrabold text-[#F5E9DC] mb-6 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-[#D9B895]" />
                  Status Distribution
                </h3>

                <div className="space-y-5">
                  {statusData.map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-xs font-bold mb-1.5">
                        <span className="text-[#D9B895]">
                          {item.label}
                        </span>

                        <span className="text-[#BBA795] font-extrabold">
                          {item.count} tasks
                        </span>
                      </div>

                      <div className="w-full bg-[#40251D] rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-2.5 ${item.color} rounded-full transition-all duration-700`}
                          style={{
                            width: renderProgress(item.count, totalTasks)
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Priority Breakdown */}
              {user?.role !== 'employee' && stats?.byPriority && (
                <div className="chocolate-card p-6 shadow-lg">
                  <h3 className="text-lg font-extrabold text-[#F5E9DC] mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#C18A5B]" />
                    Priority Allocation
                  </h3>

                  <div className="space-y-5">
                    {priorityData.map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between text-xs font-bold mb-1.5">
                          <span className="text-[#D9B895]">
                            {item.label}
                          </span>

                          <span className="text-[#BBA795] font-extrabold">
                            {item.count} tasks
                          </span>
                        </div>

                        <div className="w-full bg-[#40251D] rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-2.5 ${item.color} rounded-full transition-all duration-700`}
                            style={{
                              width: renderProgress(
                                item.count,
                                stats?.totalTasks || 0
                              )
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Employee Workload */}
            {user?.role !== 'employee' && stats?.employeeWorkload && (
              <div className="chocolate-card p-6 shadow-lg">
                <h3 className="text-lg font-extrabold text-[#F5E9DC] mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#D9B895]" />
                  Team Workload Distribution
                </h3>

                <div className="space-y-3">
                  {stats.employeeWorkload.length === 0 ? (
                    <p className="text-xs text-[#BBA795] italic">
                      No assigned employee workloads found.
                    </p>
                  ) : (
                    stats.employeeWorkload.map((emp) => (
                      <div
                        key={emp._id}
                        className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-[#40251D] border border-[#70432F]/40 hover:border-[#C18A5B]/60 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-tr from-[#70432F] to-[#C18A5B] flex items-center justify-center text-white font-bold text-xs shadow-sm">
                            {emp.name?.charAt(0).toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#F5E9DC]">
                              {emp.name}
                            </p>

                            <p className="text-[11px] text-[#BBA795] truncate">
                              {emp.email}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#C18A5B]/15 text-[#D9B895] border border-[#C18A5B]/30">
                            {emp.taskCount} Active Tasks
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="chocolate-card p-8 text-center">
            <p className="text-[#BBA795]">
              No dashboard statistics available.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};
