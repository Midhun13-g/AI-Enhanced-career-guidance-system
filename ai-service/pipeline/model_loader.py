import logging
from typing import List, Union

logger = logging.getLogger(__name__)

class EmbeddingModelLoader:
    """
    Integration layer loader. Local AI model inference is disabled.
    All primary AI processing is executed on the deployed Hugging Face Space:
    https://midhun-2542-career-guidance-system.hf.space
    """

    @classmethod
    def get_model(cls):
        return None

    @classmethod
    def encode(cls, sentences: Union[str, List[str]]):
        if isinstance(sentences, str):
            sentences = [sentences]
        return [s.lower().split() for s in sentences]

    @classmethod
    def cosine_similarity(cls, tokens1: List[str], tokens2: List[str]) -> float:
        set1, set2 = set(tokens1), set(tokens2)
        if not set1 or not set2:
            return 0.0
        intersection = set1.intersection(set2)
        union = set1.union(set2)
        return round(len(intersection) / len(union), 4)

def compute_semantic_similarity(text1: str, text2: str) -> float:
    if not text1 or not text2:
        return 0.0
    tokens1 = text1.lower().split()
    tokens2 = text2.lower().split()
    return EmbeddingModelLoader.cosine_similarity(tokens1, tokens2)
