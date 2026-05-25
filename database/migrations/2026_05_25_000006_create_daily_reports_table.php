<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('daily_reports', function (Blueprint $table) {
            $table->id();
            $table->date('report_date')->unique();
            $table->unsignedInteger('total_orders')->default(0);
            $table->decimal('total_revenue', 12, 2)->default(0);
            $table->unsignedInteger('total_items_sold')->default(0);
            $table->decimal('average_order_value', 10, 2)->default(0);
            $table->decimal('total_discounts', 10, 2)->default(0);
            $table->json('top_selling_items')->nullable();    // [{menu_item_id, name, qty_sold, revenue}]
            $table->json('hourly_breakdown')->nullable();    // {hour: {orders, revenue}}
            $table->json('category_breakdown')->nullable();  // [{category_id, name, revenue, qty}]
            $table->timestamp('generated_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_reports');
    }
};
