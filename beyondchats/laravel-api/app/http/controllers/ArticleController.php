<?php

// app/Http/Controllers/ArticleController.php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class ArticleController extends Controller
{
    /**
     * Display a listing of articles
     */
    public function index(Request $request): JsonResponse
    {
        $query = Article::with(['originalArticle', 'updatedVersion']);

        // Filter by type
        if ($request->has('type')) {
            if ($request->type === 'original') {
                $query->original();
            } elseif ($request->type === 'updated') {
                $query->updated();
            }
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $articles = $query->latest('created_at')->paginate($perPage);

        return response()->json($articles);
    }

    /**
     * Store a newly created article
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'url' => 'nullable|url',
            'author' => 'nullable|string|max:255',
            'published_at' => 'nullable|date',
            'is_updated' => 'boolean',
            'original_article_id' => 'nullable|exists:articles,id',
            'references' => 'nullable|array',
            'references.*' => 'url',
            'excerpt' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();
        
        // Generate excerpt if not provided
        if (empty($data['excerpt'])) {
            $data['excerpt'] = mb_substr(strip_tags($data['content']), 0, 200) . '...';
        }

        $article = Article::create($data);

        return response()->json([
            'message' => 'Article created successfully',
            'data' => $article->load(['originalArticle', 'updatedVersion'])
        ], 201);
    }

    /**
     * Display the specified article
     */
    public function show(int $id): JsonResponse
    {
        $article = Article::with(['originalArticle', 'updatedVersion'])->find($id);

        if (!$article) {
            return response()->json([
                'message' => 'Article not found'
            ], 404);
        }

        return response()->json([
            'data' => $article
        ]);
    }

    /**
     * Update the specified article
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $article = Article::find($id);

        if (!$article) {
            return response()->json([
                'message' => 'Article not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
            'url' => 'nullable|url',
            'author' => 'nullable|string|max:255',
            'published_at' => 'nullable|date',
            'is_updated' => 'boolean',
            'original_article_id' => 'nullable|exists:articles,id',
            'references' => 'nullable|array',
            'references.*' => 'url',
            'excerpt' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $article->update($validator->validated());

        return response()->json([
            'message' => 'Article updated successfully',
            'data' => $article->load(['originalArticle', 'updatedVersion'])
        ]);
    }

    /**
     * Remove the specified article
     */
    public function destroy(int $id): JsonResponse
    {
        $article = Article::find($id);

        if (!$article) {
            return response()->json([
                'message' => 'Article not found'
            ], 404);
        }

        $article->delete();

        return response()->json([
            'message' => 'Article deleted successfully'
        ], 200);
    }

    /**
     * Get latest article for processing
     */
    public function latest(): JsonResponse
    {
        $article = Article::original()
            ->whereDoesntHave('updatedVersion')
            ->latest('created_at')
            ->first();

        if (!$article) {
            return response()->json([
                'message' => 'No articles available for enhancement'
            ], 404);
        }

        return response()->json([
            'data' => $article
        ]);
    }
}