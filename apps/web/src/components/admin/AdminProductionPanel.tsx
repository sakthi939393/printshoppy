'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Printer, CheckCircle, Clock, AlertTriangle, User } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export function AdminProductionPanel() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['print-queue'],
    queryFn: () => api.getPrintQueue({ page: 1, limit: 20 }),
    refetchInterval: 30000,
  });

  const updateStatus = useMutation({
    mutationFn: ({ jobId, status }: any) =>
      fetch(`/api/v1/production/jobs/${jobId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('access_token')}` },
        body: JSON.stringify({ status }),
      }).then(r => r.json()),
    onSuccess: () => {
      toast.success('Job status updated');
      queryClient.invalidateQueries({ queryKey: ['print-queue'] });
    },
  });

  const jobs = (data as any)?.jobs || [];

  const statuses = ['QUEUED', 'ASSIGNED', 'PRINTING', 'QUALITY_CHECK', 'COMPLETED', 'FAILED'];

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'In Queue', value: jobs.filter((j: any) => j.status === 'QUEUED').length, color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: Clock },
          { label: 'Printing', value: jobs.filter((j: any) => j.status === 'PRINTING').length, color: 'text-blue-400', bg: 'bg-blue-400/10', icon: Printer },
          { label: 'QC Check', value: jobs.filter((j: any) => j.status === 'QUALITY_CHECK').length, color: 'text-purple-400', bg: 'bg-purple-400/10', icon: AlertTriangle },
          { label: 'Completed', value: jobs.filter((j: any) => j.status === 'COMPLETED').length, color: 'text-green-400', bg: 'bg-green-400/10', icon: CheckCircle },
        ].map((stat, i) => (
          <div key={i} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-gray-400 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Jobs Table */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 text-xs uppercase bg-gray-700/50">
                <th className="px-4 py-3">Job / Order</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Assigned To</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="border-t border-gray-700">
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-gray-700 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                    <Printer className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p>No print jobs in queue</p>
                  </td>
                </tr>
              ) : jobs.map((job: any) => (
                <tr key={job.id} className="border-t border-gray-700 hover:bg-gray-700/30">
                  <td className="px-4 py-3">
                    <p className="text-primary-400 text-sm font-mono">#{job.order?.orderNumber}</p>
                    <p className="text-gray-400 text-xs">{new Date(job.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-300 text-sm">
                    {job.order?.items?.length || 0} items
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-bold ${job.priority >= 8 ? 'text-red-400' : job.priority >= 5 ? 'text-yellow-400' : 'text-gray-400'}`}>
                      P{job.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={job.status}
                      onChange={e => updateStatus.mutate({ jobId: job.id, status: e.target.value })}
                      className="text-xs px-2 py-1 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none"
                    >
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-gray-400 text-xs">{job.assignedTo || 'Unassigned'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => api.generatePrintFile(job.orderId).then(() => toast.success('Print file generated'))}
                      className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      Generate File
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
