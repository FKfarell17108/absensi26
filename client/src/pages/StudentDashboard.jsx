import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Webcam from 'react-webcam';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [hasAbsence, setHasAbsence] = useState(false);
  const [status, setStatus] = useState('hadir');
  const [notes, setNotes] = useState('');
  const [photo, setPhoto] = useState(null);
  const webcamRef = useRef(null);

  useEffect(() => {
    checkTodayStatus();
  }, []);

  const checkTodayStatus = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/attendance/today');
      if (res.data) setHasAbsence(true);
    } catch (error) {
      console.error(error);
    }
  };

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setPhoto(imageSrc);
  };

  const retake = () => {
    setPhoto(null);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (status === 'hadir' && !photo) {
      alert('Wajib ambil foto untuk status hadir!');
      return;
    }

    const formData = new FormData();
    formData.append('status', status);
    formData.append('notes', notes);
    
    if (photo) {
      // Convert base64 to blob
      const res = await fetch(photo);
      const blob = await res.blob();
      formData.append('photo', blob, 'capture.jpg');
    }

    try {
      await axios.post('http://localhost:5000/api/attendance', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Absensi berhasil!');
      setHasAbsence(true);
      logout(); // Auto logout as requested
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal submit');
    }
  };

  if (hasAbsence) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-6">
        <div className="p-8 text-center bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✅</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Absensi Tercatat!</h1>
            <p className="mt-2 text-gray-600">Terima kasih, Anda sudah melakukan absensi hari ini.</p>
            <p className="text-sm text-gray-500 mt-1">{new Date().toLocaleDateString()}</p>
            <button 
                onClick={logout} 
                className="w-full px-4 py-3 mt-6 text-white bg-red-500 hover:bg-red-600 rounded-xl font-bold transition-colors shadow-lg"
            >
                Logout
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 bg-blue-600 text-white text-center relative">
          <h2 className="text-2xl font-bold">Halo, {user?.name}</h2>
          <p className="text-blue-100 text-sm">{user?.username} | Siswa</p>
          <button onClick={logout} className="absolute top-4 right-4 text-white/80 hover:text-white text-xs bg-white/20 px-2 py-1 rounded">Logout</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block mb-2 font-bold text-gray-700">Status Kehadiran</label>
            <select 
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="hadir">Hadir (Wajib Foto)</option>
              <option value="sakit">Sakit</option>
              <option value="izin">Izin</option>
            </select>
          </div>

          {(status === 'sakit' || status === 'izin') && (
            <div>
              <label className="block mb-2 font-bold text-gray-700">Keterangan (Wajib)</label>
              <textarea 
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                required
              />
            </div>
          )}

          {status === 'hadir' && (
            <div className="space-y-3">
              <label className="block font-bold text-gray-700">Ambil Foto</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-100 relative min-h-[200px] flex items-center justify-center">
                {photo ? (
                  <img src={photo} alt="Captured" className="w-full object-cover" />
                ) : (
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full"
                    videoConstraints={{ facingMode: "user" }}
                  />
                )}
              </div>
              
              <div className="flex gap-2">
                {!photo ? (
                    <button 
                        type="button" 
                        onClick={capture}
                        className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                        📸 Ambil Foto
                    </button>
                ) : (
                    <button 
                        type="button" 
                        onClick={retake}
                        className="flex-1 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-medium"
                    >
                        🔄 Foto Ulang
                    </button>
                )}
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="w-full py-4 mt-4 text-white bg-green-600 rounded-xl hover:bg-green-700 font-bold shadow-lg transition-transform active:scale-95"
          >
            Kirim Absensi
          </button>
        </form>
      </div>
    </div>
  );
}
