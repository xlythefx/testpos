<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class CafeTable extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'cafe_tables';

    protected $fillable = ['number', 'capacity', 'status'];

    protected $casts = [
        'number' => 'integer',
        'capacity' => 'integer',
    ];

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class, 'cafe_table_id');
    }
}
