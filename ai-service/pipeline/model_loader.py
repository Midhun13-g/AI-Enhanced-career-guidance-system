import logging
import os
from threading import Lock
from typing import List, Union

from sentence_transformers import SentenceTransformer

logger = logging.getLogger(__name__)

class EmbeddingModelLoader:
    """
    Lazily loads the sentence-embedding model hosted on Hugging Face.

    The model is downloaded once on first use and then read from the local
    Hugging Face cache on later starts. Set HF_EMBEDDING_MODEL to use another
    compatible SentenceTransformer model.
    """

    _model = None
    _load_lock = Lock()
    _model_name = os.getenv("HF_EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")

    @classmethod
    def get_model(cls):
        if cls._model is None:
            with cls._load_lock:
                if cls._model is None:
                    logger.info("Loading Hugging Face embedding model: %s", cls._model_name)
                    cls._model = SentenceTransformer(cls._model_name)
                    logger.info("Hugging Face embedding model loaded successfully")
        return cls._model

    @classmethod
    def encode(cls, sentences: Union[str, List[str]]):
        if isinstance(sentences, str):
            sentences = [sentences]
        return cls.get_model().encode(sentences, convert_to_numpy=True, normalize_embeddings=True)

def compute_semantic_similarity(text1: str, text2: str) -> float:
    if not text1 or not text2:
        return 0.0
    embeddings = EmbeddingModelLoader.encode([text1, text2])
    # Normalized embeddings make the dot product equivalent to cosine similarity.
    return round(float(embeddings[0] @ embeddings[1]), 4)
