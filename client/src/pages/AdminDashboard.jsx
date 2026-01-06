import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('users'); // users, classes, majors, attendance
  const [data, setData] = useState([]);
  const [majors, setMajors] = useState([]);
  const [classes, setClasses] = useState([]);
  
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({});

  useEffect(() => {
    fetchData();
    if (['users', 'classes'].includes(activeTab)) fetchDropdowns();
  }, [activeTab]);

  const fetchDropdowns = async () => {
    try {
        const [m, c] = await Promise.all([
            axios.get('http://localhost:5000/api/admin/majors'),
            axios.get('http://localhost:5000/api/admin/classes')
        ]);
        setMajors(m.data);
        setClasses(c.data);
    } catch(e) { console.error(e); }
  }

  const fetchData = async () => {
    try {
      let endpoint = '';
      if (activeTab === 'users') endpoint = '/users';
      else if (activeTab === 'classes') endpoint = '/classes';
      else if (activeTab === 'majors') endpoint = '/majors';
      else if (activeTab === 'attendance') endpoint = '/attendance';
      
      const res = await axios.get(`http://localhost:5000/api/admin${endpoint}`);
      setData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Are you sure?')) return;
    try {
        await axios.delete(`http://localhost:5000/api/admin/${activeTab}/${id}`);
        fetchData();
    } catch(e) { alert('Failed to delete'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await axios.post(`http://localhost:5000/api/admin/${activeTab}`, newItem);
        setShowModal(false);
        setNewItem({});
        fetchData();
    } catch(e) { alert(e.response?.data?.message || 'Failed'); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-gray-900 text-white shadow-lg z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">A</div>
                    <span className="font-bold text-xl tracking-tight">Absensi26 Admin</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-gray-200">{user?.name}</p>
                        <p className="text-xs text-gray-400">Administrator</p>
                    </div>
                    <button onClick={logout} className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm font-medium">
                        Logout
                    </button>
                </div>
            </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-xl z-10 hidden md:flex flex-col">
            <div className="p-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Main Menu</p>
                <nav className="space-y-2">
                    {['users', 'classes', 'majors', 'attendance'].map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                                activeTab === tab 
                                ? 'bg-blue-50 text-blue-700 shadow-sm' 
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            <span className="capitalize">{tab}</span>
                        </button>
                    ))}
                </nav>
            </div>
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-auto bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 capitalize">{activeTab} Management</h2>
                        <p className="text-gray-500 text-sm mt-1">Manage your system data here.</p>
                    </div>
                    {activeTab !== 'attendance' && (
                        <button 
                            onClick={() => setShowModal(true)} 
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 font-medium"
                        >
                            <span>+</span> Add New
                        </button>
                    )}
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider w-16">No</th>
                                    {activeTab === 'users' && <><th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Name</th><th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Username</th><th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Role</th><th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Class/Major</th></>}
                                    {activeTab === 'classes' && <><th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Class Name</th><th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Major</th></>}
                                    {activeTab === 'majors' && <><th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Major Name</th></>}
                                    {activeTab === 'attendance' && <><th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Date</th><th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Name</th><th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Class</th><th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Status</th><th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Photo</th></>}
                                    {activeTab !== 'attendance' && <th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider text-right">Actions</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {data.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-gray-500 italic">No data available</td>
                                    </tr>
                                )}
                                {data.map((item, idx) => (
                                    <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="p-4 text-gray-500 font-medium">{idx + 1}</td>
                                        
                                        {activeTab === 'users' && (
                                            <>
                                                <td className="p-4 font-medium text-gray-900">{item.name}</td>
                                                <td className="p-4 text-gray-600">{item.username}</td>
                                                <td className="p-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                                        item.role === 'admin' ? 'bg-purple-100 text-purple-700' : 
                                                        item.role === 'teacher' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                                    }`}>
                                                        {item.role}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-gray-600">{item.Class?.name || item.Major?.name || '-'}</td>
                                            </>
                                        )}

                                        {activeTab === 'classes' && (
                                            <>
                                                <td className="p-4 font-medium text-gray-900">{item.name}</td>
                                                <td className="p-4 text-gray-600">{item.Major?.name}</td>
                                            </>
                                        )}

                                        {activeTab === 'majors' && (
                                            <>
                                                <td className="p-4 font-medium text-gray-900">{item.name}</td>
                                            </>
                                        )}

                                        {activeTab === 'attendance' && (
                                            <>
                                                <td className="p-4 text-gray-600">{item.date} <span className="text-xs text-gray-400 block">{new Date(item.timestamp).toLocaleTimeString()}</span></td>
                                                <td className="p-4 font-medium text-gray-900">{item.User?.name}</td>
                                                <td className="p-4 text-gray-600">{item.User?.Class?.name}</td>
                                                <td className="p-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                                        item.status === 'hadir' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    {item.photo_url && (
                                                        <a href={`http://localhost:5000${item.photo_url}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm font-medium">View Photo</a>
                                                    )}
                                                </td>
                                            </>
                                        )}

                                        {activeTab !== 'attendance' && (
                                            <td className="p-4 text-right">
                                                <button 
                                                    onClick={() => handleDelete(item.id)} 
                                                    className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all scale-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 capitalize">Add New {activeTab.slice(0, -1)}</h3>
                    <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {activeTab === 'users' && (
                        <>
                            <input className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Full Name" required onChange={e => setNewItem({...newItem, name: e.target.value})} />
                            <input className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Username" required onChange={e => setNewItem({...newItem, username: e.target.value})} />
                            <input className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" type="password" placeholder="Password" required onChange={e => setNewItem({...newItem, password: e.target.value})} />
                            <select className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white" required onChange={e => setNewItem({...newItem, role: e.target.value})}>
                                <option value="">Select Role</option>
                                <option value="student">Student</option>
                                <option value="teacher">Teacher</option>
                                <option value="admin">Admin</option>
                            </select>
                            {newItem.role === 'student' && (
                                <select className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white" required onChange={e => setNewItem({...newItem, class_id: e.target.value})}>
                                    <option value="">Select Class</option>
                                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            )}
                            {newItem.role === 'teacher' && (
                                <select className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white" onChange={e => setNewItem({...newItem, major_id: e.target.value})}>
                                    <option value="">Select Major (Optional)</option>
                                    {majors.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                </select>
                            )}
                        </>
                    )}

                    {activeTab === 'classes' && (
                        <>
                            <input className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Class Name (e.g. X RPL 1)" required onChange={e => setNewItem({...newItem, name: e.target.value})} />
                            <select className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white" required onChange={e => setNewItem({...newItem, major_id: e.target.value})}>
                                <option value="">Select Major</option>
                                {majors.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                        </>
                    )}

                    {activeTab === 'majors' && (
                        <>
                            <input className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Major Name (e.g. RPL)" required onChange={e => setNewItem({...newItem, name: e.target.value})} />
                        </>
                    )}

                    <div className="flex justify-end gap-3 mt-8">
                        <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors">Cancel</button>
                        <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 font-medium transition-all active:scale-95">Save Data</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}
