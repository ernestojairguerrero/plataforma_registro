<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Detail extends Model
{
    use HasFactory;

    protected $fillable = [
        'number_level',
        'description',
        'product_service_id'
    ];

    public function productServices()
    {
        return $this->hasMany(ProductService::class);
    }
}
