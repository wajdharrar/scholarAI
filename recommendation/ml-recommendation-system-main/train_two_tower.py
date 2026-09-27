#!/usr/bin/env python3
"""
Two-Tower Model Training Script
Standalone script to train PyTorch two-tower model with FAISS indexing
"""

import os
import sys
import logging
import torch
import numpy as np
from dotenv import load_dotenv

from config import Config
from data_loader import DataLoader
from two_tower_trainer import TwoTowerTrainer

# Load environment
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('training.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


def main():
    """Train two-tower models"""
    logger.info("=" * 70)
    logger.info("TWO-TOWER MODEL TRAINING PIPELINE")
    logger.info("=" * 70)
    
    # Configuration
    config = Config()
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    logger.info(f"Device: {device}")
    
    # Initialize
    data_loader = DataLoader(config)
    
    try:
        # 1. Connect to database
        logger.info("\n[1/6] Connecting to database...")
        if not data_loader.connect():
            logger.error("Failed to connect to database")
            return False
        logger.info("✓ Database connected")
        
        # 2. Load data
        logger.info("\n[2/6] Loading data from database...")
        papers_df = data_loader.load_papers()
        users_df = data_loader.load_users()
        interactions_df = data_loader.load_interactions()
        keywords_df = data_loader.load_keywords()
        
        if papers_df.empty or users_df.empty or interactions_df.empty:
            logger.error("Insufficient data for training")
            return False
        
        logger.info(f"✓ Loaded {len(papers_df)} papers, {len(users_df)} users, {len(interactions_df)} interactions")
        
        # 3. Create features
        logger.info("\n[3/6] Creating two-tower features...")
        user_features, item_features, user_ids, item_ids = data_loader.create_two_tower_features(
            papers_df, users_df, interactions_df, keywords_df
        )
        
        logger.info(f"✓ User features: {user_features.shape}")
        logger.info(f"✓ Item features: {item_features.shape}")
        
        # 4. Initialize and train model
        logger.info("\n[4/6] Training two-tower model...")
        trainer = TwoTowerTrainer(
            user_feature_dim=user_features.shape[1],
            item_feature_dim=item_features.shape[1],
            embedding_dim=128,
            device=device
        )
        
        train_losses, val_losses = trainer.train(
            user_features=user_features,
            item_features=item_features,
            epochs=10,
            batch_size=32,
            learning_rate=0.001
        )
        
        logger.info(f"✓ Training completed")
        logger.info(f"  Final train loss: {train_losses[-1]:.4f}")
        logger.info(f"  Final val loss: {val_losses[-1]:.4f}")
        
        # 5. Build FAISS indexes
        logger.info("\n[5/6] Building FAISS indexes...")
        user_store, item_store = trainer.build_indexes(
            user_ids=user_ids,
            item_ids=item_ids,
            user_features=user_features,
            item_features=item_features
        )
        logger.info("✓ FAISS indexes built")
        
        # 6. Save models
        logger.info("\n[6/6] Saving models...")
        os.makedirs(config.MODEL_PATH, exist_ok=True)
        
        trainer.save(config.MODEL_PATH)
        user_store.save(os.path.join(config.MODEL_PATH, 'user_store'))
        item_store.save(os.path.join(config.MODEL_PATH, 'item_store'))
        
        logger.info(f"✓ Models saved to {config.MODEL_PATH}")
        
        # Close connection
        data_loader.close()
        
        logger.info("\n" + "=" * 70)
        logger.info("✓ TWO-TOWER MODEL TRAINING COMPLETED SUCCESSFULLY!")
        logger.info("=" * 70)
        
        return True
    
    except Exception as e:
        logger.error(f"\n✗ Error during training: {e}", exc_info=True)
        return False


if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
