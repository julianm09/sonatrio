# Sonatrio | AI-Powered Content from Your Audio

Sonatrio transforms your audio files into high-quality content, including blog posts, social media captions, summaries, and more—powered by AI!

## 🚀 Features

- Upload audio files
- AI-driven transcription with **Deepgram**
- Automatic content generation with **OpenAI GPT**
- Create blog posts, social media snippets, and summaries

## 🛠️ Getting Started

### Prerequisites

Make sure the following are installed:

- **Node.js** (latest LTS recommended)
- **npm** or **yarn**
- **Supabase** project set up
- **Deepgram** and **OpenAI** API keys

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-repo/sonatrio.git
   cd sonatrio
   ```

2. **Set up environment variables**

   You will need to add `.env` files for both the frontend and backend. These will store your API credentials for Supabase, Deepgram, and OpenAI.

   #### `frontend/.env.local`
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

   #### `backend/.env`
   ```env
   SUPABASE_URL=your-supabase-url
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

   DEEPGRAM_API_KEY=your-deepgram-api-key
   OPENAI_API_KEY=your-openai-api-key
   ```

3. **Install and run the frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Install and run the backend**
   ```bash
   cd ../backend
   npm install
   npm run dev
   ```

## ⚡ Usage

1. Upload an audio file via the interface.
2. Sonatrio will transcribe the media using Deepgram.
3. AI-generated content will be created with GPT.
4. Copy your generated blog post, social media caption, or summary.

## 🛠️ Tech Stack

- **Frontend:** Next.js
- **Backend:** Express.js, Supabase
- **AI Services:** Deepgram for transcription, OpenAI GPT for content generation

## 📫 Contact

For support or feature requests, please open an issue on the repository.

---

Happy content creation with **Sonatrio**! 🎶✍️