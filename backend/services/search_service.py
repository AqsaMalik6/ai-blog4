from duckduckgo_search import DDGS
from typing import List, Dict
import asyncio

class WebSearchService:
    def __init__(self):
        pass

    async def _run_search(self, query: str, max_results: int) -> List[Dict]:
        """Runs the search in a thread-safe way"""
        try:
            with DDGS() as ddgs:
                results = list(ddgs.text(query, max_results=max_results))
                return [
                    {
                        "title": r.get("title", ""),
                        "snippet": r.get("body", ""),
                        "link": r.get("href", ""),
                    }
                    for r in results
                ]
        except Exception as e:
            print(f"Search execution error: {e}")
            return []

    async def search_topic(self, query: str, max_results: int = 5) -> List[Dict]:
        """
        Perform web search on a given topic using synchronous DDGS wrapped in thread
        """
        return await asyncio.to_thread(self._sync_search, query, max_results)

    def _sync_search(self, query: str, max_results: int) -> List[Dict]:
        try:
            with DDGS() as ddgs:
                results = list(ddgs.text(query, max_results=max_results))
                return [
                    {
                        "title": r.get("title", ""),
                        "snippet": r.get("body", ""),
                        "link": r.get("href", ""),
                    }
                    for r in results
                ]
        except Exception as e:
            print(f"Sync Search error: {e}")
            return []

    async def multi_search(self, topic: str, num_searches: int = 3) -> List[Dict]:
        """
        Perform multiple searches with different query variations
        """
        queries = [
            f"{topic}",
            f"{topic} latest research",
            f"{topic} current trends",
        ]

        all_results = []
        for query in queries[:num_searches]:
            print(f"Searching web for: {query}...")
            results = await self.search_topic(query, max_results=3)
            print(f"Found {len(results)} results for '{query}'")
            all_results.extend(results)

        # Remove duplicates based on title
        unique_results = []
        seen_titles = set()
        for result in all_results:
            if result["title"] not in seen_titles:
                unique_results.append(result)
                seen_titles.add(result["title"])

        return unique_results[:10]
