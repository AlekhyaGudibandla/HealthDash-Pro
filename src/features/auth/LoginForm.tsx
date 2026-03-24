import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/services/firebase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useNavigate } from 'react-router-dom';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setAuthError(null);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, data.email, data.password);
      } else {
        await createUserWithEmailAndPassword(auth, data.email, data.password);
      }
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential') {
        setAuthError('Invalid email or password.');
      } else if (err.code === 'auth/email-already-in-use') {
        setAuthError('An account with this email already exists.');
      } else {
        setAuthError(err.message || 'Authentication failed. Please check your credentials.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
      {authError && (
        <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm border border-red-200">
          {authError}
        </div>
      )}
      
      <Input
        id="email"
        label="Email address"
        type="email"
        autoComplete="email"
        placeholder="doctor@hospital.com"
        {...register('email')}
        error={errors.email?.message}
      />
      
      <Input
        id="password"
        label="Password"
        type="password"
        autoComplete={isLogin ? "current-password" : "new-password"}
        placeholder="••••••••"
        {...register('password')}
        error={errors.password?.message}
      />
      
      <Button type="submit" className="w-full" isLoading={isSubmitting}>
        {isLogin ? 'Sign in' : 'Create Account'}
      </Button>
      
      <div className="mt-4 text-sm text-gray-500 text-center">
        {isLogin ? (
          <p>
            Don't have an account?{' '}
            <button type="button" onClick={() => setIsLogin(false)} className="text-primary-600 hover:text-primary-800 font-medium">
              Create one
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <button type="button" onClick={() => setIsLogin(true)} className="text-primary-600 hover:text-primary-800 font-medium">
              Sign in
            </button>
          </p>
        )}
      </div>
    </form>
  );
}
