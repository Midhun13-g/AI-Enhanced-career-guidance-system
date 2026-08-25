import time
import threading
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

class ResultCacheStore:
    _instance = None
    _lock = threading.Lock()

    def __init__(self, ttl_seconds: int = 3600):
        self.store: Dict[str, Dict[str, Any]] = {}
        self.ttl = ttl_seconds

    @classmethod
    def get_instance(cls):
        with cls._lock:
            if cls._instance is None:
                cls._instance = ResultCacheStore()
            return cls._instance

    def put(self, request_id: str, data: Dict[str, Any]) -> None:
        with self._lock:
            self._cleanup_expired()
            self.store[request_id] = {
                "timestamp": time.time(),
                "data": data
            }

    def get(self, request_id: str) -> Optional[Dict[str, Any]]:
        with self._lock:
            self._cleanup_expired()
            entry = self.store.get(request_id)
            if entry:
                return entry["data"]
            return None

    def delete(self, request_id: str) -> bool:
        with self._lock:
            if request_id in self.store:
                del self.store[request_id]
                return True
            return False

    def _cleanup_expired(self) -> None:
        now = time.time()
        expired_keys = [k for k, v in self.store.items() if (now - v["timestamp"]) > self.ttl]
        for k in expired_keys:
            del self.store[k]

cache_store = ResultCacheStore.get_instance()
