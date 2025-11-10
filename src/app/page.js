"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, Book, Sun, Moon, LogOut, User } from 'lucide-react';

const TEACHER_PASSWORD = "guru123";
const STUDENTS_CREDENTIALS = [
  { 
    id: 1, 
    name: 'Budi Santoso', 
    password: 'budi123', 
    meetings: [
      { id: 1, date: '2025-11-03', material: 'Chord Dasar C, G, Am' },
      { id: 2, date: '2025-11-10', material: 'Strumming Pattern & Rhythm' },
    ]
  },
  { 
    id: 2, 
    name: 'Siti Rahma', 
    password: 'siti123', 
    meetings: [
      { id: 1, date: '2025-11-05', material: 'Fingerpicking Basics' },
      { id: 2, date: '2025-11-12', material: 'Chord Progression' },
    ]
  },
  { 
    id: 3, 
    name: 'Andi Wijaya', 
    password: 'andi123', 
    meetings: [
      { id: 1, date: '2025-11-04', material: 'Blues Scale Introduction' },
    ]
  },
  { 
    id: 4, 
    name: 'Clement', 
    password: 'clement123', 
    meetings: [
      { id: 1, date: '2025-11-06', material: 'Basic Guitar Introduction' },
    ]
  }
];

export default function Page() {  // Changed from PresensiGitar to Page for Next.js convention
  // State untuk autentikasi
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // State untuk data murid dan jadwal pertemuan
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState('');
  const [newStudentPassword, setNewStudentPassword] = useState('');

  // Load data dari localStorage saat pertama kali
  useEffect(() => {
    try {
      const savedDarkMode = localStorage.getItem('darkMode');
      if (savedDarkMode) setDarkMode(savedDarkMode === 'true');

      const savedStudents = localStorage.getItem('students');
      if (savedStudents) {
        const parsedStudents = JSON.parse(savedStudents);
        // Ensure meetings array exists for each student
        const validatedStudents = parsedStudents.map(student => ({
          ...student,
          meetings: Array.isArray(student.meetings) ? student.meetings : []
        }));
        setStudents(validatedStudents);
      } else {
        setStudents(STUDENTS_CREDENTIALS);
        localStorage.setItem('students', JSON.stringify(STUDENTS_CREDENTIALS));
      }

      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
  }, []);  // Empty dependency array since this should only run once

  // Simpan data ke localStorage setiap kali `students` berubah
  useEffect(() => {
    try {
      if (students.length > 0) {
        localStorage.setItem('students', JSON.stringify(students));
      }
    } catch (error) {
      console.error('Error saving students to localStorage:', error);
    }
  }, [students]);  // Added students as dependency

  useEffect(() => {
    try {
      localStorage.setItem('darkMode', darkMode.toString());
    } catch (error) {
      console.error('Error saving darkMode to localStorage:', error);
    }
  }, [darkMode]);  // Added darkMode as dependency

  // Fungsi untuk login
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

  // Fungsi untuk logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setLoginPassword('');
    localStorage.removeItem('currentUser');
  };

  // Fungsi untuk menambah murid baru
  const addStudent = () => {
    if (newStudent.trim() && newStudentPassword.trim()) {
      const newId = Math.max(...students.map(s => s.id), 0) + 1;
      const newStudentObj = {
        id: newId,
        name: newStudent,
        password: newStudentPassword,
        meetings: [] // Pastikan `meetings` selalu terdefinisi
      };
      setStudents([...students, newStudentObj]);
      setNewStudent('');
      setNewStudentPassword('');
    }
  };

  // Fungsi untuk menambah pertemuan baru untuk murid tertentu
  const addMeeting = (studentId, newMeeting) => {
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.id === studentId
          ? {
              ...student,
              meetings: [
                ...(student.meetings || []), // Pastikan `meetings` tidak undefined
                {
                  id: (student.meetings ? student.meetings.length : 0) + 1,
                  date: newMeeting.date,
                  material: newMeeting.material
                }
              ]
            }
          : student
      )
    );
  };

  // Fungsi untuk menghapus murid
  const deleteStudent = (id) => {
    if (confirm('Yakin ingin menghapus murid ini?')) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  // Fungsi untuk menghapus pertemuan
  const deleteMeeting = (studentId, meetingId) => {
    if (confirm('Yakin ingin menghapus pertemuan ini?')) {
      setStudents(prevStudents =>
        prevStudents.map(student =>
          student.id === studentId
            ? {
                ...student,
                meetings: student.meetings.filter(meeting => meeting.id !== meetingId)
              }
            : student
        )
      );
    }
  };

  // Fungsi untuk memformat tanggal
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Jika belum login, tampilkan halaman login
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-purple-50 to-blue-50'}`}>
        <div className={`w-full max-w-md p-8 rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🎸</div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Login Presensi Abraham Guitar Courses
              </h1>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Password
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}  // Changed from onKeyPress to onKeyDown
                placeholder="Masukkan password"
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            {loginError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
                {loginError}
              </div>
            )}
            <button
              onClick={handleLogin}
              className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
            >
              Login
            </button>
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

  // Jika sudah login, tampilkan halaman utama
  return (
    <div className={`min-h-screen p-3 sm:p-6 ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-purple-50 to-blue-50'}`}>
      <div className="max-w-7xl mx-auto">
        <div className={`rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🎸</div>
              <div>
                <h1 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Abraham Guitar Courses
                </h1>
                <p className={`text-sm flex items-center gap-2 mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <User size={14} /> {currentUser.name} ({currentUser.role === 'teacher' ? 'Guru' : 'Murid'})
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 sm:p-3 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={handleLogout}
                className="p-2 sm:p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2"
              >
                <LogOut size={20} /> <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Fitur untuk Guru */}
          {currentUser.role === 'teacher' && (
            <>
              <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
                <h2 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Tambah Murid
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newStudent}
                    onChange={(e) => setNewStudent(e.target.value)}
                    placeholder="Nama murid"
                    className={`px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                  />
                  <input
                    type="text"
                    value={newStudentPassword}
                    onChange={(e) => setNewStudentPassword(e.target.value)}
                    placeholder="Password"
                    className={`px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                  />
                  <button
                    onClick={addStudent}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"
                  >
                    <Plus size={18} /> Tambah
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Daftar Murid dan Jadwal Pertemuan */}
          <div className="space-y-6">
            {students
              .filter(student => currentUser.role === 'teacher' || student.id === currentUser.id)
              .map((student) => (
                <div key={student.id} className={`p-4 sm:p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-md`}>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className={`text-xl font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      {student.name}
                    </h2>
                    {currentUser.role === 'teacher' && (
                      <button
                        onClick={() => deleteStudent(student.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 flex items-center gap-1"
                      >
                        <Trash2 size={16} /> Hapus
                      </button>
                    )}
                  </div>

                  {/* Daftar Pertemuan untuk Murid */}
                  <h3 className={`font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Jadwal Pertemuan:
                  </h3>
                  {(student.meetings || []).length === 0 ? (
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Belum ada jadwal pertemuan.
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {(student.meetings || []).map((meeting) => (
                        <li
                          key={meeting.id}
                          className={`flex justify-between items-center p-3 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-gray-50'}`}
                        >
                          <div>
                            <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                              Pertemuan {meeting.id}: {meeting.material}
                            </p>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {formatDate(meeting.date)}
                            </p>
                          </div>
                          {currentUser.role === 'teacher' && (
                            <button
                              onClick={() => deleteMeeting(student.id, meeting.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Form untuk menambah pertemuan baru (hanya untuk guru) */}
                  {currentUser.role === 'teacher' && (
                    <div className="mt-4">
                      <h3 className={`font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Tambah Pertemuan Baru
                      </h3>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="date"
                          id={`date-${student.id}`}
                          className={`px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                        />
                        <input
                          type="text"
                          id={`material-${student.id}`}
                          placeholder="Materi Pertemuan"
                          className={`px-4 py-2 rounded-lg border flex-1 ${darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'}`}
                        />
                        <button
                          onClick={() => {
                            const dateInput = document.getElementById(`date-${student.id}`);
                            const materialInput = document.getElementById(`material-${student.id}`);
                            if (dateInput.value && materialInput.value) {
                              addMeeting(student.id, {
                                date: dateInput.value,
                                material: materialInput.value
                              });
                              dateInput.value = "";
                              materialInput.value = "";
                            }
                          }}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                        >
                          <Plus size={18} /> Tambah
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
