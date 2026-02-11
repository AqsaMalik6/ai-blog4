# 🤖 AI Blog Generation Agent

Complete AI-powered blog generation system with web search, Gemini AI integration, and ChatGPT-style interface.

##  Features

-  **AI-Powered Blog Generation** using Google Gemini
-  **Web Search Integration** with DuckDuckGo
-  **ChatGPT-Style Interface** 
-  **Chat History** with PostgreSQL
-  **Multiple Chats** support
-  **Delete Chats** functionality
-  **Responsive Design**

##  Project Structure

```
.
├── backend/
│   ├── models/
│   │   └── models.py          # SQLAlchemy database models
│   ├── routes/
│   │   └── api.py              # FastAPI routes
│   ├── services/
│   │   ├── ai_agent.py         # Gemini AI agent
│   │   └── search_service.py   # Web search service
│   └── database/
│       └── database.py         # Database connection
├── frontend/
│   ├── static/
│   │   ├── css/
│   │   │   └── style.css       # Styles
│   │   └── js/
│   │       └── app.js          # Frontend JavaScript
│   └── index.html              # Main HTML
├── main.py                     # FastAPI application
├── requirements.txt            # Python dependencies
├── .env                        # Environment variables
└── README.md                   # This file
```

##  Quick Start

### 1. Prerequisites

- Python 3.8+
- PostgreSQL installed and running
- Gemini API key (free from Google AI Studio)

### 2. Database Setup

```bash
# Install PostgreSQL (if not installed)
# Ubuntu/Debian:
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL
sudo service postgresql start

# Create database
sudo -u postgres psql
CREATE DATABASE ai_blog_db;
CREATE USER postgres WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE ai_blog_db TO postgres;
\q
```

### 3. Get Gemini API Key

1. Go to: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy your API key

### 4. Install Dependencies

```bash
# Activate your venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate  # Windows

# Install requirements
pip install -r requirements.txt
```

### 5. Configure Environment

Edit `.env` file:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/ai_blog_db
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=8000
```

### 6. Run the Application

```bash
# Make sure PostgreSQL is running
sudo service postgresql status

# Run the app
python main.py
```

### 7. Open Browser

Open: http://localhost:8000

## Usage

1. **Enter a topic** in the input box (e.g., "Artificial Intelligence in Healthcare")
2. **Click Send** or press Enter
3. The AI will:
   - 🔍 Search the web for information
   - 📊 Analyze and summarize results
   - ✍️ Generate a professional blog article
4. **View chat history** in the sidebar
5. **Create new chats** with the "+ New Chat" button
6. **Delete chats** using the 🗑️ button

##  Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database
- **PostgreSQL** - Database
- **Google Gemini** - AI model
- **DuckDuckGo** - Web search

### Frontend
- **HTML/CSS/JavaScript** - Simple, clean interface
- **ChatGPT-style UI** - Familiar user experience

##  API Endpoints

- `POST /api/generate-blog` - Generate blog from topic
- `GET /api/chats` - Get all chats
- `GET /api/chats/{chat_id}/messages` - Get chat messages
- `DELETE /api/chats/{chat_id}` - Delete chat
- `GET /api/blogs` - Get all blogs

##  Troubleshooting

### Database Connection Error
```bash
# Check PostgreSQL is running
sudo service postgresql status

# Start if not running
sudo service postgresql start

# Reset password if needed
sudo -u postgres psql
ALTER USER postgres PASSWORD 'password';
```

### Import Errors
```bash
# Make sure you're in venv
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Gemini API Error
- Make sure your API key is correct in `.env`
- Check API quota: https://makersuite.google.com/app/apikey
- Try regenerating the API key

### Port Already in Use
```bash
# Change PORT in .env file
PORT=8001
```

##  Customization

### Change AI Model
Edit `backend/services/ai_agent.py`:
```python
self.model = genai.GenerativeModel('gemini-pro')  # Change model here
```

### Adjust Search Results
Edit `backend/services/search_service.py`:
```python
async def multi_search(self, topic: str, num_searches: int = 5):  # Change number
```

### Modify UI Colors
Edit `frontend/static/css/style.css`

## Database Schema

### Users
- id, username, email, created_at

### Chats
- id, user_id, title, created_at, updated_at

### Messages
- id, chat_id, role, content, created_at

### Blogs
- id, user_id, chat_id, topic, content, timestamp

## Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Ensure PostgreSQL is running
4. Check Gemini API key is valid

##  License

MIT License - Free to use and modify!

---

**Made with using FastAPI, Gemini AI, and PostgreSQL**
