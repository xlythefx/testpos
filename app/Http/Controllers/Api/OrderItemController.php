<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderItemRequest;
use App\Http\Requests\UpdateOrderItemRequest;
use App\Http\Resources\OrderItemResource;
use App\Models\OrderItem;

class OrderItemController extends Controller
{
    public function index()
    {
        return OrderItemResource::collection(OrderItem::with('menuItem')->paginate(15));
    }

    public function store(StoreOrderItemRequest $request)
    {
        $data = $request->validated();
        if (!isset($data['subtotal'])) {
            $data['subtotal'] = $data['quantity'] * $data['unit_price'];
        }
        $orderItem = OrderItem::create($data);
        return new OrderItemResource($orderItem->load('menuItem'));
    }

    public function show(OrderItem $orderItem)
    {
        return new OrderItemResource($orderItem->load('menuItem'));
    }

    public function update(UpdateOrderItemRequest $request, OrderItem $orderItem)
    {
        $orderItem->update($request->validated());
        return new OrderItemResource($orderItem->load('menuItem'));
    }

    public function destroy(OrderItem $orderItem)
    {
        $orderItem->delete();
        return response()->noContent();
    }
}
