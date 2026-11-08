import React, { useState, useEffect } from 'react';
import {
  Users, UserCheck, Clock, XCircle, Eye, Bell, MessageSquare, Image as ImageIcon,
  Newspaper, Download, Printer, Search, Filter, RefreshCw, LogOut, Check, Trash2,
  Edit, Plus, X, AlertCircle, Shield, CheckCircle2, ChevronDown, ExternalLink
} from 'lucide-react';
import { apiService } from '../services/api.ts';
import { AdminNotification, AdminStats, ContactMessage, GalleryItem, Member, NewsEvent } from '../types.ts';
import { BRAND_ASSETS } from '../assets/branding.ts';

interface AdminDashboardProps {
  onLogout: () => void;
  onGoToSite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onGoToSite }) => {
  const [activeTab, setActiveTab] = useState<'members' | 'notifications' | 'contacts' | 'gallery' | 'news'>('members');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [membersList, setMembersList] = useState<Member[]>([]);
  const [notificationsList, setNotificationsList] = useState<AdminNotification[]>([]);
  const [contactsList, setContactsList] = useState<ContactMessage[]>([]);
  const [galleryList, setGalleryList] = useState<GalleryItem[]>([]);
  const [newsList, setNewsList] = useState<NewsEvent[]>([]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [editMember, setEditMember] = useState<Member | null>(null);
  const [showAddGalleryModal, setShowAddGalleryModal] = useState(false);
  const [showAddNewsModal, setShowAddNewsModal] = useState(false);
  const [showRosterModal, setShowRosterModal] = useState(false);

  // In-app Action Dialog & Toast Feedback
  const [actionDialog, setActionDialog] = useState<{
    type: 'approve' | 'reject' | 'delete' | 'deleteContact' | 'deleteGallery' | 'deleteNews';
    id: number;
    name?: string;
  } | null>(null);
  const [dialogRemarks, setDialogRemarks] = useState('');
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  // New gallery form
  const [newGallery, setNewGallery] = useState({
    title: '',
    category: 'Social Work',
    imageUrl: '',
    description: '',
    eventDate: new Date().toISOString().split('T')[0],
  });

  // New news form
  const [newNews, setNewNews] = useState({
    title: '',
    category: 'Social Work',
    summary: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    location: 'Lathore, Odisha',
    imageUrl: '',
  });

  useEffect(() => {
    loadAllDashboardData();
  }, []);

  const loadAllDashboardData = async () => {
    setLoading(true);
    try {
      const [s, m, n, c, g, news] = await Promise.all([
        apiService.getAdminStats(),
        apiService.getAdminMembers(),
        apiService.getNotifications(),
        apiService.getContacts(),
        apiService.getGallery(),
        apiService.getNews(),
      ]);
      setStats(s);
      setMembersList(m);
      setNotificationsList(n);
      setContactsList(c);
      setGalleryList(g);
      setNewsList(news);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Member Status actions: Direct one-click activation
  const handleDirectApprove = async (id: number, name?: string) => {
    try {
      await apiService.updateMemberStatus(id, 'APPROVED', 'Approved by LDA Governing Council.');
      showToast(`${name ? `"${name}"` : 'Member'} approved & marked Active!`, 'success');
      await loadAllDashboardData();
    } catch (err: any) {
      showToast(err.message || 'Failed to approve member', 'error');
    }
  };

  // Confirm In-App Action Dialog
  const handleConfirmActionDialog = async () => {
    if (!actionDialog) return;
    try {
      if (actionDialog.type === 'approve') {
        await apiService.updateMemberStatus(actionDialog.id, 'APPROVED', dialogRemarks || 'Approved by LDA Governing Council.');
        showToast('Member successfully approved & marked Active!', 'success');
      } else if (actionDialog.type === 'reject') {
        await apiService.updateMemberStatus(actionDialog.id, 'REJECTED', dialogRemarks || 'Application rejected by committee.');
        showToast('Member application marked as Rejected', 'error');
      } else if (actionDialog.type === 'delete') {
        await apiService.deleteMember(actionDialog.id);
        showToast('Member record permanently deleted', 'success');
        if (selectedMember?.id === actionDialog.id) setSelectedMember(null);
      } else if (actionDialog.type === 'deleteContact') {
        await apiService.deleteContact(actionDialog.id);
        setContactsList(prev => prev.filter(c => c.id !== actionDialog.id));
        showToast('Enquiry deleted successfully', 'success');
      } else if (actionDialog.type === 'deleteGallery') {
        await apiService.deleteGalleryItem(actionDialog.id);
        setGalleryList(prev => prev.filter(g => g.id !== actionDialog.id));
        showToast('Gallery photo deleted', 'success');
      } else if (actionDialog.type === 'deleteNews') {
        await apiService.deleteNewsEvent(actionDialog.id);
        setNewsList(prev => prev.filter(n => n.id !== actionDialog.id));
        showToast('News story deleted', 'success');
      }
      setActionDialog(null);
      setDialogRemarks('');
      await loadAllDashboardData();
    } catch (err: any) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const handleSaveEditMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editMember) return;
    try {
      await apiService.updateMember(editMember.id, editMember);
      setEditMember(null);
      showToast('Member details updated successfully!', 'success');
      await loadAllDashboardData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update member', 'error');
    }
  };

  // Notification actions
  const handleMarkNotificationRead = async (id: number) => {
    await apiService.markNotificationRead(id);
    setNotificationsList(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    if (stats) setStats({ ...stats, unreadNotificationsCount: Math.max(0, stats.unreadNotificationsCount - 1) });
    showToast('Notification marked as read');
  };

  const handleMarkAllNotificationsRead = async () => {
    await apiService.markAllNotificationsRead();
    setNotificationsList(prev => prev.map(n => ({ ...n, isRead: true })));
    if (stats) setStats({ ...stats, unreadNotificationsCount: 0 });
    showToast('All notifications marked as read');
  };

  const handleDeleteNotification = async (id: number) => {
    await apiService.deleteNotification(id);
    setNotificationsList(prev => prev.filter(n => n.id !== id));
    showToast('Notification deleted');
  };

  // Contact actions
  const handleDeleteContact = (id: number) => {
    setActionDialog({ type: 'deleteContact', id });
  };

  // Gallery actions
  const handleCreateGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.addGalleryItem(newGallery);
      setShowAddGalleryModal(false);
      setNewGallery({
        title: '',
        category: 'Social Work',
        imageUrl: '',
        description: '',
        eventDate: new Date().toISOString().split('T')[0],
      });
      showToast('New photo published to gallery!', 'success');
      await loadAllDashboardData();
    } catch (err: any) {
      showToast(err.message || 'Failed to add gallery photo', 'error');
    }
  };

  const handleDeleteGallery = (id: number) => {
    setActionDialog({ type: 'deleteGallery', id });
  };

  // News actions
  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.addNewsEvent(newNews);
      setShowAddNewsModal(false);
      setNewNews({
        title: '',
        category: 'Social Work',
        summary: '',
        content: '',
        date: new Date().toISOString().split('T')[0],
        location: 'Lathore, Odisha',
        imageUrl: '',
      });
      showToast('News announcement published!', 'success');
      await loadAllDashboardData();
    } catch (err: any) {
      showToast(err.message || 'Failed to add announcement', 'error');
    }
  };

  const handleDeleteNews = (id: number) => {
    setActionDialog({ type: 'deleteNews', id });
  };

  // Export to CSV / Excel
  const handleExportCSV = () => {
    if (membersList.length === 0) {
      showToast('No members available to export.', 'error');
      return;
    }
    showToast('Exporting members to CSV...');
    const headers = [
      'Registration ID',
      'Full Name',
      'Father Name',
      'Mobile Number',
      'Email',
      'DOB',
      'Gender',
      'Occupation',
      'Village',
      'District',
      'State',
      'PIN Code',
      'Full Address',
      'Status',
      'Remarks',
      'Registration Date',
    ];

    const rows = membersList.map(m => [
      `"${m.registrationId}"`,
      `"${m.fullName.replace(/"/g, '""')}"`,
      `"${m.fatherName.replace(/"/g, '""')}"`,
      `"${m.mobileNumber}"`,
      `"${m.email}"`,
      `"${m.dob}"`,
      `"${m.gender}"`,
      `"${m.occupation.replace(/"/g, '""')}"`,
      `"${m.village.replace(/"/g, '""')}"`,
      `"${m.district.replace(/"/g, '""')}"`,
      `"${m.state}"`,
      `"${m.pincode}"`,
      `"${m.fullAddress.replace(/"/g, '""')}"`,
      `"${m.status}"`,
      `"${(m.remarks || '').replace(/"/g, '""')}"`,
      `"${new Date(m.createdAt).toLocaleDateString('en-IN')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LDA_Members_List_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintMembersReport = () => {
    window.print();
  };

  // Filter members
  const filteredMembers = membersList.filter(m => {
    const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;
    const term = searchQuery.toLowerCase().trim();
    const matchesSearch = !term ||
      m.fullName.toLowerCase().includes(term) ||
      m.registrationId.toLowerCase().includes(term) ||
      m.mobileNumber.includes(term) ||
      m.village.toLowerCase().includes(term) ||
      m.district.toLowerCase().includes(term);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      
      {/* Admin Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <img
              src="https://s15.gifyu.com/images/bWJWy.png"
              alt="LDA"
              className="w-9 h-9 rounded-full border border-amber-400"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-wide font-serif">
                  LDA Admin Console
                </span>
                <span className="bg-amber-500 text-slate-950 font-extrabold text-[10px] px-1.5 py-0.2 rounded uppercase">
                  LDA Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Logged in: <code className="text-amber-300 font-mono">Liberal Democratic Association</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAllDashboardData}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={onGoToSite}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
              <span>Public Website</span>
            </button>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-900/80 hover:bg-red-800 text-xs font-bold text-white transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Metric Cards Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Total Members</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900">
              {stats?.totalMembers ?? 0}
            </div>
            <span className="text-[10px] text-slate-400">Central Roster</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs bg-amber-50/30 flex flex-col justify-between">
            <div className="flex items-center justify-between text-amber-700 text-xs font-semibold">
              <span>Pending Review</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="mt-2 text-2xl font-black text-amber-900">
              {stats?.pendingMembers ?? 0}
            </div>
            <span className="text-[10px] text-amber-600">Action Required</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs bg-emerald-50/30 flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-700 text-xs font-semibold">
              <span>Approved</span>
              <UserCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl font-black text-emerald-900">
              {stats?.approvedMembers ?? 0}
            </div>
            <span className="text-[10px] text-emerald-600">Active Members</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-rose-200 shadow-xs bg-rose-50/30 flex flex-col justify-between">
            <div className="flex items-center justify-between text-rose-700 text-xs font-semibold">
              <span>Rejected</span>
              <XCircle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="mt-2 text-2xl font-black text-rose-900">
              {stats?.rejectedMembers ?? 0}
            </div>
            <span className="text-[10px] text-rose-500">Applications</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-xs bg-blue-50/30 flex flex-col justify-between">
            <div className="flex items-center justify-between text-blue-700 text-xs font-semibold">
              <span>Website Visitors</span>
              <Eye className="w-4 h-4 text-blue-600" />
            </div>
            <div className="mt-2 text-2xl font-black text-blue-900">
              {stats?.visitorCount ?? 1248}
            </div>
            <span className="text-[10px] text-blue-500">Live Counter</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-indigo-200 shadow-xs bg-indigo-50/30 flex flex-col justify-between">
            <div className="flex items-center justify-between text-indigo-700 text-xs font-semibold">
              <span>Unread Alerts</span>
              <Bell className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="mt-2 text-2xl font-black text-indigo-900">
              {stats?.unreadNotificationsCount ?? 0}
            </div>
            <span className="text-[10px] text-indigo-500">Admin Dispatch</span>
          </div>

        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('members')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'members'
                ? 'bg-blue-800 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Members Directory ({membersList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer relative ${
              activeTab === 'notifications'
                ? 'bg-blue-800 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
            {(stats?.unreadNotificationsCount || 0) > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {stats?.unreadNotificationsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'contacts'
                ? 'bg-blue-800 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Enquiries ({contactsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'gallery'
                ? 'bg-blue-800 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Manage Gallery ({galleryList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('news')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'news'
                ? 'bg-blue-800 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Newspaper className="w-4 h-4" />
            <span>News & Events ({newsList.length})</span>
          </button>
        </div>

        {/* TAB 1: MEMBERS DIRECTORY */}
        {activeTab === 'members' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            
            {/* Search, Filter & Export Toolbar */}
            <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
              
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by ID, name, phone, village..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-hidden"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="PENDING">Pending Review</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Export Buttons */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <button
                  onClick={handleExportCSV}
                  className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                  title="Download CSV spreadsheet"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Excel/CSV</span>
                </button>

                <button
                  onClick={() => setShowRosterModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                  title="View and print official member roster report"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Roster (PDF)</span>
                </button>
              </div>

            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Reg ID</th>
                    <th className="py-3 px-4">Applicant</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                        No member records match the criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((m) => (
                      <tr key={m.id} className="hover:bg-blue-50/40 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-blue-900">
                          {m.registrationId}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{m.fullName}</div>
                          <div className="text-[11px] text-slate-500">S/o: {m.fatherName} • {m.occupation}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-mono text-slate-800">{m.mobileNumber}</div>
                          <div className="text-[11px] text-slate-500">{m.email}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div>{m.village}</div>
                          <div className="text-[11px] text-slate-500">{m.district}, {m.pincode}</div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">
                          {new Date(m.createdAt).toLocaleDateString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              m.status === 'APPROVED'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : m.status === 'PENDING'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-rose-100 text-rose-800 border border-rose-300'
                            }`}
                          >
                            {m.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedMember(m)}
                              className="p-1.5 rounded-md bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 transition cursor-pointer"
                              title="View Member Application Slip"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {m.status !== 'APPROVED' ? (
                              <button
                                onClick={() => handleDirectApprove(m.id, m.fullName)}
                                className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs transition cursor-pointer"
                                title="Click to Approve & Make Active"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Active</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setActionDialog({ type: 'reject', id: m.id, name: m.fullName });
                                  setDialogRemarks('Application revoked or placed on hold.');
                                }}
                                className="p-1.5 rounded-md bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 transition cursor-pointer"
                                title="Revoke Approval / Mark Inactive"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {m.status === 'PENDING' && (
                              <button
                                onClick={() => {
                                  setActionDialog({ type: 'reject', id: m.id, name: m.fullName });
                                  setDialogRemarks('Incomplete address details or verification mismatch.');
                                }}
                                className="p-1.5 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 transition cursor-pointer"
                                title="Reject Application"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            )}

                            <button
                              onClick={() => setEditMember(m)}
                              className="p-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                              title="Edit Member Information"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => setActionDialog({ type: 'delete', id: m.id, name: m.fullName })}
                              className="p-1.5 rounded-md bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-700 transition cursor-pointer"
                              title="Delete Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 2: NOTIFICATIONS CENTER */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold font-serif text-slate-900">
                  Private Admin Notification Dispatch
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time alerts for member registrations, contact petitions, and application status audits.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleMarkAllNotificationsRead}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-800 hover:bg-blue-100 text-xs font-bold transition"
                >
                  Mark All as Read
                </button>
              </div>
            </div>

            {/* Email dispatch indicator */}
            <div className="p-3 bg-blue-900/5 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-700" />
                <span>Backend Email Notification Dispatcher: Active (Alerts synced to Admin's registered mailbox)</span>
              </span>
              <span className="text-[11px] font-mono text-emerald-700 font-bold">SMTP / Queue LIVE</span>
            </div>

            {/* Notifications List */}
            <div className="space-y-3 pt-2">
              {notificationsList.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No notifications recorded.
                </div>
              ) : (
                notificationsList.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 rounded-xl border transition flex items-start justify-between gap-4 ${
                      notif.isRead
                        ? 'bg-slate-50/60 border-slate-200 text-slate-600'
                        : 'bg-blue-50/70 border-blue-200 text-slate-900 shadow-xs'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold font-serif">
                          {notif.title}
                        </span>
                        {!notif.isRead && (
                          <span className="w-2 h-2 rounded-full bg-blue-600" />
                        )}
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(notif.createdAt).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {!notif.isRead && (
                        <button
                          onClick={() => handleMarkNotificationRead(notif.id)}
                          className="text-[11px] font-bold text-blue-700 hover:underline"
                        >
                          Mark Read
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteNotification(notif.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Delete notification"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {/* TAB 3: CONTACT ENQUIRIES */}
        {activeTab === 'contacts' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="text-lg font-bold font-serif text-slate-900 pb-2 border-b border-slate-200">
              Submitted Citizen Petitions & Inquiries
            </h3>

            {contactsList.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No contact submissions found.
              </div>
            ) : (
              <div className="space-y-4">
                {contactsList.map((c) => (
                  <div key={c.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{c.name}</span>
                        <span className="text-xs text-slate-500 font-mono">{c.email}</span>
                        {c.mobile && <span className="text-xs text-slate-500 font-mono">• {c.mobile}</span>}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-slate-400">
                          {new Date(c.createdAt).toLocaleString('en-IN')}
                        </span>
                        <button
                          onClick={() => handleDeleteContact(c.id)}
                          className="text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="text-xs font-semibold text-blue-900">
                      Subject: {c.subject}
                    </div>
                    <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                      {c.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: GALLERY MANAGEMENT */}
        {activeTab === 'gallery' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold font-serif text-slate-900">
                  Manage Website Photo Gallery
                </h3>
                <p className="text-xs text-slate-500">
                  Upload and publish ground activities, free camps, and welfare programs.
                </p>
              </div>

              <button
                onClick={() => setShowAddGalleryModal(true)}
                className="px-4 py-2 rounded-xl bg-blue-800 hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Photo</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleryList.map((item) => (
                <div key={item.id} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <div className="h-40 w-full overflow-hidden bg-slate-200 relative">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    <button
                      onClick={() => handleDeleteGallery(item.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white shadow-md hover:bg-red-700 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="p-3 space-y-1">
                    <span className="text-[10px] font-bold text-blue-700 uppercase">{item.category}</span>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: NEWS MANAGEMENT */}
        {activeTab === 'news' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold font-serif text-slate-900">
                  Manage News & Events
                </h3>
                <p className="text-xs text-slate-500">
                  Publish press releases, health camp notices, and welfare distributions.
                </p>
              </div>

              <button
                onClick={() => setShowAddNewsModal(true)}
                className="px-4 py-2 rounded-xl bg-blue-800 hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Publish Announcement</span>
              </button>
            </div>

            <div className="space-y-3">
              {newsList.map((ev) => (
                <div key={ev.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                        {ev.category}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">{ev.date} • {ev.location}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{ev.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-1">{ev.summary}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteNews(ev.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* MEMBER DETAILS MODAL */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                {selectedMember.profilePhotoUrl ? (
                  <img src={selectedMember.profilePhotoUrl} alt={selectedMember.fullName} className="w-full h-full object-cover" />
                ) : (
                  <Users className="w-8 h-8 m-4 text-slate-400" />
                )}
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-blue-800 block">
                  {selectedMember.registrationId}
                </span>
                <h3 className="text-xl font-bold font-serif text-slate-900">
                  {selectedMember.fullName}
                </h3>
                <span className="text-xs text-slate-500 font-semibold">
                  Status: <strong className="text-blue-900 uppercase">{selectedMember.status}</strong>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold">Father's Name</span>
                <span className="text-slate-900 font-bold">{selectedMember.fatherName}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Mobile Number</span>
                <span className="text-slate-900 font-bold">{selectedMember.mobileNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Email</span>
                <span className="text-slate-900">{selectedMember.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Date of Birth / Gender</span>
                <span className="text-slate-900">{selectedMember.dob} ({selectedMember.gender})</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Occupation</span>
                <span className="text-slate-900">{selectedMember.occupation}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Village & District</span>
                <span className="text-slate-900">{selectedMember.village}, {selectedMember.district}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block font-semibold">Full Address</span>
                <span className="text-slate-900">{selectedMember.fullAddress}, PIN: {selectedMember.pincode}</span>
              </div>
              <div className="col-span-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block font-bold mb-1">Council Remarks</span>
                <span className="text-slate-800 italic">{selectedMember.remarks || 'None'}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setSelectedMember(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MEMBER MODAL */}
      {editMember && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold font-serif text-slate-900">
                Edit Member: {editMember.registrationId}
              </h3>
              <button onClick={() => setEditMember(null)}>
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSaveEditMember} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editMember.fullName}
                  onChange={(e) => setEditMember({ ...editMember, fullName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Father's Name</label>
                <input
                  type="text"
                  value={editMember.fatherName}
                  onChange={(e) => setEditMember({ ...editMember, fatherName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile</label>
                  <input
                    type="tel"
                    value={editMember.mobileNumber}
                    onChange={(e) => setEditMember({ ...editMember, mobileNumber: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editMember.email}
                    onChange={(e) => setEditMember({ ...editMember, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Village</label>
                  <input
                    type="text"
                    value={editMember.village}
                    onChange={(e) => setEditMember({ ...editMember, village: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">District</label>
                  <input
                    type="text"
                    value={editMember.district}
                    onChange={(e) => setEditMember({ ...editMember, district: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Status</label>
                <select
                  value={editMember.status}
                  onChange={(e) => setEditMember({ ...editMember, status: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Remarks</label>
                <input
                  type="text"
                  value={editMember.remarks || ''}
                  onChange={(e) => setEditMember({ ...editMember, remarks: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditMember(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-800 text-white rounded-lg font-bold hover:bg-blue-900"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD GALLERY MODAL */}
      {showAddGalleryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-base font-bold text-slate-900 font-serif">Add Gallery Photo</h3>
              <button onClick={() => setShowAddGalleryModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleCreateGallery} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Photo Title *</label>
                <input
                  type="text"
                  value={newGallery.title}
                  onChange={(e) => setNewGallery({ ...newGallery, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g. Health Camp at Lathore"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Category *</label>
                <select
                  value={newGallery.category}
                  onChange={(e) => setNewGallery({ ...newGallery, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="Social Work">Social Work</option>
                  <option value="Community Events">Community Events</option>
                  <option value="Education Activities">Education Activities</option>
                  <option value="Health Awareness">Health Awareness</option>
                  <option value="Public Welfare Programmes">Public Welfare Programmes</option>
                </select>
              </div>
              <div>
                <label className="block font-bold mb-1">Image URL *</label>
                <input
                  type="url"
                  value={newGallery.imageUrl}
                  onChange={(e) => setNewGallery({ ...newGallery, imageUrl: e.target.value })}
                  required
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Description</label>
                <textarea
                  value={newGallery.description}
                  onChange={(e) => setNewGallery({ ...newGallery, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={2}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddGalleryModal(false)}
                  className="px-3 py-1.5 bg-slate-100 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-800 text-white rounded-lg font-bold hover:bg-blue-900"
                >
                  Publish Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD NEWS MODAL */}
      {showAddNewsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-base font-bold text-slate-900 font-serif">Publish News / Event</h3>
              <button onClick={() => setShowAddNewsModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleCreateNews} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Title *</label>
                <input
                  type="text"
                  value={newNews.title}
                  onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">Category *</label>
                  <select
                    value={newNews.category}
                    onChange={(e) => setNewNews({ ...newNews, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="Health Awareness">Health Awareness</option>
                    <option value="Education Support">Education Support</option>
                    <option value="Social Work">Social Work</option>
                    <option value="Community Meet">Community Meet</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Date *</label>
                  <input
                    type="date"
                    value={newNews.date}
                    onChange={(e) => setNewNews({ ...newNews, date: e.target.value })}
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold mb-1">Venue / Location *</label>
                <input
                  type="text"
                  value={newNews.location}
                  onChange={(e) => setNewNews({ ...newNews, location: e.target.value })}
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Summary (Short) *</label>
                <input
                  type="text"
                  value={newNews.summary}
                  onChange={(e) => setNewNews({ ...newNews, summary: e.target.value })}
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Full Details *</label>
                <textarea
                  value={newNews.content}
                  onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddNewsModal(false)}
                  className="px-3 py-1.5 bg-slate-100 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-800 text-white rounded-lg font-bold hover:bg-blue-900"
                >
                  Publish Story
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-2xl border text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top duration-200 ${
            toast.type === 'success'
              ? 'bg-emerald-900 border-emerald-700 text-white shadow-emerald-950/40'
              : 'bg-rose-900 border-rose-700 text-white shadow-rose-950/40'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-300" />
          )}
          <span>{toast.text}</span>
        </div>
      )}

      {/* In-App Action Confirmation Dialog */}
      {actionDialog && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900 font-serif">
                {actionDialog.type === 'approve' && 'Approve & Activate Member'}
                {actionDialog.type === 'reject' && 'Reject Member Application'}
                {actionDialog.type === 'delete' && 'Delete Member Record'}
                {actionDialog.type === 'deleteContact' && 'Delete Citizen Enquiry'}
                {actionDialog.type === 'deleteGallery' && 'Delete Gallery Photo'}
                {actionDialog.type === 'deleteNews' && 'Delete News Story'}
              </h3>
              <button
                onClick={() => setActionDialog(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              {actionDialog.type === 'approve' && (
                <>
                  <p>
                    Are you sure you want to approve and activate registration for{' '}
                    <strong>{actionDialog.name}</strong>?
                  </p>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Approval Remarks</label>
                    <input
                      type="text"
                      value={dialogRemarks}
                      onChange={(e) => setDialogRemarks(e.target.value)}
                      placeholder="e.g. Approved by LDA Governing Council."
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </>
              )}

              {actionDialog.type === 'reject' && (
                <>
                  <p>
                    Enter reason for rejecting application of{' '}
                    <strong>{actionDialog.name}</strong>:
                  </p>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Rejection Reason</label>
                    <input
                      type="text"
                      value={dialogRemarks}
                      onChange={(e) => setDialogRemarks(e.target.value)}
                      placeholder="e.g. Incomplete address details or verification mismatch."
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </>
              )}

              {actionDialog.type === 'delete' && (
                <p>
                  Are you sure you want to permanently delete the member record for{' '}
                  <strong className="text-rose-700">{actionDialog.name}</strong>? This action cannot be undone.
                </p>
              )}

              {actionDialog.type === 'deleteContact' && (
                <p>Are you sure you want to permanently delete this citizen enquiry message?</p>
              )}

              {actionDialog.type === 'deleteGallery' && (
                <p>Are you sure you want to delete this photo from the website gallery?</p>
              )}

              {actionDialog.type === 'deleteNews' && (
                <p>Are you sure you want to delete this news/event announcement?</p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setActionDialog(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmActionDialog}
                className={`px-5 py-2 rounded-lg text-white text-xs font-bold ${
                  actionDialog.type === 'approve'
                    ? 'bg-emerald-700 hover:bg-emerald-800'
                    : 'bg-rose-700 hover:bg-rose-800'
                }`}
              >
                {actionDialog.type === 'approve' ? 'Confirm Approval' : 'Confirm Delete / Action'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Printable Member Roster Preview Modal */}
      {showRosterModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <img
                  src="https://s15.gifyu.com/images/bWJWy.png"
                  alt="LDA"
                  className="w-10 h-10 rounded-full border border-amber-400"
                />
                <div>
                  <h3 className="text-lg font-bold font-serif text-slate-900">
                    Liberal Democratic Association (LDA)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Official Central Membership Directory & Roster
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Document</span>
                </button>
                <button
                  onClick={() => setShowRosterModal(false)}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-3">
              <div className="flex justify-between text-[11px] text-slate-500 pb-2 border-b">
                <span>Total Active & Registered Members: {membersList.length}</span>
                <span>Date: {new Date().toLocaleDateString('en-IN')}</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-bold uppercase border-b">
                      <th className="py-2 px-3">Reg ID</th>
                      <th className="py-2 px-3">Name</th>
                      <th className="py-2 px-3">Parent's Name</th>
                      <th className="py-2 px-3">Mobile</th>
                      <th className="py-2 px-3">Village / District</th>
                      <th className="py-2 px-3">Occupation</th>
                      <th className="py-2 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {membersList.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-mono font-bold text-blue-900">{m.registrationId}</td>
                        <td className="py-2 px-3 font-bold text-slate-900">{m.fullName}</td>
                        <td className="py-2 px-3">{m.fatherName}</td>
                        <td className="py-2 px-3 font-mono">{m.mobileNumber}</td>
                        <td className="py-2 px-3">{m.village}, {m.district}</td>
                        <td className="py-2 px-3">{m.occupation}</td>
                        <td className="py-2 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              m.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {m.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
