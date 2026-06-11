<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;
use App\Http\Resources\PatientResource;

class PatientController extends Controller
{
    /**
     * Display a listing of registered patients
     */
    public function index()
    {
        // Return latest patients
        $patients = Patient::orderBy('created_at', 'desc')->get();
        return PatientResource::collection($patients);
    }

    /**
     * Display a single patient record
     */
    public function show(string $id)
    {
        $patient = Patient::findOrFail($id);
        return new PatientResource($patient);
    }

    /**
     * Store a newly created patient in registry database
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'age' => 'required|integer|min:1',
            'gender' => 'required|string|in:L,P',
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
            'address' => 'nullable|string',
            'status' => 'required|string',
        ]);

        // Generate next PT id
        $count = Patient::count();
        $generatedId = 'PT-2023-' . str_pad($count + 1, 3, '0', STR_PAD_LEFT);

        // Standard simulated bp history entries
        $mockBPHistory = [
            ['date' => 'Mei', 'systolic' => 120, 'diastolic' => 80],
            ['date' => 'Jun', 'systolic' => 122, 'diastolic' => 81],
            ['date' => 'Jul', 'systolic' => 125, 'diastolic' => 83]
        ];

        $patient = Patient::create([
            'id' => $generatedId,
            'name' => $validated['name'],
            'age' => $validated['age'],
            'gender' => $validated['gender'],
            'phone' => $validated['phone'] ?? null,
            'email' => $validated['email'] ?? null,
            'address' => $validated['address'] ?? null,
            'status' => $validated['status'],
            'last_checked' => now()->toDateString(),
            'bp_history' => $mockBPHistory
        ]);

        \App\Models\Notification::logActivity(
            $request->user()->id,
            'Pasien Terdaftar',
            "Mendaftarkan pasien baru '{$patient->name}' (ID: {$patient->id}) ke dalam registri klinis.",
            'success'
        );

        return response()->json(new PatientResource($patient), 201);
    }

    /**
     * Update clinician demographics for patient
     */
    public function update(Request $request, string $id)
    {
        $patient = Patient::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'age' => 'sometimes|required|integer|min:1',
            'gender' => 'sometimes|required|string|in:L,P',
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
            'address' => 'nullable|string',
            'status' => 'sometimes|required|string',
        ]);

        $patient->update($validated);

        \App\Models\Notification::logActivity(
            $request->user()->id,
            'Data Pasien Diperbarui',
            "Memperbarui profil data klinis untuk pasien '{$patient->name}' (ID: {$patient->id}).",
            'info'
        );

        return new PatientResource($patient);
    }

    /**
     * Remove the specified patient from registry
     */
    public function destroy(Request $request, string $id)
    {
        $patient = Patient::findOrFail($id);
        
        \App\Models\Notification::logActivity(
            $request->user()->id,
            'Pasien Dihapus',
            "Menghapus data pasien '{$patient->name}' (ID: {$patient->id}) secara permanen dari registri.",
            'danger'
        );

        $patient->delete();

        return response()->json([
            'message' => 'Data pasien berhasil dihapus secara permanen.'
        ]);
    }
}
