<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'title',
        'desc',
        'type',
        'is_read',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_read' => 'boolean',
    ];

    /**
     * Get the clinician that triggered the notification/activity.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Static helper to log doctor activity notifications.
     */
    public static function logActivity(int|string $userId, string $title, string $desc, string $type = 'info'): self
    {
        return self::create([
            'user_id' => $userId,
            'title' => $title,
            'desc' => $desc,
            'type' => $type,
            'is_read' => false,
        ]);
    }
}
