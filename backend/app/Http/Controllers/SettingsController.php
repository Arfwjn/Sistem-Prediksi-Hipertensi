<?php

namespace App\Http\Controllers;

use App\Models\ModelConfig;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
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
            'activeModel' => 'sometimes|required|string|in:Random Forest,Decision Tree',
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

        return new DoctorProfileResource($user);
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
