import { BackgroundGradient } from "@/components/ui/BackgroundGradient";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { QuizNavigationProvider } from "@/contexts/QuizNavigationContext";
import { ProtectedRoute, PublicRoute } from "@/components/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import About from "./pages/About";
import Results from "./pages/Results";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import QuizAttempt from "./pages/QuizAttempt";
import QuizReview from "./pages/QuizReview";
import NotFound from "./pages/NotFound";
import Quiz from "./pages/Quiz";


const queryClient = new QueryClient();

// Layout component that wraps pages with Navbar and Footer
const Layout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);

// Header-only layout for quiz pages (no footer for better focus)
const HeaderOnlyLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Navbar />
    {children}
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="quizgen-ui-theme">
      <AuthProvider>
        <QuizNavigationProvider>
          <TooltipProvider>
            <BackgroundGradient />
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                {/* Routes with Layout (Navbar + Footer) */}
                <Route path="/" element={<Layout><Index /></Layout>} />
                <Route path="/dashboard" element={<Layout><ProtectedRoute><Dashboard /></ProtectedRoute></Layout>} />
                <Route path="/categories" element={<Layout><Categories /></Layout>} />
                <Route path="/categories/:category" element={<Layout><Categories /></Layout>} />
                <Route path="/about" element={<Layout><About /></Layout>} />
                <Route path="/results" element={<Layout><Results /></Layout>} />
                <Route path="/leaderboard" element={<Layout><Leaderboard /></Layout>} />
                <Route path="/profile" element={<Layout><ProtectedRoute><Profile /></ProtectedRoute></Layout>} />

                {/* Quiz routes with Header-only layout (no footer for focus) */}
                <Route path="/quiz/start/:quizId" element={<HeaderOnlyLayout><ProtectedRoute><QuizAttempt /></ProtectedRoute></HeaderOnlyLayout>} />
                <Route path="/quiz/review/:attemptId" element={<Layout><ProtectedRoute><QuizReview /></ProtectedRoute></Layout>} />

                {/* Public Quiz Detail Page */}
                <Route path="/quiz/:quizId" element={<Layout><Quiz /></Layout>} />

                {/* Auth routes without Layout */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<Layout><NotFound /></Layout>} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QuizNavigationProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
