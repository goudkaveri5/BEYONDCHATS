<?php

// app/Models/Article.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'url',
        'author',
        'published_at',
        'is_updated',
        'original_article_id',
        'references',
        'excerpt'
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'is_updated' => 'boolean',
        'references' => 'array'
    ];

    /**
     * Get the original article if this is an updated version
     */
    public function originalArticle(): BelongsTo
    {
        return $this->belongsTo(Article::class, 'original_article_id');
    }

    /**
     * Get the updated version of this article
     */
    public function updatedVersion(): HasOne
    {
        return $this->hasOne(Article::class, 'original_article_id');
    }

    /**
     * Check if article has an updated version
     */
    public function hasUpdatedVersion(): bool
    {
        return $this->updatedVersion()->exists();
    }

    /**
     * Scope to get only original articles
     */
    public function scopeOriginal($query)
    {
        return $query->where('is_updated', false)
                    ->whereNull('original_article_id');
    }

    /**
     * Scope to get only updated articles
     */
    public function scopeUpdated($query)
    {
        return $query->where('is_updated', true)
                    ->whereNotNull('original_article_id');
    }
}