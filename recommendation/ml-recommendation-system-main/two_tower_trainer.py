"""
Two-Tower Model Trainer
Trains PyTorch two-tower model with FAISS indexing
"""

import torch
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
import numpy as np
import logging
from typing import Tuple
import os

from models_pytorch import TwoTowerModel, TwoTowerLoss
from faiss_store import FAISSEmbeddingStore

logger = logging.getLogger(__name__)


class RecommendationDataset(Dataset):
    """Dataset for two-tower model training"""
    
    def __init__(self, user_features: np.ndarray, item_features: np.ndarray):
        """
        Args:
            user_features: [n_samples, user_feature_dim]
            item_features: [n_samples, item_feature_dim]
        """
        self.user_features = torch.FloatTensor(user_features)
        self.item_features = torch.FloatTensor(item_features)
        
        assert len(self.user_features) == len(self.item_features)
    
    def __len__(self):
        return len(self.user_features)
    
    def __getitem__(self, idx):
        return self.user_features[idx], self.item_features[idx]


class TwoTowerTrainer:
    """Train two-tower recommendation model"""
    
    def __init__(self, 
                 user_feature_dim: int,
                 item_feature_dim: int,
                 embedding_dim: int = 128,
                 device: str = 'cpu'):
        """
        Initialize trainer
        
        Args:
            user_feature_dim: Dimension of user features
            item_feature_dim: Dimension of item features
            embedding_dim: Dimension of embeddings
            device: 'cpu' or 'cuda'
        """
        self.device = device
        self.model = TwoTowerModel(
            user_feature_dim=user_feature_dim,
            item_feature_dim=item_feature_dim,
            embedding_dim=embedding_dim
        ).to(device)
        
        self.criterion = TwoTowerLoss()
        self.embedding_dim = embedding_dim
        
        logger.info(f"TwoTowerTrainer initialized on {device}")
    
    def train(self,
              user_features: np.ndarray,
              item_features: np.ndarray,
              epochs: int = 10,
              batch_size: int = 32,
              learning_rate: float = 0.001,
              validation_split: float = 0.2):
        """
        Train two-tower model
        
        Args:
            user_features: [n_samples, user_feature_dim]
            item_features: [n_samples, item_feature_dim]
            epochs: Number of training epochs
            batch_size: Batch size
            learning_rate: Learning rate
            validation_split: Fraction for validation
        
        Returns:
            train_losses: List of training losses
            val_losses: List of validation losses
        """
        logger.info(f"Starting training: epochs={epochs}, batch_size={batch_size}, lr={learning_rate}")
        
        # Create dataset
        dataset = RecommendationDataset(user_features, item_features)
        
        # Split train/val
        val_size = int(len(dataset) * validation_split)
        train_size = len(dataset) - val_size
        train_dataset, val_dataset = torch.utils.data.random_split(
            dataset, [train_size, val_size]
        )
        
        train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
        val_loader = DataLoader(val_dataset, batch_size=batch_size)
        
        # Optimizer
        optimizer = optim.Adam(self.model.parameters(), lr=learning_rate)
        
        train_losses = []
        val_losses = []
        
        for epoch in range(epochs):
            # Train epoch
            train_loss = self._train_epoch(train_loader, optimizer)
            train_losses.append(train_loss)
            
            # Validation epoch
            val_loss = self._validate_epoch(val_loader)
            val_losses.append(val_loss)
            
            if (epoch + 1) % 2 == 0:
                logger.info(f"Epoch {epoch + 1}/{epochs} - Train Loss: {train_loss:.4f}, Val Loss: {val_loss:.4f}")
        
        logger.info(f"Training completed. Final Train Loss: {train_losses[-1]:.4f}, Val Loss: {val_losses[-1]:.4f}")
        
        return train_losses, val_losses
    
    def _train_epoch(self, train_loader, optimizer):
        """Train single epoch"""
        self.model.train()
        total_loss = 0
        
        for batch_idx, (user_features, item_features) in enumerate(train_loader):
            user_features = user_features.to(self.device)
            item_features = item_features.to(self.device)
            
            # Forward pass
            logits, _, _ = self.model(user_features, item_features)
            loss = self.criterion(logits)
            
            # Backward pass
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()
            
            total_loss += loss.item()
        
        return total_loss / len(train_loader)
    
    def _validate_epoch(self, val_loader):
        """Validate single epoch"""
        self.model.eval()
        total_loss = 0
        
        with torch.no_grad():
            for user_features, item_features in val_loader:
                user_features = user_features.to(self.device)
                item_features = item_features.to(self.device)
                
                logits, _, _ = self.model(user_features, item_features)
                loss = self.criterion(logits)
                
                total_loss += loss.item()
        
        return total_loss / len(val_loader)
    
    def encode_users(self, user_features: np.ndarray) -> np.ndarray:
        """
        Encode users to embeddings
        
        Args:
            user_features: [n_users, user_feature_dim]
        
        Returns:
            embeddings: [n_users, embedding_dim]
        """
        user_features = torch.FloatTensor(user_features).to(self.device)
        return self.model.get_user_embeddings(user_features)
    
    def encode_items(self, item_features: np.ndarray) -> np.ndarray:
        """
        Encode items to embeddings
        
        Args:
            item_features: [n_items, item_feature_dim]
        
        Returns:
            embeddings: [n_items, embedding_dim]
        """
        item_features = torch.FloatTensor(item_features).to(self.device)
        return self.model.get_item_embeddings(item_features)
    
    def save(self, path: str):
        """Save model to disk"""
        os.makedirs(path, exist_ok=True)
        torch.save(self.model.state_dict(), os.path.join(path, 'two_tower_model.pth'))
        logger.info(f"Model saved to {path}")
    
    def load(self, path: str):
        """Load model from disk"""
        self.model.load_state_dict(torch.load(os.path.join(path, 'two_tower_model.pth')))
        logger.info(f"Model loaded from {path}")
    
    def build_indexes(self, 
                      user_ids: list,
                      item_ids: list,
                      user_features: np.ndarray,
                      item_features: np.ndarray,
                      user_metadata: list = None,
                      item_metadata: list = None) -> Tuple[FAISSEmbeddingStore, FAISSEmbeddingStore]:
        """
        Build FAISS indexes for users and items
        
        Args:
            user_ids: List of user IDs
            item_ids: List of item IDs
            user_features: [n_users, user_feature_dim]
            item_features: [n_items, item_feature_dim]
            user_metadata: Optional metadata per user
            item_metadata: Optional metadata per item
        
        Returns:
            user_store: FAISS store for users
            item_store: FAISS store for items
        """
        logger.info("Building FAISS indexes...")
        
        # Encode
        user_embeddings = self.encode_users(user_features)
        item_embeddings = self.encode_items(item_features)
        
        # Create stores
        user_store = FAISSEmbeddingStore(embedding_dim=self.embedding_dim, index_type='flat')
        item_store = FAISSEmbeddingStore(embedding_dim=self.embedding_dim, index_type='flat')
        
        # Add to stores
        user_store.add(user_embeddings, user_ids, user_metadata)
        item_store.add(item_embeddings, item_ids, item_metadata)
        
        logger.info(f"Built indexes: {user_store.get_stats()}, {item_store.get_stats()}")
        
        return user_store, item_store