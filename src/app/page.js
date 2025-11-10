'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, Book, Sun, Moon, LogOut, User } from 'lucide-react';

const TEACHER_PASSWORD = "guru123";
const STUDENTS_CREDENTIALS = [
  { id: 1, name: 'Budi Santoso', password: 'budi123' },
  { id: 2, name: 'Siti Rahma', password: 'siti123' },
  { id: 3, name: 'Andi Wijaya', password: 'andi123' }
];

export default function PresensiGitar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [students, setStudents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [newStudent, setNewStudent] = useState('');
  const [newStudentPassword, setNewStudentPassword] = useState('');
  const [newSession, setNewSession] = useState({ meeting: '', date: '', material: '' });
  const [viewMode, setViewMode] = useState('table');

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) setDarkMode(savedDarkMode === 'true');

    const savedStudents = localStorage.getItem('students');
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    } else {
      setStudents(STUDENTS_CREDENTIALS);
      localStorage.setItem('students', JSON.stringify(STUDENTS_CREDENTIALS));
    }

    const savedSessions = localStorage.getItem('sessions');
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    } else {
      const initialSessions = [
        { id: 1, meeting: 1, date: '2025-11-03', material: 'Chord Dasar C, G, Am', attendance: { 1: 'hadir', 2: 'hadir', 3: 'izin' } },
        { id: 2, meeting: 2, date: '2025-11-10', material: 'Strumming Pattern & Rhythm', attendance: { 1: 'hadir', 2: 'alpha', 3: 'hadir' } }
      ];
      setSessions(initialSessions);
      localStorage.setItem('sessions', JSON.stringify(initialSessions));
    }

    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (students.length > 0) localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    if (sessions.length > 0) localStorage.setItem('sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const handleLogin = () => {
    setLoginError('');
    if (loginPassword === TEACHER_PASSWORD) {
      const user = { role: 'teacher', name: 'Guru' };
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return;
    }
    const student = students.find(s => s.password === loginPassword);
    if (student) {
      const user = { role: 'student', id: student.id, name: student.name };
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return;
    }
    setLoginError('Password salah!');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setLoginPassword('');
    localStorage.removeItem('currentUser');
  };

  const getStatusColor = (status) => {
    const colors = { hadir: 'bg-green-500', izin: 'bg-yellow-500', alpha: 'bg-red-500' };
    return colors[status] || 'bg-gray-300';
  };

  const addStudent = () => {
    if (newStudent.trim() && newStudentPassword.trim()) {
      const newId = Math.max(...students.map(s => s.id), 0) + 1;
      const newStudentObj = { id: newId, name: newStudent, password: newStudentPassword };
      setStudents([...students, newStudentObj]);
      setSessions(sessions.map(s => ({ ...s, attendance: { ...s.attendance, [newId]: 'hadir' } })));
      setNewStudent('');
      setNewStudentPassword('');
    }
  };

  const deleteStudent = (id) => {
    if (confirm('Yakin ingin hapus murid ini?')) {
      setStudents(students.filter(s => s.id !== id));
      setSessions(sessions.map(s => {
        const newAtt = { ...s.attendance };
        delete newAtt[id];
        return { ...s, attendance: newAtt };
      }));
    }
  };

  const addSession = () => {
    if (newSession.meeting && newSession.date && newSession.material) {
      const newId = Math.max(...sessions.map(s => s.id), 0) + 1;
      const attendance = {};
      students.forEach(s => { attendance[s.id] = 'hadir'; });
      setSessions([...sessions, { id: newId, meeting: parseInt(newSession.meeting), date: newSession.date, material: newSession.material, attendance }]);
      setNewSession({ meeting: '', date: '', material: '' });
    }
  };

  const updateAttendance = (sessionId, studentId, status) => {
    setSessions(sessions.map(s => s.id === sessionId ? { ...s, attendance: { ...s.attendance, [studentId]: status } } : s));
  };

  const deleteSession = (id) => {
    if (confirm('Yakin ingin hapus pertemuan ini?')) {
      setSessions(sessions.filter(s => s.id !== id));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const sortedSessions = [...sessions].sort((a, b) => a.meeting - b.meeting);
  const displayStudents = currentUser?.role === 'student' ? students.filter(s => s.id === currentUser.id) : students;

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-purple-50 to-blue-50'}`}>
        <div className={`w-full max-w-md p-8 rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🎸</div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Login Presensi Abraham Guitar Courses</h1>
            </div>
            <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}>
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
              <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleLogin()} placeholder="Masukkan password" className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`} />
            </div>
            {loginError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">{loginError}</div>}
            <button onClick={handleLogin} className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium">Login</button>
            {/* <div className={`text-xs mt-6 p-4 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
              <p className="font-semibold mb-2">Info Login:</p>
              <p>• Guru: <code className="bg-purple-600 text-white px-2 py-0.5 rounded">guru123</code></p>
              <p>• Budi: <code className="bg-blue-600 text-white px-2 py-0.5 rounded">budi123</code></p>
              <p>• Siti: <code className="bg-blue-600 text-white px-2 py-0.5 rounded">siti123</code></p>
              <p>• Andi: <code className="bg-blue-600 text-white px-2 py-0.5 rounded">andi123</code></p>
            </div> */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-3 sm:p-6 ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-purple-50 to-blue-50'}`}>
      <div className="max-w-7xl mx-auto">
        <div className={`rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🎸</div>
              <div>
                <h1 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Abraham Guitar Courses</h1>
                <p className={`text-sm flex items-center gap-2 mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <User size={14} /> {currentUser.name} ({currentUser.role === 'teacher' ? 'Guru' : 'Murid'})
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setDarkMode(!darkMode)} className={`p-2 sm:p-3 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}>
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button onClick={handleLogout} className="p-2 sm:p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2">
                <LogOut size={20} /> <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          {currentUser.role === 'teacher' && (
            <>
              <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
                <h2 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Tambah Murid</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input type="text" value={newStudent} onChange={(e) => setNewStudent(e.target.value)} placeholder="Nama murid" className={`px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`} />
                  <input type="text" value={newStudentPassword} onChange={(e) => setNewStudentPassword(e.target.value)} placeholder="Password" className={`px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`} />
                  <button onClick={addStudent} className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2">
                    <Plus size={18} /> Tambah
                  </button>
                </div>
              </div>

              <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                <h2 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Tambah Pertemuan</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  <input type="number" value={newSession.meeting} onChange={(e) => setNewSession({...newSession, meeting: e.target.value})} placeholder="Pertemuan ke-" className={`px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`} />
                  <input type="date" value={newSession.date} onChange={(e) => setNewSession({...newSession, date: e.target.value})} className={`px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`} />
                  <input type="text" value={newSession.material} onChange={(e) => setNewSession({...newSession, material: e.target.value})} placeholder="Materi" className={`px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`} />
                  <button onClick={addSession} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                    <Plus size={18} /> Tambah
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="mb-4 flex gap-2 lg:hidden">
            <button onClick={() => setViewMode('card')} className={`flex-1 py-2 px-4 rounded-lg font-medium ${viewMode === 'card' ? 'bg-purple-600 text-white' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>View Kartu</button>
            <button onClick={() => setViewMode('table')} className={`flex-1 py-2 px-4 rounded-lg font-medium ${viewMode === 'table' ? 'bg-purple-600 text-white' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>View Tabel</button>
          </div>

          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                  <th className="px-4 py-3 text-left sticky left-0 bg-purple-600 z-10">Nama</th>
                  {sortedSessions.map(s => (
                    <th key={s.id} className="px-4 py-3 text-center min-w-[180px]">
                      <div className="font-bold">Pertemuan {s.meeting}</div>
                      <div className="text-xs opacity-90">{formatDate(s.date)}</div>
                      <div className="text-xs opacity-90 italic">{s.material}</div>
                      {currentUser.role === 'teacher' && <button onClick={() => deleteSession(s.id)} className="mt-1 text-xs bg-red-500 px-2 py-1 rounded"><Trash2 size={12} className="inline" /> Hapus</button>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayStudents.map((st, i) => (
                  <tr key={st.id} className={darkMode ? (i % 2 === 0 ? 'bg-gray-700' : 'bg-gray-750') : (i % 2 === 0 ? 'bg-gray-50' : 'bg-white')}>
                    <td className={`px-4 py-3 font-medium border-b sticky left-0 z-10 ${darkMode ? 'text-gray-200 border-gray-600 bg-inherit' : 'text-gray-800 bg-inherit'}`}>
                      <div className="flex items-center justify-between">
                        <span>{st.name}</span>
                        {currentUser.role === 'teacher' && <button onClick={() => deleteStudent(st.id)} className="text-red-500"><Trash2 size={16} /></button>}
                      </div>
                    </td>
                    {sortedSessions.map(s => (
                      <td key={s.id} className={`px-4 py-3 text-center border-b ${darkMode ? 'border-gray-600' : ''}`}>
                        {currentUser.role === 'teacher' ? (
                          <select value={s.attendance[st.id] || 'hadir'} onChange={(e) => updateAttendance(s.id, st.id, e.target.value)} className={`w-full px-3 py-2 rounded-lg text-white font-medium cursor-pointer border-none ${getStatusColor(s.attendance[st.id])}`}>
                            <option value="hadir">Hadir</option>
                            <option value="izin">Izin</option>
                            <option value="alpha">Alpha</option>
                          </select>
                        ) : (
                          <span className={`inline-block px-4 py-2 rounded-lg text-white font-medium ${getStatusColor(s.attendance[st.id])}`}>
                            {s.attendance[st.id] === 'hadir' ? 'Hadir' : s.attendance[st.id] === 'izin' ? 'Izin' : 'Alpha'}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="lg:hidden">
            {viewMode === 'card' ? (
              <div className="space-y-4">
                {sortedSessions.map(s => (
                  <div key={s.id} className={`rounded-lg p-4 ${darkMode ? 'bg-gradient-to-r from-gray-700 to-gray-600' : 'bg-gradient-to-r from-purple-100 to-blue-100'}`}>
                    <div className="flex justify-between mb-3">
                      <div className="flex-1">
                        <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">Pertemuan {s.meeting}</span>
                        <div className={`flex items-center gap-2 text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}><Calendar size={14} /> {formatDate(s.date)}</div>
                        <div className={`flex items-start gap-2 text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}><Book size={14} className="mt-0.5" /> {s.material}</div>
                      </div>
                      {currentUser.role === 'teacher' && <button onClick={() => deleteSession(s.id)} className="text-red-500"><Trash2 size={18} /></button>}
                    </div>
                    <div className={`space-y-2 pt-3 border-t ${darkMode ? 'border-gray-500' : 'border-purple-200'}`}>
                      {displayStudents.map(st => (
                        <div key={st.id} className={`flex justify-between rounded-lg p-3 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                          <span className={`font-medium text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{st.name}</span>
                          {currentUser.role === 'teacher' ? (
                            <select value={s.attendance[st.id] || 'hadir'} onChange={(e) => updateAttendance(s.id, st.id, e.target.value)} className={`px-3 py-1.5 rounded-lg text-white text-sm font-medium cursor-pointer border-none ${getStatusColor(s.attendance[st.id])}`}>
                              <option value="hadir">Hadir</option>
                              <option value="izin">Izin</option>
                              <option value="alpha">Alpha</option>
                            </select>
                          ) : (
                            <span className={`px-3 py-1.5 rounded-lg text-white text-sm font-medium ${getStatusColor(s.attendance[st.id])}`}>
                              {s.attendance[st.id] === 'hadir' ? 'Hadir' : s.attendance[st.id] === 'izin' ? 'Izin' : 'Alpha'}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto -mx-4 px-4">
                <table className="w-full min-w-max">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                      <th className="px-3 py-2 text-xs text-left sticky left-0 bg-purple-600 z-10 min-w-[120px]">Nama</th>
                      {sortedSessions.map(s => (
                        <th key={s.id} className="px-3 py-2 text-center text-xs min-w-[140px]">
                          <div className="font-bold">P{s.meeting}</div>
                          <div className="text-xs opacity-90">{formatDate(s.date)}</div>
                          {currentUser.role === 'teacher' && <button onClick={() => deleteSession(s.id)} className="mt-1 text-xs bg-red-500 px-2 py-0.5 rounded">Hapus</button>}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {displayStudents.map((st, i) => (
                      <tr key={st.id} className={darkMode ? (i % 2 === 0 ? 'bg-gray-700' : 'bg-gray-750') : (i % 2 === 0 ? 'bg-gray-50' : 'bg-white')}>
                        <td className={`px-3 py-2 text-xs font-medium border-b sticky left-0 z-10 ${darkMode ? 'text-gray-200 border-gray-600 bg-inherit' : 'text-gray-800 bg-inherit'}`}>
                          <div className="flex flex-col gap-1">
                            <span>{st.name}</span>
                            {currentUser.role === 'teacher' && <button onClick={() => deleteStudent(st.id)} className="text-red-500 text-xs">Hapus</button>}
                          </div>
                        </td>
                        {sortedSessions.map(s => (
                          <td key={s.id} className={`px-2 py-2 text-center border-b ${darkMode ? 'border-gray-600' : ''}`}>
                            {currentUser.role === 'teacher' ? (
                              <select value={s.attendance[st.id] || 'hadir'} onChange={(e) => updateAttendance(s.id, st.id, e.target.value)} className={`w-full px-2 py-1.5 rounded text-white text-xs font-medium cursor-pointer border-none ${getStatusColor(s.attendance[st.id])}`}>
                                <option value="hadir">✓</option>
                                <option value="izin">I</option>
                                <option value="alpha">X</option>
                              </select>
                            ) : (
                              <span className={`inline-block px-2 py-1.5 rounded text-white text-xs font-medium ${getStatusColor(s.attendance[st.id])}`}>
                                {s.attendance[st.id] === 'hadir' ? '✓' : s.attendance[st.id] === 'izin' ? 'I' : 'X'}
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mt-6 flex gap-6 justify-center text-sm">
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-500 rounded"></div><span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Hadir</span></div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-yellow-500 rounded"></div><span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Izin</span></div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-500 rounded"></div><span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Alpha</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}