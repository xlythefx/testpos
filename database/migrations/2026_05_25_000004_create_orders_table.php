<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();         // e.g. ORD-20260601-001 — generated in app layer
            $table->foreignId('cafe_table_id')
                  ->nullable()
                  ->constrained('cafe_tables')
                  ->nullOnDelete();                           // null = takeaway order
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->restrictOnDelete();                       // cashier who created the order
            $table->enum('order_type', ['dine_in', 'takeaway']);
            $table->enum('status', ['pending', 'preparing', 'ready', 'completed', 'cancelled'])
                  ->default('pending');
            $table->text('notes')->nullable();

            // Financial columns — all amounts in store currency (default USD)
            $table->decimal('subtotal', 10, 2)->default(0);
            $table->decimal('tax_rate', 5, 4)->default(0.1000);  // decimal fraction: 0.1000 = 10%
            $table->decimal('tax_amount', 10, 2)->default(0);
            $table->decimal('discount', 10, 2)->default(0);      // flat discount amount
            $table->decimal('total', 10, 2)->default(0);

            $table->timestamp('completed_at')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index('status');
            $table->index('order_type');
            $table->index(['user_id', 'created_at']);
            $table->index(['status', 'created_at']);          // kitchen queue + report queries
            $table->index('completed_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
