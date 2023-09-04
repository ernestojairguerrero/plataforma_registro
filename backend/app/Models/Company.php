<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'business_name',
        'nit',
        'slog',
        'user',
        'password',
        'signature',
        'email',
        'company_category',
        'description_user',
        'description_admin',
        'user_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
