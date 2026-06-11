<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
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

        \App\Models\Notification::logActivity(
            $user->id,
            'Sesi Masuk Berhasil',
            "Pengguna Dr. {$user->name} berhasil masuk ke dalam sistem intelligence.",
            'success'
        );

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
        $user = $request->user();
        \App\Models\Notification::logActivity(
            $user->id,
            'Keluar Sistem',
            "Sesi masuk Dr. {$user->name} telah diakhiri dengan aman.",
            'info'
        );

        $user->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Berhasil logout, session token dicabut.'
        ]);
    }

    /**
     * Register a new user account
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
        ], [
            'username.unique' => 'Username sudah digunakan.',
            'email.unique' => 'Email sudah terdaftar.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
            'password.min' => 'Password minimal 6 karakter.',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'specialty' => 'Puskesmas Kembaran 1',
            'hospital' => 'Dinas Kesehatan Banyumas',
        ]);

        return response()->json([
            'message' => 'Registrasi berhasil. Silakan login.'
        ], 201);
    }

    /**
     * Generate a password reset token and return it
     */
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Email tidak ditemukan dalam sistem.'
            ], 404);
        }

        // Delete any existing token for this email
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        // Generate a simple 6-character token
        $token = strtoupper(Str::random(6));

        DB::table('password_reset_tokens')->insert([
            'email' => $request->email,
            'token' => Hash::make($token),
            'created_at' => now(),
        ]);

        // In production, this would be sent via email.
        // For development, the token is returned directly in the response.
        return response()->json([
            'message' => "Token reset password telah dibuat. Gunakan token berikut: {$token}",
        ]);
    }

    /**
     * Reset password using token
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required|string',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $record = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$record) {
            return response()->json([
                'message' => 'Token tidak ditemukan. Silakan minta token baru.'
            ], 400);
        }

        // Check if token is expired (60 minutes)
        if (now()->diffInMinutes($record->created_at) > 60) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            return response()->json([
                'message' => 'Token telah kadaluarsa. Silakan minta token baru.'
            ], 400);
        }

        if (!Hash::check($request->token, $record->token)) {
            return response()->json([
                'message' => 'Token tidak valid.'
            ], 400);
        }

        // Update password
        $user = User::where('email', $request->email)->first();
        $user->password = $request->password;
        $user->save();

        // Clean up token
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json([
            'message' => 'Password berhasil direset. Silakan login dengan password baru.'
        ]);
    }
}
