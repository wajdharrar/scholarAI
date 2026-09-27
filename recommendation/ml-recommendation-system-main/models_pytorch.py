"""
Two-Tower Deep Learning Model for Paper Recommendations
PyTorch implementation using dual-encoder architecture

Architecture:
- User Tower: Encodes user history and profile
- Item Tower: Encodes paper features
- Similarity: Computes dot-product similarity in embedding space
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
import logging

logger = logging.getLogger(__name__)


class UserTower(nn.Module):
    """User encoder tower"""
    
    def __init__(self, user_feature_dim, embedding_dim=128):
        super().__init__()
        self.embedding_dim = embedding_dim
        
        self.fc_layers = nn.Sequential(
            nn.Linear(user_feature_dim, 256),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(256, 128),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(128, embedding_dim)
        )
        
        logger.info(f"UserTower initialized: {user_feature_dim} -> {embedding_dim}")
    
    def forward(self, user_features):
        """
        Args:
            user_features: [batch_size, user_feature_dim]
        Returns:
            user_embedding: [batch_size, embedding_dim]
        """
        return F.normalize(self.fc_layers(user_features), p=2, dim=1)


class ItemTower(nn.Module):
    """Paper/Item encoder tower"""
    
    def __init__(self, item_feature_dim, embedding_dim=128):
        super().__init__()
        self.embedding_dim = embedding_dim
        
        self.fc_layers = nn.Sequential(
            nn.Linear(item_feature_dim, 256),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(256, 128),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(128, embedding_dim)
        )
        
        logger.info(f"ItemTower initialized: {item_feature_dim} -> {embedding_dim}")
    
    def forward(self, item_features):
        """
        Args:
            item_features: [batch_size, item_feature_dim]
        Returns:
            item_embedding: [batch_size, embedding_dim]
        """
        return F.normalize(self.fc_layers(item_features), p=2, dim=1)


class TwoTowerModel(nn.Module):
    """Complete two-tower recommendation model"""
    
    def __init__(self, user_feature_dim, item_feature_dim, embedding_dim=128, temperature=0.1):
        super().__init__()
        
        self.user_tower = UserTower(user_feature_dim, embedding_dim)
        self.item_tower = ItemTower(item_feature_dim, embedding_dim)
        self.temperature = temperature
        
        logger.info(f"TwoTowerModel initialized with embedding_dim={embedding_dim}, temperature={temperature}")
    
    def forward(self, user_features, item_features):
        """
        Forward pass for training
        
        Args:
            user_features: [batch_size, user_feature_dim]
            item_features: [batch_size, item_feature_dim]
        
        Returns:
            logits: [batch_size, batch_size] similarity matrix
        """
        user_embeddings = self.user_tower(user_features)  # [batch_size, embedding_dim]
        item_embeddings = self.item_tower(item_features)  # [batch_size, embedding_dim]
        
        # Compute similarity matrix: [batch_size, batch_size]
        logits = torch.matmul(user_embeddings, item_embeddings.t()) / self.temperature
        
        return logits, user_embeddings, item_embeddings
    
    def encode_user(self, user_features):
        """Encode user to embedding"""
        return self.user_tower(user_features)
    
    def encode_item(self, item_features):
        """Encode item to embedding"""
        return self.item_tower(item_features)
    
    def get_user_embeddings(self, user_features_batch):
        """
        Get embeddings for a batch of users
        
        Args:
            user_features_batch: [batch_size, user_feature_dim]
        
        Returns:
            embeddings: [batch_size, embedding_dim] numpy array
        """
        self.eval()
        with torch.no_grad():
            embeddings = self.user_tower(user_features_batch)
        return embeddings.cpu().numpy()
    
    def get_item_embeddings(self, item_features_batch):
        """
        Get embeddings for a batch of items
        
        Args:
            item_features_batch: [batch_size, item_feature_dim]
        
        Returns:
            embeddings: [batch_size, embedding_dim] numpy array
        """
        self.eval()
        with torch.no_grad():
            embeddings = self.item_tower(item_features_batch)
        return embeddings.cpu().numpy()


class TwoTowerLoss(nn.Module):
    """Contrastive loss for two-tower model"""
    
    def __init__(self):
        super().__init__()
    
    def forward(self, logits):
        """
        Compute contrastive loss (InfoNCE)
        
        Positive pair: (user_i, item_i) -> target is diagonal
        Negative pairs: (user_i, item_j) where i != j
        
        Args:
            logits: [batch_size, batch_size] similarity scores
        
        Returns:
            loss: scalar loss value
        """
        batch_size = logits.size(0)
        
        # Create target: positive pairs are on diagonal - convert to float
        targets = torch.eye(batch_size, device=logits.device)
        
        # Cross-entropy loss expects class indices (long) or probabilities (float)
        # Use log_softmax + nll_loss instead
        log_probs = F.log_softmax(logits, dim=1)
        loss = -torch.sum(targets * log_probs) / batch_size
        
        return loss


class RankingHead(nn.Module):
    """Optional ranking head for hybrid scoring"""
    
    def __init__(self, embedding_dim=128):
        super().__init__()
        
        self.fc_layers = nn.Sequential(
            nn.Linear(embedding_dim * 2, 128),
            nn.ReLU(),
            nn.Dropout(0.1),
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Linear(64, 1),
            nn.Sigmoid()  # Output between 0-1
        )
    
    def forward(self, user_embedding, item_embedding):
        """
        Compute ranking score combining user and item embeddings
        
        Args:
            user_embedding: [batch_size, embedding_dim]
            item_embedding: [batch_size, embedding_dim]
        
        Returns:
            score: [batch_size, 1] ranking scores
        """
        combined = torch.cat([user_embedding, item_embedding], dim=1)
        return self.fc_layers(combined)