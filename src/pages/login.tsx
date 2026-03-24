import { Navigate } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { LoginForm } from '@/features/auth/LoginForm';
import { useAuth } from '@/features/auth/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <Activity className="w-10 h-10 text-primary-500 mb-4" />
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-healthcare-background p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg mb-4">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">HealthDash Pro</h1>
          <p className="text-gray-500 mt-2">Sign in to your practitioner account</p>
        </div>
        
        <Card className="border-0 shadow-xl shadow-gray-200/50">
          <CardHeader>
            <CardTitle className="text-xl text-center">Authentication</CardTitle>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
