import LoginForm from '@/components/pagesComponents/auth/login/LoginForm';


export default function page() {
  return (
    <div >
     
      <LoginForm />
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function generateMetadata({ params }) {
  return {
    title: 'Login',
  };
}
