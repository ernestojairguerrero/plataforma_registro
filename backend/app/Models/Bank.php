<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bank extends Model
{
    use HasFactory;

    protected $fillable = [
        'file',
        'description_user',
        'description_admin',
        'user_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
