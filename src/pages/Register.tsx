import { useState } from 'react';
import { Eye, EyeOff, Leaf, Lock, Mail, User, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/store/AuthContext';
import { toast } from 'sonner';

interface RegisterProps {
  onNavigate: (page: 'home' | 'shop' | 'product' | 'cart' | 'checkout' | 'login' | 'register' | 'orders' | 'admin', productId?: string) => void;
}

export default function Register({ onNavigate }: RegisterProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (!agreeTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    setIsLoading(true);

    const success = await register(name, email, password);
    
    if (success) {
      toast.success('Account created successfully!');
      onNavigate('home');
    } else {
      toast.error('Email already exists');
    }
    
    setIsLoading(false);
  };

  const passwordStrength = () => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strength = passwordStrength();
  const strengthColor = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-600'][strength - 1] || 'bg-gray-200';

  return (
    <div className="pt-20 lg:pt-24 pb-16 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 mb-6"
          >
            <div className="w-12 h-12 bg-forest rounded-full flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="font-display text-2xl font-bold text-charcoal">
              Fresh<span className="text-forest">Harvest</span>
            </span>
          </button>
          <h1 className="font-display text-3xl font-bold text-charcoal mb-2">
            Create Account
          </h1>
          <p className="text-gray">
            Join us for fresh, organic produce delivered to your door
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-2xl shadow-soft p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {/* Password Strength */}
              {password && (
                <div className="space-y-1">
                  <div className="flex gap-1 h-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-full ${i <= strength ? strengthColor : 'bg-gray-200'}`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray">
                    {strength < 3 ? 'Weak' : strength < 5 ? 'Good' : 'Strong'} password
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-500">Passwords do not match</p>
              )}
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <Checkbox
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
              />
              <span className="text-sm text-gray">
                I agree to the{' '}
                <button
                  type="button"
                  onClick={() => toast.info('Terms page coming soon!')}
                  className="text-forest hover:underline"
                >
                  Terms of Service
                </button>{' '}
                and{' '}
                <button
                  type="button"
                  onClick={() => toast.info('Privacy policy coming soon!')}
                  className="text-forest hover:underline"
                >
                  Privacy Policy
                </button>
              </span>
            </label>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-forest hover:bg-forest/90 text-white h-12"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Benefits */}
          <div className="mt-6 space-y-3">
            <p className="text-sm font-medium text-charcoal">Benefits of joining:</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                'Fast checkout',
                'Order tracking',
                'Exclusive offers',
                'Save favorites',
              ].map((benefit) => (
                <div key={benefit} className="flex items-center gap-2 text-sm text-gray">
                  <Check className="w-4 h-4 text-forest" />
                  {benefit}
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray">Or</span>
            </div>
          </div>

          {/* Sign In Link */}
          <p className="text-center text-gray">
            Already have an account?{' '}
            <button
              onClick={() => onNavigate('login')}
              className="text-forest font-medium hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
