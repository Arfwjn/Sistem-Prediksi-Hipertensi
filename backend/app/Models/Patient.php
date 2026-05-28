<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'name',
        'age',
        'gender',
        'phone',
        'email',
        'address',
        'status',
        'last_checked',
        'bp_history',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'bp_history' => 'array', // automatically serialize/deserialize JSON bp history
        ];
    }

    /**
     * Get prediction history for this patient
     */
    public function predictions()
    {
        return $this->hasMany(Prediction::class, 'patient_id', 'id');
    }
}
