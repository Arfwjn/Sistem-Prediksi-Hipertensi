<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Resources\DoctorProfileResource;

class AuthController extends Controller
{
    /**
     * Authenticate Clinician & return API token
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('username', $credentials['username'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'message' => 'Username atau Password salah.'
            ], 401);
        }

        // Revoke existing tokens if any
        $user->tokens()->delete();

        // Create new Sanctum personal access token
        $token = $user->createToken('clinician-session')->plainTextToken;

        return response()->json([
            'token' => $token,
            'doctor' => new DoctorProfileResource($user)
        ]);
    }

    /**
     * Get authenticated clinician profile
     */
    public function profile(Request $request)
    {
        return new DoctorProfileResource($request->user());
    }

    /**
     * Terminate clinician session
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Berhasil logout, session token dicabut.'
        ]);
    }
}
