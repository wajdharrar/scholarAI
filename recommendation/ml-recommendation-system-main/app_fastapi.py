"""
FastAPI ML Recommendation Service
Two-Tower Deep Learning Model with FAISS Indexing

Architecture:
- Two-Tower Model: PyTorch dual-encoder for user and item embeddings
- FAISS Index: Efficient approximate nearest neighbor search
- Ranking Layer: Optional hybrid scoring
"""

import os
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

import logging
from contextlib import asynccontextmanager
from typing import List, Optional

from fastapi import FastAPI, HTTPException, Depends, status, BackgroundTasks
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import numpy as np
import torch
import pandas as pd

from config import Config
from data_loader import DataLoader
from two_tower_trainer import TwoTowerTrainer
from faiss_store import FAISSEmbeddingStore, EmbeddingCache

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load configuration
config = Config()

# Global state
class AppState:
    def __init__(self):
        self.model = None
        self.user_store = None
        self.item_store = None
        self.embedding_cache = EmbeddingCache()
        self.user_id_map = {}
        self.item_id_map = {}
        self.ready = False

app_state = AppState()


# Lifespan context manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle startup and shutdown"""
    logger.info("🚀 ML Service starting...")
    
    # Load models on startup
    model_path = config.MODEL_PATH
    if os.path.exists(model_path):
        try:
            await load_models_async()
            logger.info("✓ Models loaded successfully")
        except Exception as e:
            logger.warning(f"Could not load models: {e}")
    else:
        logger.warning(f"Model path not found: {model_path}")
    
    yield
    
    logger.info("🛑 ML Service shutting down...")


