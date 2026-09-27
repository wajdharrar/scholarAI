"""
Data loading and preprocessing module for ML pipeline
Connects to PostgreSQL and loads training data
"""

import pandas as pd
import numpy as np
import psycopg2
from psycopg2.extras import RealDictCursor
import logging
from config import Config
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

class DataLoader:
    """Load and preprocess data from PostgreSQL database"""
    
    def __init__(self, config):
        self.config = config
        self.connection = None
        
    def connect(self):
        """Establish database connection"""
        try:
            self.connection = psycopg2.connect(
                host=self.config.DB_HOST,
                port=self.config.DB_PORT,
                database=self.config.DB_NAME,
                user=self.config.DB_USER,
                password=self.config.DB_PASSWORD
            )
            logger.info("Database connection established")
            return True
        except Exception as e:
            logger.error(f"Database connection failed: {e}")
            return False
    
    def close(self):
        """Close database connection"""
        if self.connection:
            self.connection.close()
            logger.info("Database connection closed")
    
    def load_papers(self):
        """Load research papers from database"""
        query = """
        SELECT 
            id,
            title,
            abstract_text,
            paper_category,
            domain_id,
            view_count,
            download_count,
            citation_count,
            like_count,
            publication_date,
            created_date
        FROM research_paper
        WHERE paper_status = 'PUBLISHED'
        """
        try:
            chunks = []
            for chunk in pd.read_sql(query, self.connection, chunksize=10000):
                chunks.append(chunk)
            df = pd.concat(chunks, ignore_index=True) if chunks else pd.DataFrame()
            logger.info(f"Loaded {len(df)} papers")
            return df
        except Exception as e:
            logger.error(f"Error loading papers: {e}")
            return pd.DataFrame()
    
    def load_users(self):
        """Load user data from database"""
        query = """
        SELECT 
            id,
            email,
            institution,
            country,
            papers_count,
            citation_count,
            created_date
        FROM users
        WHERE is_enabled = true
        """
        try:
            chunks = []
            for chunk in pd.read_sql(query, self.connection, chunksize=10000):
                chunks.append(chunk)
            df = pd.concat(chunks, ignore_index=True) if chunks else pd.DataFrame()
            logger.info(f"Loaded {len(df)} users")
            return df
        except Exception as e:
            logger.error(f"Error loading users: {e}")
            return pd.DataFrame()
    
    def load_interactions(self):
        """Load user-paper interactions (likes, saves, downloads)"""
        query = """
        SELECT 
            l.user_id,
            l.paper_id,
            1 as interaction_type,  -- 1 = like
            l.created_date
        FROM user_likes l
        
        UNION ALL
        
        SELECT 
            sp.user_id,
            sp.paper_id,
            2 as interaction_type,  -- 2 = save
            sp.created_date
        FROM saved_paper sp
        
        ORDER BY user_id, created_date DESC
        """
        try:
            chunks = []
            # Use larger chunk size for interactions as they are thinner rows
            for chunk in pd.read_sql(query, self.connection, chunksize=50000):
                chunks.append(chunk)
            df = pd.concat(chunks, ignore_index=True) if chunks else pd.DataFrame()
            logger.info(f"Loaded {len(df)} interactions")
            return df
        except Exception as e:
            logger.error(f"Error loading interactions: {e}")
            return pd.DataFrame()
    
    def load_keywords(self):
        """Load paper keywords"""
        query = """
        SELECT 
            paper_id,
            keyword
        FROM paper_keywords
        """
        try:
            df = pd.read_sql(query, self.connection)
            logger.info(f"Loaded keywords for {df['paper_id'].nunique()} papers")
            return df
        except Exception as e:
            logger.error(f"Error loading keywords: {e}")
            return pd.DataFrame()
    
    def create_training_dataset(self, papers_df, users_df, interactions_df, keywords_df):
        """
        Create feature-engineered dataset for training
        Returns positive interactions and generates negative samples
        """
        logger.info("Creating training dataset...")
        
        # Merge interactions with paper features
        training_data = interactions_df.copy()
        training_data = training_data.merge(papers_df, left_on='paper_id', right_on='id', how='left')
        training_data = training_data.merge(users_df[['id', 'papers_count', 'citation_count']], 
                                           left_on='user_id', right_on='id', how='left')
        
        # Engineer features from papers
        training_data['view_norm'] = training_data['view_count'] / (training_data['view_count'].max() + 1)
        training_data['download_norm'] = training_data['download_count'] / (training_data['download_count'].max() + 1)
        training_data['like_norm'] = training_data['like_count'] / (training_data['like_count'].max() + 1)
        training_data['citation_norm'] = training_data['citation_count'] / (training_data['citation_count'].max() + 1)
        
        # Recency feature (days since publication)
        training_data['days_since_pub'] = (datetime.now() - pd.to_datetime(training_data['publication_date'])).dt.days
        training_data['recency_score'] = np.exp(-training_data['days_since_pub'] / 30)  # 30-day half-life
        
        # Popularity score (normalized combination)
        training_data['popularity_score'] = (
            0.30 * training_data['like_norm'] +
            0.25 * training_data['view_norm'] +
            0.25 * training_data['download_norm'] +
            0.20 * training_data['citation_norm']
        )
        
        # User engagement features
        training_data['user_papers_count'] = training_data['papers_count'].fillna(0)
        training_data['user_citations'] = training_data['citation_count_y'].fillna(0)
        
        # Interaction label (positive example = 1)
        training_data['label'] = 1
        
        logger.info(f"Created training dataset with {len(training_data)} positive examples")
        return training_data
    
    def create_two_tower_features(self, papers_df, users_df, interactions_df, keywords_df):
        """
        Create features for two-tower model
        
        Returns:
            user_features: [n_interactions, user_feature_dim]
            item_features: [n_interactions, item_feature_dim]
            user_ids: List of user IDs
            item_ids: List of paper IDs
        """
        logger.info("Creating two-tower features...")
        
        # Merge data
        merged = interactions_df.copy()
        merged = merged.merge(papers_df, left_on='paper_id', right_on='id', how='left')
        merged = merged.merge(users_df[['id', 'papers_count', 'citation_count', 'institution']], 
                            left_on='user_id', right_on='id', how='left')
        
        # PAIRED FEATURES - one per interaction
        user_features_list = []
        item_features_list = []
        user_ids_list = []
        item_ids_list = []
        
        for idx in range(len(merged)):
            row = merged.iloc[idx]
            
            # User feature vector
            user_feat = np.array([
                row['papers_count'] / (users_df['papers_count'].max() + 1),
                row['citation_count_y'] / (users_df['citation_count'].max() + 1),
                1.0,  # interaction weight
            ], dtype=np.float32)
            
            # Item feature vector
            item_feat = np.array([
                row['view_count'] / (papers_df['view_count'].max() + 1),
                row['download_count'] / (papers_df['download_count'].max() + 1),
                row['like_count'] / (papers_df['like_count'].max() + 1),
                row['citation_count_x'] / (papers_df['citation_count'].max() + 1),
                np.exp(-(datetime.now() - pd.to_datetime(row['publication_date'])).days / 30),
            ], dtype=np.float32)
            
            user_features_list.append(user_feat)
            item_features_list.append(item_feat)
            user_ids_list.append(row['user_id'])
            item_ids_list.append(row['paper_id'])
        
        user_features = np.array(user_features_list)
        item_features = np.array(item_features_list)
        
        logger.info(f"Two-tower features: {len(user_features)} user-item pairs")
        
        return user_features, item_features, user_ids_list, item_ids_list
    
    def generate_negative_samples(self, training_data, papers_df, users_df, ratio=1):
        """
        Generate negative samples (user-paper pairs without interaction)
        ratio: negative samples per positive sample
        """
        logger.info("Generating negative samples...")
        
        positive_pairs = set(zip(training_data['user_id'], training_data['paper_id']))
        all_user_ids = users_df['id'].unique()
        all_paper_ids = papers_df['id'].unique()
        
        negative_samples = []
        target_negatives = len(training_data) * ratio
        
        np.random.seed(self.config.RANDOM_STATE)
        
        while len(negative_samples) < target_negatives:
            user_id = np.random.choice(all_user_ids)
            paper_id = np.random.choice(all_paper_ids)
            
            if (user_id, paper_id) not in positive_pairs:
                negative_samples.append({
                    'user_id': user_id,
                    'paper_id': paper_id,
                    'label': 0
                })
        
        negative_df = pd.DataFrame(negative_samples[:target_negatives])
        logger.info(f"Generated {len(negative_df)} negative samples")
        
        return negative_df