import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { useLogin } from '@/features/auth/hooks/useLogin';

interface LocationState {
  from?: {
    pathname: string;
  };
}

/**
 * Login page
 * First page shown to unauthenticated users
 */
function Login(): JSX.Element {
  const loginMutation = useLogin();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) || {};

  const schema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  });

  type LoginFormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (values: LoginFormValues): Promise<void> => {
    try {
      await loginMutation.mutateAsync({ email: values.email, password: values.password });
      const redirectTo = state.from?.pathname || '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch {
      // Error toast already handled by useLogin hook
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-4 py-12">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-0 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left side - Image */}
        <div className="hidden md:block relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative h-full flex flex-col items-center justify-center p-12 text-white">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 mb-6">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <h2 className="text-4xl font-bold mb-4">Travel Agency</h2>
              <p className="text-lg text-white/90 leading-relaxed">
                Discover amazing hotels around the world. Book your perfect stay with ease and
                manage all your reservations in one place.
              </p>
            </div>
            <div className="mt-auto text-sm text-white/80">
              <p>Your journey starts here</p>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="flex flex-col justify-center p-8 md:p-12">
          <div className="text-center mb-8 md:hidden">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>
          <div className="hidden md:block mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your account to continue</p>
          </div>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Email field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                  Email address
                </label>
              </div>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register('email')}
                autoComplete="email"
                className="w-full"
                error={errors.email?.message}
              />
            </div>

            {/* Password field with eye toggle */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  Password
                </label>
              </div>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password')}
                autoComplete="current-password"
                className="w-full"
                error={errors.password?.message}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="text-slate-400 hover:text-slate-600 focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                }
              />
            </div>

            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>Use your test account credentials.</span>
            </div>

            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <>
                  <LoadingSpinner size="sm" /> <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
