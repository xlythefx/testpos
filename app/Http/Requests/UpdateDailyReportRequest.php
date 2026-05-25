<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDailyReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'report_date' => ['sometimes', 'required', 'date', Rule::unique('daily_reports', 'report_date')->ignore($this->route('daily_report'))],
            'total_orders' => ['sometimes', 'integer', 'min:0'],
            'total_revenue' => ['sometimes', 'numeric', 'min:0'],
            'total_items_sold' => ['sometimes', 'integer', 'min:0'],
            'average_order_value' => ['sometimes', 'numeric', 'min:0'],
            'total_discounts' => ['sometimes', 'numeric', 'min:0'],
            'top_selling_items' => ['nullable', 'array'],
            'hourly_breakdown' => ['nullable', 'array'],
            'category_breakdown' => ['nullable', 'array'],
            'generated_at' => ['nullable', 'date'],
        ];
    }
}
