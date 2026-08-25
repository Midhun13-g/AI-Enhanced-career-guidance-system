import logging
from typing import List, Union
import numpy as np

logger = logging.getLogger(__name__)

class EmbeddingModelLoader:
    _instance = None
    _model = None
    _loading_failed = False

    @classmethod
    def get_model(cls):
        if cls._model is None and not cls._loading_failed:
            try:
                from sentence_transformers import SentenceTransformer
                logger.info("Loading sentence-transformers/all-MiniLM-L6-v2...")
                cls._model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
                logger.info("Model loaded successfully.")
            except Exception as e:
                logger.warning(f"Failed to load SentenceTransformer: {e}. Using fallback embedding matcher.")
                cls._loading_failed = True
        return cls._model

    @classmethod
    def encode(cls, sentences: Union[str, List[str]]) -> np.ndarray:
        model = cls.get_model()
        if model is not None:
            try:
                embeddings = model.encode(sentences, convert_to_numpy=True)
                return embeddings
            except Exception as e:
                logger.error(f"Error encoding with SentenceTransformer: {e}")
        
        # Fallback pseudo-embeddings using simple word hashing
        if isinstance(sentences, str):
            sentences = [sentences]
        
        results = []
        for s in sentences:
            words = set(s.lower().split())
            vec = np.zeros(64, dtype=np.float32)
            for w in words:
                idx = abs(hash(w)) % 64
                vec[idx] += 1.0
            norm = np.linalg.norm(vec)
            if norm > 0:
                vec = vec / norm
            results.append(vec)
        
        return np.array(results)

    @classmethod
    def cosine_similarity(cls, vec1: np.ndarray, vec2: np.ndarray) -> float:
        try:
            vec1 = np.asarray(vec1, dtype=np.float32).flatten()
            vec2 = np.asarray(vec2, dtype=np.float32).flatten()
            
            norm1 = np.linalg.norm(vec1)
            norm2 = np.linalg.norm(vec2)
            
            if norm1 == 0 or norm2 == 0:
                return 0.0
            
            sim = float(np.dot(vec1, vec2) / (norm1 * norm2))
            return max(0.0, min(1.0, round(sim, 4)))
        except Exception as e:
            logger.error(f"Error computing cosine similarity: {e}")
            return 0.0

def compute_semantic_similarity(text1: str, text2: str) -> float:
    if not text1 or not text2:
        return 0.0
    emb1 = EmbeddingModelLoader.encode(text1)
    emb2 = EmbeddingModelLoader.encode(text2)
    return EmbeddingModelLoader.cosine_similarity(emb1, emb2)
