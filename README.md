# 🚀 Next.js Social Media Web App

A fully responsive **social media web app** built using **Next.js**, **Tailwind CSS**, and **shadcn/ui**. The app integrates with the **DummyJSON API** and includes authentication, post feeds, search, filtering, user profiles, and theme switching.

---

## 🌟 Features
- 🔐 **Authentication** (Login / Logout)
- 📝 **Post Feeds** (Fetch & Display Posts)
- 🔍 **Search & Filtering**
- 👤 **User Profiles**
- 🎨 **Dark Mode / Light Mode**
- ❤️ **Like & Dislike Posts**
- 📄 **Pagination**

---

## 🛠️ Tech Stack
- **Next.js** - React Framework
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI Components
- **DummyJSON API** - Data Source
- **MongoDB (Planned)** - Database for likes & posts
- **Firebase (Planned)** - Authentication & Storage

---

## 🔧 Installation & Setup

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Run the Development Server
```sh
npm run dev
```
> Open **http://localhost:3000** in your browser.

---

## 🚀 Deployment

### Deploy on Vercel
1. Push your code to **GitHub**.
2. Go to **[Vercel](https://vercel.com/)** and create a new project.
3. Import your GitHub repository.
4. Vercel auto-detects Next.js. Click **Deploy**.
5. Your app is live! 🎉

---

## 🛠️ Environment Variables
Create a **.env.local** file in the root directory and add the following:
```env
NEXT_PUBLIC_API_URL=https://dummyjson.com
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_MONGO_URI=your_mongodb_url
```
> Replace the placeholders with your actual credentials.

---

## 📂 Project Structure
```
📦 project-root
 ┣ 📂 api          # API Routes (Backend)
 ┣ 📂 components   # Reusable UI Components
 ┣ 📂 lib          # Helper Functions & Hooks
 ┣ 📂 pages        # Next.js Pages
 ┣ 📂 public       # Static Assets
 ┣ 📂 styles       # Global Styles (Tailwind)
 ┣ 📜 middleware.ts # Authentication Middleware
 ┗ 📜 next.config.js # Next.js Configurations
```

---

## ⚠️ Troubleshooting
### Authentication Issues
- Ensure **cookies are enabled** in your browser.
- Try **clearing site data** and logging in again.

### Redirect Issues
- Check if the **middleware.ts** file properly manages authentication.
- Make sure your **auth.ts** file updates state correctly:
```ts
logout: () => { set({ user: null, isAuthenticated: false }) }
```

### API Issues
- If posts are not loading, verify the **DummyJSON API**:
```sh
curl https://dummyjson.com/posts
```

---

## 📜 License
This project is **MIT Licensed**.

---

## 💡 Future Improvements
- ✅ **Real Authentication (Firebase)**
- ✅ **Persistent Storage (MongoDB)**
- ✅ **Live Comments & Replies**
- ✅ **Image Uploading for Posts**

---

Made by [Aryan](https://github.com/Aryan-Sonone)

