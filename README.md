# 🎓 Converso - AI-Powered Learning Companion

**Converso** is a cutting-edge SaaS platform that provides real-time AI teaching companions for interactive learning across multiple subjects. Built with Next.js 15, React 19, and powered by advanced AI voice technology.

![Converso Logo](public/images/logo.svg)

## ✨ Features

### 🤖 AI Teaching Companions
- **Interactive AI Tutors**: Personalized learning companions for various subjects
- **Voice-Enabled Learning**: Real-time voice conversations with AI tutors
- **Subject-Specific Companions**: Specialized AI tutors for different academic areas
- **Adaptive Learning**: AI companions that adjust to your learning pace and style

### 📚 Multi-Subject Support
- **Mathematics**: Calculus, algebra, geometry, and more
- **Science**: Physics, chemistry, biology, neuroscience
- **Language & Literature**: English literature, vocabulary building
- **History**: World events, historical analysis
- **Coding**: Programming concepts, algorithms, data structures
- **Economics**: Market principles, supply & demand

### 🎯 Key Features
- **Companion Library**: Browse and discover AI tutors
- **Search & Filter**: Find companions by subject or topic
- **Bookmark System**: Save your favorite companions
- **Session Tracking**: Monitor your learning progress
- **User Authentication**: Secure login with Clerk
- **Responsive Design**: Works seamlessly on all devices

### 🎨 Modern UI/UX
- **Beautiful Interface**: Clean, modern design with Tailwind CSS
- **Subject Color Coding**: Visual organization by subject areas
- **Interactive Cards**: Engaging companion cards with animations
- **Mobile-First**: Optimized for mobile and desktop experiences

## 🚀 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives

### Backend & Services
- **Supabase** - Database and authentication
- **Clerk** - User authentication and management
- **VAPI AI** - Voice AI integration
- **Sentry** - Error monitoring and performance tracking

### Development Tools
- **ESLint** - Code linting and quality
- **Turbopack** - Fast bundler for development
- **PostCSS** - CSS processing

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/Ramiferjanii/saas-app.git
cd saas-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# VAPI AI
NEXT_PUBLIC_VAPI_WEB_TOKEN=your_vapi_token

# Sentry (Optional)
SENTRY_DSN=your_sentry_dsn
```

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📱 Usage

### Getting Started
1. **Sign Up/Login**: Create an account or sign in with existing credentials
2. **Browse Companions**: Explore the companion library
3. **Filter by Subject**: Use the subject filter to find specific tutors
4. **Search**: Use the search bar to find companions by topic
5. **Bookmark**: Save your favorite companions for quick access
6. **Launch Lessons**: Start interactive learning sessions with AI tutors

### Creating Custom Companions
1. Navigate to "New Companion"
2. Fill in companion details (name, subject, topic)
3. Configure voice settings
4. Save and start learning

## 🏗️ Project Structure

```
saas/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── companions/        # Companion pages
│   ├── sign-in/          # Authentication pages
│   └── ...
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── ...
├── lib/                  # Utility libraries
│   ├── actions/          # Server actions
│   └── ...
├── constants/            # App constants
├── types/               # TypeScript definitions
└── public/              # Static assets
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
- **Netlify**: Connect GitHub repo and deploy
- **Railway**: Deploy with one-click setup
- **DigitalOcean**: Use App Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **VAPI AI** for voice AI capabilities
- **Clerk** for authentication services
- **Supabase** for backend infrastructure
- **Next.js Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework

## 📞 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/Ramiferjanii/saas-app/issues)
- **Email**: [Your email here]
- **Documentation**: [Link to docs if available]

---

**Built with ❤️ by [Your Name]**

⭐ **Star this repo if you found it helpful!**