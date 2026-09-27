import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Base configuration"""
    DEBUG = False
    TESTING = False
    
    # Database
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_PORT = int(os.getenv('DB_PORT', 5432))
    DB_NAME = os.getenv('DB_NAME', 'research-paper')
    DB_USER = os.getenv('DB_USER', 'postgres')
    DB_PASSWORD = os.getenv('DB_PASSWORD', '2405')
    
    # Java Backend
    JAVA_BACKEND_URL = os.getenv('JAVA_BACKEND_URL', 'http://localhost:8080')
    JAVA_BACKEND_API_KEY = os.getenv('JAVA_BACKEND_API_KEY', '')
    
    # ML Service
    PORT = int(os.getenv('ML_SERVICE_PORT', 5000))
    MODEL_PATH = os.getenv('MODEL_PATH', './models')
    
    # Training
    TRAIN_TEST_SPLIT = float(os.getenv('TRAIN_TEST_SPLIT', 0.2))
    RANDOM_STATE = int(os.getenv('RANDOM_STATE', 42))
    MIN_USER_INTERACTIONS = int(os.getenv('MIN_USER_INTERACTIONS', 3))
    MIN_PAPER_POPULARITY = int(os.getenv('MIN_PAPER_POPULARITY', 2))

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False

class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    DB_NAME = 'test_db'

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
