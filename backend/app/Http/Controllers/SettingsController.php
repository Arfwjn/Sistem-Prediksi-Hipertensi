<?php

namespace App\Http\Controllers;

use App\Models\ModelConfig;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Hash;
use App\Http\Resources\DoctorProfileResource;

class SettingsController extends Controller
{
    /**
     * Get active AI algorithm hyperparameters config
     */
    public function show()
    {
        $config = ModelConfig::first();
        if (!$config) {
            $config = ModelConfig::create([
                'active_model' => 'Random Forest',
                'rf_trees' => 100,
                'rf_max_depth' => 12,
                'dt_min_samples' => 4,
                'lr_iterations' => 200,
                'confidence_factor' => 0.98
            ]);
        }

        return response()->json([
            'activeModel' => $config->active_model,
            'rfTrees' => (int)$config->rf_trees,
            'rfMaxDepth' => (int)$config->rf_max_depth,
            'dtMinSamples' => (int)$config->dt_min_samples,
            'lrIterations' => (int)$config->lr_iterations,
            'confidenceFactor' => (float)$config->confidence_factor,
        ]);
    }

    /**
     * Update active AI algorithm weights/hyperparameters
     */
    public function updateConfig(Request $request)
    {
        $config = ModelConfig::first();
        if (!$config) {
            $config = new ModelConfig();
        }

        $validated = $request->validate([
            'activeModel' => 'sometimes|required|string',
            'rfTrees' => 'sometimes|required|integer|min:50|max:250',
            'rfMaxDepth' => 'sometimes|required|integer|min:4|max:20',
            'dtMinSamples' => 'sometimes|required|integer|min:2|max:10',
            'lrIterations' => 'sometimes|required|integer|min:50|max:1000',
            'confidenceFactor' => 'sometimes|required|numeric|min:0.80|max:1.10',
        ]);

        // Map camelCase fields to snake_case attributes
        if (isset($validated['activeModel'])) {
            $config->active_model = $validated['activeModel'];
        }
        if (isset($validated['rfTrees'])) {
            $config->rf_trees = $validated['rfTrees'];
        }
        if (isset($validated['rfMaxDepth'])) {
            $config->rf_max_depth = $validated['rfMaxDepth'];
        }
        if (isset($validated['dtMinSamples'])) {
            $config->dt_min_samples = $validated['dtMinSamples'];
        }
        if (isset($validated['lrIterations'])) {
            $config->lr_iterations = $validated['lrIterations'];
        }
        if (isset($validated['confidenceFactor'])) {
            $config->confidence_factor = $validated['confidenceFactor'];
        }

        $config->save();

        \App\Models\Notification::logActivity(
            $request->user()->id,
            'Parameter Model Diubah',
            "Mengonfigurasi model klasifikasi aktif menjadi '{$config->active_model}' dengan parameter baru (Trees: {$config->rf_trees}, Depth: {$config->rf_max_depth}).",
            'warning'
        );

        return response()->json([
            'activeModel' => $config->active_model,
            'rfTrees' => (int)$config->rf_trees,
            'rfMaxDepth' => (int)$config->rf_max_depth,
            'dtMinSamples' => (int)$config->dt_min_samples,
            'lrIterations' => (int)$config->lr_iterations,
            'confidenceFactor' => (float)$config->confidence_factor,
        ]);
    }

    /**
     * Update authenticated clinician user profile settings
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'specialty' => 'required|string|max:255',
            'hospital' => 'nullable|string|max:255',
            'avatarUrl' => 'nullable|string',
        ]);

        $user->update([
            'name' => $validated['name'],
            'specialty' => $validated['specialty'],
            'hospital' => $validated['hospital'] ?? 'Heart & Vascular Center',
            'avatar_url' => $validated['avatarUrl'] ?? $user->avatar_url,
        ]);

        \App\Models\Notification::logActivity(
            $user->id,
            'Profil Dokter Diperbarui',
            "Memperbarui data profil profesional Dr. '{$user->name}' (Spesialisasi: {$user->specialty}, Rumah Sakit: {$user->hospital}).",
            'success'
        );

        return new DoctorProfileResource($user);
    }

    /**
     * Change authenticated user password
     */
    public function changePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:6|confirmed',
        ], [
            'current_password.required' => 'Kata sandi lama wajib diisi.',
            'new_password.required' => 'Kata sandi baru wajib diisi.',
            'new_password.min' => 'Kata sandi baru minimal 6 karakter.',
            'new_password.confirmed' => 'Konfirmasi kata sandi baru tidak cocok.',
        ]);

        $user = $request->user();

        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'message' => 'Kata sandi lama yang Anda masukkan tidak sesuai.'
            ], 422);
        }

        $user->update([
            'password' => Hash::make($validated['new_password']),
        ]);

        \App\Models\Notification::logActivity(
            $user->id,
            'Kata Sandi Diperbarui',
            "Pengguna Dr. {$user->name} berhasil memperbarui kata sandi akun.",
            'success'
        );

        return response()->json([
            'message' => 'Kata sandi berhasil diperbarui.'
        ]);
    }

    /**
     * Reset the clinical database back to original defaults
     */
    public function resetDatabase()
    {
        // Execute migrations fresh and seed!
        Artisan::call('migrate:fresh', [
            '--seed' => true,
            '--force' => true,
        ]);

        return response()->json([
            'message' => 'Database klinis berhasil di-reset ke nilai bawaan pabrik.'
        ]);
    }
}
