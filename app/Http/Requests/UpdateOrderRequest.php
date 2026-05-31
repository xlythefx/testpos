<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'order_number' => ['sometimes', 'string', 'max:255', Rule::unique('orders', 'order_number')->ignore($this->route('order'))],
            'cafe_table_id' => ['nullable', 'integer', 'exists:cafe_tables,id'],
            'user_id' => ['sometimes', 'required', 'integer', 'exists:users,id'],
            'order_type' => ['sometimes', 'required', 'in:dine_in,takeaway'],
            'status' => ['sometimes', 'in:pending,preparing,ready,completed,cancelled'],
            'subtotal' => ['sometimes', 'numeric', 'min:0'],
            'tax_rate' => ['sometimes', 'numeric', 'min:0'],
            'tax_amount' => ['sometimes', 'numeric', 'min:0'],
            'discount' => ['sometimes', 'numeric', 'min:0'],
            'total' => ['sometimes', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string'],
            'completed_at' => ['nullable', 'date'],
        ];
    }
}
