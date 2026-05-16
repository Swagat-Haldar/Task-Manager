# Team Task Manager - Frontend (Next.js)

The frontend for Team Task Manager is a modern React application built with Next.js, featuring a premium workspace aesthetic.

## 🎨 Design System
- **Framework**: Next.js 15 (App Router).
- **Styling**: Tailwind CSS with OKLCH colors.
- **Components**: shadcn/ui (Base UI version).
- **Icons**: Lucide React.
- **Layout**: Sidebar-first workspace layout with glassmorphic elements.

## 🛠 Setup & Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

## 🏗 Build for Production
```bash
npm run build
```
The project is configured for **standalone** output, making it optimized for Docker/Railway deployments.

## 📦 Key Libraries
- `axios`: API client with credential support.
- `lucide-react`: Professional icon set.
- `clsx` & `tailwind-merge`: Utility for dynamic class names.
