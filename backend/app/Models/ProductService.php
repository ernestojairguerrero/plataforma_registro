<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductService extends Model
{
    use HasFactory;

    protected $fillable = [
        'file',
        'description_user',
        'description_admin',
        'user_id'
    ];

    // public function detail()
    // {
    //     return $this->belongsTo(Detail::class);
    // }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
