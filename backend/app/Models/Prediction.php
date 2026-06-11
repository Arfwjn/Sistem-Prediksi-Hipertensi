<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prediction extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'patient_id',
        'patient_name',
        'date',
        'model_used',
        'confidence_score',
        'systolic',
        'diastolic',
        'age',
        'gender',
        'weight',
        'height',
        'bmi',
        'result',
        'accuracy_dt',
        'accuracy_rf',
    ];

    /**
     * Relationship with patient
     */
    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id', 'id');
    }
}
