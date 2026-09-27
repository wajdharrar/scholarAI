"""
FAISS Embedding Store and Index Management
Handles storage and efficient similarity search in embedding space
"""

import numpy as np
import faiss
import logging
import json
import os
from typing import List, Tuple, Dict

logger = logging.getLogger(__name__)


class FAISSEmbeddingStore:
    """FAISS-based embedding store for efficient ANN search"""
    
    def __init__(self, embedding_dim=128, index_type='flat'):
        """
        Initialize FAISS index
        
        Args:
            embedding_dim: Dimension of embeddings
            index_type: 'flat' (exact) or 'ivf' (approximate)
        """
        self.embedding_dim = embedding_dim
        self.index_type = index_type
        self.index = None
        self.id_map = {}  # Maps internal index to external IDs
        self.metadata = {}  # Stores metadata per ID
        
        self._create_index()
        logger.info(f"FAISSEmbeddingStore initialized: dim={embedding_dim}, type={index_type}")
    
    def _create_index(self):
        """Create FAISS index"""
        if self.index_type == 'flat':
            # Exact search with L2 distance
            self.index = faiss.IndexFlatL2(self.embedding_dim)
        elif self.index_type == 'ivf':
            # Approximate nearest neighbor with IVF
            quantizer = faiss.IndexFlatL2(self.embedding_dim)
            self.index = faiss.IndexIVFFlat(quantizer, self.embedding_dim, 100)
        else:
            raise ValueError(f"Unknown index type: {self.index_type}")
    
    def add(self, embeddings: np.ndarray, ids: List[str], metadata_list: List[Dict] = None):
        """
        Add embeddings to index
        
        Args:
            embeddings: [n_items, embedding_dim] numpy array
            ids: List of item IDs
            metadata_list: Optional list of metadata dicts per item
        """
        if len(embeddings) != len(ids):
            raise ValueError("Embeddings and IDs must have same length")
        
        # Ensure embeddings are float32
        embeddings = embeddings.astype(np.float32)
        
        # Add to FAISS index
        start_idx = self.index.ntotal
        self.index.add(embeddings)
        
        # Store ID mapping
        for i, item_id in enumerate(ids):
            self.id_map[start_idx + i] = item_id
            if metadata_list:
                self.metadata[item_id] = metadata_list[i]
        
        logger.info(f"Added {len(ids)} embeddings to store (total: {self.index.ntotal})")
    
    def search(self, query_embedding: np.ndarray, k: int = 10) -> Tuple[List[str], List[float]]:
        """
        Search for k nearest neighbors
        
        Args:
            query_embedding: [embedding_dim] or [1, embedding_dim] numpy array
            k: Number of nearest neighbors to return
        
        Returns:
            ids: List of k nearest neighbor IDs
            distances: List of k distances (lower is better for L2)
        """
        if query_embedding.ndim == 1:
            query_embedding = query_embedding.reshape(1, -1)
        
        query_embedding = query_embedding.astype(np.float32)
        
        # Search in FAISS
        distances, indices = self.index.search(query_embedding, k)
        
        distances = distances[0].tolist()
        indices = indices[0].tolist()
        
        # Convert internal indices to external IDs
        ids = [self.id_map.get(idx, None) for idx in indices if idx in self.id_map]
        distances = distances[:len(ids)]
        
        return ids, distances
    
    def search_batch(self, query_embeddings: np.ndarray, k: int = 10) -> Tuple[List[List[str]], np.ndarray]:
        """
        Batch search for k nearest neighbors per query
        
        Args:
            query_embeddings: [batch_size, embedding_dim] numpy array
            k: Number of nearest neighbors per query
        
        Returns:
            ids_batch: List of lists containing k nearest neighbor IDs per query
            distances: [batch_size, k] distances
        """
        query_embeddings = query_embeddings.astype(np.float32)
        
        distances, indices = self.index.search(query_embeddings, k)
        
        ids_batch = []
        for row_idx in range(indices.shape[0]):
            ids = [self.id_map.get(idx, None) for idx in indices[row_idx] if idx in self.id_map]
            ids_batch.append(ids)
        
        return ids_batch, distances
    
    def get_metadata(self, item_id: str) -> Dict:
        """Get metadata for an item"""
        return self.metadata.get(item_id, {})
    
    def save(self, path: str):
        """
        Save index and mappings to disk
        
        Args:
            path: Directory to save to
        """
        os.makedirs(path, exist_ok=True)
        
        # Save FAISS index
        faiss.write_index(self.index, os.path.join(path, 'embeddings.index'))
        
        # Save ID mapping
        with open(os.path.join(path, 'id_map.json'), 'w') as f:
            # Convert int keys to strings for JSON
            id_map_str = {str(k): v for k, v in self.id_map.items()}
            json.dump(id_map_str, f)
        
        # Save metadata
        with open(os.path.join(path, 'metadata.json'), 'w') as f:
            json.dump(self.metadata, f)
        
        logger.info(f"Saved FAISS index to {path}")
    
    def load(self, path: str):
        """
        Load index and mappings from disk
        
        Args:
            path: Directory to load from
        """
        # Load FAISS index
        self.index = faiss.read_index(os.path.join(path, 'embeddings.index'))
        
        # Load ID mapping
        with open(os.path.join(path, 'id_map.json'), 'r') as f:
            id_map_str = json.load(f)
            self.id_map = {int(k): v for k, v in id_map_str.items()}
        
        # Load metadata
        with open(os.path.join(path, 'metadata.json'), 'r') as f:
            self.metadata = json.load(f)
        
        logger.info(f"Loaded FAISS index from {path}")
    
    def clear(self):
        """Clear index"""
        self._create_index()
        self.id_map = {}
        self.metadata = {}
        logger.info("Cleared FAISS index")
    
    def get_stats(self) -> Dict:
        """Get index statistics"""
        return {
            'ntotal': self.index.ntotal,
            'embedding_dim': self.embedding_dim,
            'index_type': self.index_type,
            'n_ids': len(self.id_map)
        }


class EmbeddingCache:
    """Cache for storing pre-computed embeddings in memory"""
    
    def __init__(self):
        self.user_embeddings = {}
        self.item_embeddings = {}
    
    def cache_user_embedding(self, user_id: str, embedding: np.ndarray):
        """Cache user embedding"""
        self.user_embeddings[user_id] = embedding
    
    def cache_item_embedding(self, item_id: str, embedding: np.ndarray):
        """Cache item embedding"""
        self.item_embeddings[item_id] = embedding
    
    def get_user_embedding(self, user_id: str) -> np.ndarray:
        """Get cached user embedding"""
        return self.user_embeddings.get(user_id)
    
    def get_item_embedding(self, item_id: str) -> np.ndarray:
        """Get cached item embedding"""
        return self.item_embeddings.get(item_id)
    
    def clear(self):
        """Clear cache"""
        self.user_embeddings = {}
        self.item_embeddings = {}
    
    def get_stats(self) -> Dict:
        """Get cache statistics"""
        return {
            'cached_users': len(self.user_embeddings),
            'cached_items': len(self.item_embeddings)
        }