# FastAPI app
app = FastAPI(
    title="ML Recommendation Service",
    description="Two-Tower Deep Learning Recommendation Engine with FAISS",
    version="2.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic models
class RecommendationRequest(BaseModel):
    user_id: str = Field(..., description="User ID")
    limit: int = Field(10, ge=1, le=50, description="Number of recommendations")
    include_scores: bool = Field(True, description="Include similarity scores")
    strategy: str = Field("hybrid", description="Strategy: hybrid, content-based")


class RecommendationItem(BaseModel):
    item_id: str
    score: float
    rank: int


class RecommendationResponse(BaseModel):
    user_id: str
    strategy: str
    recommendations: List[RecommendationItem]
    count: int
    generation_time_ms: float


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    models_loaded: bool
    embeddings_cached: Optional[dict] = None


class TrainRequest(BaseModel):
    epochs: int = Field(10, ge=1, le=100)
    batch_size: int = Field(32, ge=8, le=256)
    learning_rate: float = Field(0.001, gt=0, le=0.1)


# Helper functions
async def load_models_async():
    """Load models from disk"""
    model_path = config.MODEL_PATH
    
    try:
        # Load PyTorch model
        device = 'cuda' if torch.cuda.is_available() else 'cpu'
        logger.info(f"Using device: {device}")
        
        # Initialize trainer
        app_state.model = TwoTowerTrainer(
            user_feature_dim=3,
            item_feature_dim=5,
            embedding_dim=128,
            device=device
        )
        
        # Load model weights
        app_state.model.load(model_path)
        
        # Load FAISS indexes
        app_state.user_store = FAISSEmbeddingStore(embedding_dim=128)
        app_state.item_store = FAISSEmbeddingStore(embedding_dim=128)
        
        app_state.user_store.load(os.path.join(model_path, 'user_store'))
        app_state.item_store.load(os.path.join(model_path, 'item_store'))
        
        app_state.ready = True
        logger.info("✓ All models loaded successfully")
        
    except Exception as e:
        logger.error(f"Error loading models: {e}")
        app_state.ready = False
        raise


def generate_recommendations(user_id: str, limit: int, strategy: str = 'hybrid') -> List[RecommendationItem]:
    """
    Generate recommendations for a user
    
    Args:
        user_id: User ID
        limit: Number of recommendations
        strategy: Recommendation strategy
    
    Returns:
        List of recommendations
    """
    if not app_state.ready:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Models not yet loaded"
        )
    
    try:
        # Get user embedding from cache
        user_emb = app_state.embedding_cache.get_user_embedding(user_id)
        
        # Cold start fallback: if user not found, use a zero vector for baseline recommendations
        if user_emb is None:
            logger.warning(f"User {user_id} not found in cache. Using cold-start fallback.")
            user_emb = np.zeros((1, 128), dtype=np.float32)
        else:
            if user_emb.ndim == 1:
                user_emb = user_emb.reshape(1, -1)
            user_emb = user_emb.astype(np.float32)
        
        # Get item recommendations (nearest neighbors in embedding space)
        item_ids, distances = app_state.item_store.search_batch(
            user_emb,
            k=limit
        )
        
        # Remove duplicates while preserving order
        seen_ids = set()
        unique_item_ids = []
        unique_distances = []
        
        for item_id, dist in zip(item_ids[0], distances[0]):
            if item_id not in seen_ids:
                seen_ids.add(item_id)
                unique_item_ids.append(item_id)
                unique_distances.append(dist)
        
        # Create recommendations from unique items
        recommendations = []
        for i, (item_id, dist) in enumerate(zip(unique_item_ids, unique_distances)):
            if i >= limit:
                break
            recommendations.append(RecommendationItem(
                item_id=item_id,
                score=1.0 - (dist / 100.0),  # Normalize distance to score
                rank=i + 1
            ))
        
        return recommendations
    
    except Exception as e:
        logger.error(f"Error generating recommendations: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


# Endpoints

@app.get("/", tags=["Health"])
async def root():
    """Root endpoint"""
    return {
        "service": "ML Recommendation Service",
        "version": "2.0.0",
        "model": "Two-Tower with FAISS",
        "endpoints": {
            "health": "/api/v1/health",
            "recommendations": "/api/v1/recommendations",
            "train": "/api/v1/train",
            "load-models": "/api/v1/load-models"
        }
    }


@app.get("/api/v1/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy" if app_state.ready else "degraded",
        service="ML Recommendation Service",
        version="2.0.0",
        models_loaded=app_state.ready,
        embeddings_cached=app_state.embedding_cache.get_stats()
    )


@app.post("/api/v1/recommendations", response_model=RecommendationResponse, tags=["Recommendations"])
async def get_recommendations(request: RecommendationRequest):
    """
    Generate personalized recommendations for a user
    
    Two-Tower model approach:
    1. Encode user to embedding
    2. Find nearest neighbors in item embedding space using FAISS
    3. Return ranked recommendations
    """
    import time
    start_time = time.time()
    
    try:
        logger.info(f"Generating {request.limit} {request.strategy} recommendations for user: {request.user_id}")
        
        recommendations = generate_recommendations(
            user_id=request.user_id,
            limit=request.limit,
            strategy=request.strategy
        )
        
        generation_time = (time.time() - start_time) * 1000  # Convert to ms
        
        return RecommendationResponse(
            user_id=request.user_id,
            strategy=request.strategy,
            recommendations=recommendations,
            count=len(recommendations),
            generation_time_ms=generation_time
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


async def _run_training_pipeline(request: TrainRequest):
    """Background task for training two-tower model"""
    try:
        logger.info(f"Starting background model training: epochs={request.epochs}, batch_size={request.batch_size}")
        
        # Initialize components
        data_loader = DataLoader(config)
        device = 'cuda' if torch.cuda.is_available() else 'cpu'
        
        # Connect to database
        if not data_loader.connect():
            logger.error("Database connection failed during training")
            return
        
        # Load data
        logger.info("Loading data from database...")
        papers_df = data_loader.load_papers()
        users_df = data_loader.load_users()
        interactions_df = data_loader.load_interactions()
        keywords_df = data_loader.load_keywords()
        
        if papers_df.empty or users_df.empty or interactions_df.empty:
            logger.error("Insufficient data for training")
            return
        
        # Generate negative samples
        logger.info("Generating negative samples...")
        negative_df = data_loader.generate_negative_samples(interactions_df, papers_df, users_df, ratio=1)
        all_interactions = pd.concat([interactions_df, negative_df], ignore_index=True)
        logger.info(f"Total samples: {len(all_interactions)} (positive: {len(interactions_df)}, negative: {len(negative_df)})")
        
        # Create two-tower features with negative samples
        logger.info("Creating two-tower features...")
        user_features, item_features, user_ids, item_ids = data_loader.create_two_tower_features(
            papers_df, users_df, all_interactions, keywords_df
        )
        
        # Initialize and train model
        logger.info("Initializing two-tower model...")
        trainer = TwoTowerTrainer(
            user_feature_dim=user_features.shape[1],
            item_feature_dim=item_features.shape[1],
            embedding_dim=128,
            device=device
        )
        
        logger.info("Training model...")
        train_losses, val_losses = trainer.train(
            user_features=user_features,
            item_features=item_features,
            epochs=request.epochs,
            batch_size=request.batch_size,
            learning_rate=request.learning_rate
        )
        
        # Build FAISS indexes
        logger.info("Building FAISS indexes...")
        user_store, item_store = trainer.build_indexes(
            user_ids=user_ids,
            item_ids=item_ids,
            user_features=user_features,
            item_features=item_features
        )
        
        # Cache embeddings
        logger.info("Caching embeddings...")
        app_state.embedding_cache.clear()
        user_embeddings = trainer.encode_users(user_features)
        for i, uid in enumerate(user_ids):
            app_state.embedding_cache.cache_user_embedding(uid, user_embeddings[i])
            
        item_embeddings = trainer.encode_items(item_features)
        for i, iid in enumerate(item_ids):
            app_state.embedding_cache.cache_item_embedding(iid, item_embeddings[i])
        
        # Save models and indexes
        logger.info("Saving models and indexes...")
        os.makedirs(config.MODEL_PATH, exist_ok=True)
        
        trainer.save(config.MODEL_PATH)
        user_store.save(os.path.join(config.MODEL_PATH, 'user_store'))
        item_store.save(os.path.join(config.MODEL_PATH, 'item_store'))
        
        # Update app state
        app_state.model = trainer
        app_state.user_store = user_store
        app_state.item_store = item_store
        app_state.ready = True
        
        data_loader.close()
        logger.info("✓ Background training completed successfully")
        
    except Exception as e:
        logger.error(f"Training error: {e}", exc_info=True)


@app.post("/api/v1/train", tags=["Training"], status_code=status.HTTP_202_ACCEPTED)
async def train_models(background_tasks: BackgroundTasks, request: TrainRequest = TrainRequest()):
    """
    Train two-tower model in the background.
    Returns 202 Accepted immediately.
    """
    logger.info("Accepted training request, scheduling background task")
    background_tasks.add_task(_run_training_pipeline, request)
    return {
        "status": "accepted",
        "message": "Model training has been scheduled in the background."
    }


@app.post("/api/v1/load-models", tags=["Model Management"])
async def load_models():
    """Load pre-trained models from disk"""
    try:
        logger.info("Loading models...")
        await load_models_async()
        
        return {
            "status": "success",
            "message": "Models loaded successfully",
            "models_ready": app_state.ready
        }
    
    except Exception as e:
        logger.error(f"Error loading models: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@app.get("/api/v1/stats", tags=["Statistics"])
async def get_stats():
    """Get service statistics"""
    return {
        "models_ready": app_state.ready,
        "cache_stats": app_state.embedding_cache.get_stats(),
        "user_store": app_state.user_store.get_stats() if app_state.user_store else None,
        "item_store": app_state.item_store.get_stats() if app_state.item_store else None
    }


# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """HTTP exception handler"""
    logger.error(f"HTTP Exception: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )


if __name__ == "__main__":
    import uvicorn
    
    port = config.PORT
    debug = config.DEBUG
    
    logger.info(f"Starting FastAPI server on port {port} (debug={debug})")
    
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=port,
        reload=debug,
        log_level="info"
    )