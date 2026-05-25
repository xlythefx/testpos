<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'cafe_table_id' => $this->cafe_table_id,
            'cashier_id' => $this->cashier_id,
            'order_type' => $this->order_type,
            'status' => $this->status,
            'payment_method' => $this->payment_method,
            'subtotal' => $this->subtotal,
            'tax_rate' => $this->tax_rate,
            'tax_amount' => $this->tax_amount,
            'discount' => $this->discount,
            'total' => $this->total,
            'notes' => $this->notes,
            'completed_at' => $this->completed_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'cafe_table' => new CafeTableResource($this->whenLoaded('cafeTable')),
            'cashier' => new UserResource($this->whenLoaded('cashier')),
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
        ];
    }
}
