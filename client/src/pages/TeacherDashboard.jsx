import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const socket = io('http://localhost:5000');

export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  const [view, setView] = useState('majors'); // majors, classes, attendance
  const [majors, setMajors] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedMajor, setSelectedMajor] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchMajors();
    
    socket.on('new_attendance', (data) => {
      if (view === 'attendance' && selectedClass) {
         fetchAttendance(selectedClass.id);
      }
    });

    return () => socket.off('new_attendance');
  }, [view, selectedClass]);

  const fetchMajors = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/teacher/majors');
      setMajors(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMajorClick = async (major) => {
    setSelectedMajor(major);
    try {
      const res = await axios.get(`http://localhost:5000/api/teacher/majors/${major.id}/classes`);
      setClasses(res.data);
      setView('classes');
    } catch (error) {
      console.error(error);
    }
  };

  const handleClassClick = async (cls) => {
    setSelectedClass(cls);
    fetchAttendance(cls.id);
    setView('attendance');
  };

  const fetchAttendance = async (classId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/teacher/classes/${classId}/attendance`);
      setStudents(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const goBack = () => {
    if (view === 'attendance') setView('classes');
    else if (view === 'classes') setView('majors');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="px-6 py-4 text-white bg-blue-900 shadow-lg flex justify-between items-center">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center font-bold text-lg">
                G
            </div>
            <div>
                <h1 className="text-xl font-bold">Absensi26</h1>
                <p className="text-xs text-blue-200">Panel Guru: {user?.name}</p>
            </div>
        </div>
        <button onClick={logout} className="px-4 py-2 bg-red-500/80 hover:bg-red-600 rounded-lg text-sm font-semibold transition-colors">Logout</button>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {view !== 'majors' && (
          <button onClick={goBack} className="mb-6 flex items-center gap-2 text-blue-700 hover:text-blue-900 font-semibold transition-colors">
            <span className="text-xl">&larr;</span> Kembali
          </button>
        )}

        {view === 'majors' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Pilih Jurusan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {majors.map((major) => (
                <div 
                    key={major.id} 
                    onClick={() => handleMajorClick(major)}
                    className="group p-8 text-center bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all cursor-pointer border border-gray-100 hover:border-blue-200 hover:-translate-y-1"
                >
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <span className="text-2xl font-bold">{major.name.substring(0, 2)}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-700">{major.name}</h3>
                    <p className="text-gray-500 text-sm mt-1">Lihat Kelas &rarr;</p>
                </div>
                ))}
            </div>
          </div>
        )}

        {view === 'classes' && (
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Kelas di Jurusan {selectedMajor?.name}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {classes.map((cls) => (
                    <div 
                        key={cls.id} 
                        onClick={() => handleClassClick(cls)}
                        className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 cursor-pointer hover:border-blue-300 transition-all text-center"
                    >
                        <h3 className="text-lg font-bold text-gray-800">{cls.name}</h3>
                        <p className="text-xs text-gray-500 mt-2">Buka Absensi</p>
                    </div>
                    ))}
                </div>
            </div>
        )}

        {view === 'attendance' && (
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Absensi Kelas {selectedClass?.name}</h2>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                        ● Live Updates
                    </span>
                </div>
                
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600">Nama Siswa</th>
                                <th className="p-4 font-semibold text-gray-600">Status</th>
                                <th className="p-4 font-semibold text-gray-600">Waktu</th>
                                <th className="p-4 font-semibold text-gray-600">Catatan</th>
                                <th className="p-4 font-semibold text-gray-600">Foto</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {students.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500 italic">Belum ada data absensi hari ini.</td>
                                </tr>
                            ) : (
                                students.map((student) => (
                                    <tr key={student.id} className="hover:bg-blue-50/50 transition-colors">
                                        <td className="p-4 font-medium text-gray-900">{student.name}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                                student.status === 'hadir' ? 'bg-green-100 text-green-700' :
                                                student.status === 'sakit' ? 'bg-yellow-100 text-yellow-700' :
                                                student.status === 'izin' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-500 text-sm">
                                            {student.timestamp ? new Date(student.timestamp).toLocaleTimeString() : '-'}
                                        </td>
                                        <td className="p-4 text-gray-600 text-sm max-w-xs truncate">
                                            {student.notes || '-'}
                                        </td>
                                        <td className="p-4">
                                            {student.photo_url ? (
                                                <a 
                                                    href={`http://localhost:5000/${student.photo_url}`} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
                                                >
                                                    <span>📷</span> Lihat
                                                </a>
                                            ) : (
                                                <span className="text-gray-300">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
