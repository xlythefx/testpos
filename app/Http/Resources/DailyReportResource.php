<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DailyReportResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'report_date' => $this->report_date?->toDateString(),
            'total_orders' => $this->total_orders,
            'total_revenue' => $this->total_revenue,
            'total_items_sold' => $this->total_items_sold,
            'average_order_value' => $this->average_order_value,
            'total_discounts' => $this->total_discounts,
            'top_selling_items' => $this->top_selling_items,
            'hourly_breakdown' => $this->hourly_breakdown,
            'category_breakdown' => $this->category_breakdown,
            'generated_at' => $this->generated_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
