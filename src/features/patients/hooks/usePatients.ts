import React, { useState, useMemo } from 'react';
import { usePatientStore } from '../../../stores/patientStore';
import { Patient, BPHistoryEntry } from '../../../types';

export function usePatients() {
  const { patients, addPatient, deletePatient, editPatient } = usePatientStore();
  const [filterText, setFilterText] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Form states inside new patient builder
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState<number | ''>('');
  const [newGender, setNewGender] = useState<'L' | 'P'>('L');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newStatus, setNewStatus] = useState<Patient['status']>('Normal');

  // Filter patients based on query
  const filtered = useMemo(() => {
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(filterText.toLowerCase()) ||
        p.id.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [patients, filterText]);

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newAge) {
      alert('Nama Lengkap dan Usia wajib diisi.');
      return;
    }

    // Default historical simulation
    const mockBP: BPHistoryEntry[] = [
      { date: 'Mei', systolic: 120, diastolic: 80 },
      { date: 'Jun', systolic: 122, diastolic: 81 },
      { date: 'Jul', systolic: 125, diastolic: 83 }
    ];

    const newPat: Patient = {
      id: `PT-2023-${String(patients.length + 1).padStart(3, '0')}`,
      name: newName,
      age: Number(newAge),
      gender: newGender,
      phone: newPhone || '0812-0000-0000',
      email: newEmail || 'pasien@gmail.com',
      address: newAddress || 'Jl. Raya Kebon Jeruk No. 5',
      status: newStatus,
      lastChecked: new Date().toISOString().split('T')[0],
      bpHistory: mockBP
    };

    addPatient(newPat);
    setIsAddOpen(false);

    // Reset Form
    setNewName('');
    setNewAge('');
    setNewPhone('');
    setNewEmail('');
    setNewAddress('');
    setNewStatus('Normal');
  };

  const handleDeletePatient = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data pasien ini secara permanen dari sistem?')) {
      deletePatient(id);
      if (selectedPatient?.id === id) {
        setSelectedPatient(null);
      }
    }
  };

  return {
    patients,
    filterText,
    setFilterText,
    isAddOpen,
    setIsAddOpen,
    selectedPatient,
    setSelectedPatient,
    newName,
    setNewName,
    newAge,
    setNewAge,
    newGender,
    setNewGender,
    newPhone,
    setNewPhone,
    newEmail,
    setNewEmail,
    newAddress,
    setNewAddress,
    newStatus,
    setNewStatus,
    filtered,
    handleCreatePatient,
    handleDeletePatient,
  };
}
