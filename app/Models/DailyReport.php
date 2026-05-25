<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DailyReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'report_date',
        'total_orders',
        'total_revenue',
        'total_items_sold',
        'average_order_value',
        'total_discounts',
        'top_selling_items',
        'hourly_breakdown',
        'category_breakdown',
        'generated_at',
    ];

    protected $casts = [
        'report_date' => 'date',
        'total_orders' => 'integer',
        'total_items_sold' => 'integer',
        'total_revenue' => 'decimal:2',
        'average_order_value' => 'decimal:2',
        'total_discounts' => 'decimal:2',
        'top_selling_items' => 'array',
        'hourly_breakdown' => 'array',
        'category_breakdown' => 'array',
        'generated_at' => 'datetime',
    ];
}
