<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'last_name',
        'email',
        'password',
        'step',
        'step_edit',
        'role_id'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];


    public function role()
    {
        return $this->belongsTo(Role::class);
    }


    public function company()
    {
        return $this->hasMany(Company::class);
    }

    public function client()
    {
        return $this->hasMany(Client::class);
    }

    public function bank()
    {
        return $this->hasMany(Bank::class);
    }

    public function employee()
    {
        return $this->hasMany(Employee::class);
    }

    public function payrollConcept()
    {
        return $this->hasMany(PayrollConcept::class);
    }

    public function retention()
    {
        return $this->hasMany(Retention::class);
    }

    public function supplier()
    {
        return $this->hasMany(Supplier::class);
    }

    public function userPerfile()
    {
        return $this->hasMany(UserProfile::class);
    }
    public function accountPlan()
    {
        return $this->hasMany(AccountPlan::class);
    }
    public function productService()
    {
        return $this->hasMany(ProductService::class);
    }
}
