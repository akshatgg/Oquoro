import SignupForm from '@/components/pagesComponents/auth/signup/SignupForm';


export const metadata = {
    title: 'Sign Up - Your App Name',
    description: 'Create a new account to get started',
  };
  
  export default function SignupPage() {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <SignupForm />
        </div>
      </div>
    );
  }