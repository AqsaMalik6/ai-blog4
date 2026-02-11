import os
import aiohttp
import aiofiles
from datetime import datetime
import uuid

class ImageService:
    def __init__(self):
        # Find project root (one level up from 'backend' or two from 'backend/services')
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        self.output_dir = os.path.join(base_dir, "frontend", "public", "static", "images")
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir, exist_ok=True)

    async def generate_image(self, prompt: str) -> str:
        """
        Generate an image based on the prompt.
        Uses Pollinations.ai for high-quality AI images without extra keys.
        Saves locally to make it downloadable.
        """
        try:
            # High-quality image generation via Pollinations.ai
            # We encode the prompt for URL
            safe_prompt = prompt.replace(" ", "%20").replace("\n", "%20")
            image_url = f"https://image.pollinations.ai/prompt/{safe_prompt}?width=1024&height=1024&nologo=true&enhance=true"
            
            async with aiohttp.ClientSession() as session:
                async with session.get(image_url) as resp:
                    if resp.status == 200:
                        filename = f"image_{uuid.uuid4().hex}.png"
                        filepath = os.path.join(self.output_dir, filename)
                        
                        f = await aiofiles.open(filepath, mode='wb')
                        await f.write(await resp.read())
                        await f.close()
                        
                        # Return relative URL for frontend
                        return f"/static/images/{filename}"
            return ""
        except Exception as e:
            print(f"Image generation error: {e}")
            return ""
