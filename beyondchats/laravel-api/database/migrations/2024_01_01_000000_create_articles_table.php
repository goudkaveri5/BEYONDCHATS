<?php

// database/migrations/2024_01_01_000000_create_articles_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content');
            $table->string('url')->nullable();
            $table->string('author')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->boolean('is_updated')->default(false);
            $table->foreignId('original_article_id')->nullable()->constrained('articles')->onDelete('cascade');
            $table->json('references')->nullable(); // Store citation URLs
            $table->text('excerpt')->nullable();
            $table->timestamps();
            
            $table->index('is_updated');
            $table->index('original_article_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};