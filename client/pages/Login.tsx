import { useAuth } from '../contexts/AuthContext';
import { LoginForm } from '@shared/components/auth/LoginForm';
import { LoginContainer } from '@shared/components/auth/LoginContainer';

export default function Login() {
  const { signIn, user } = useAuth();

  return (
    <LoginContainer variant="client">
      <LoginForm
        onSubmit={signIn}
        title="Client Portal"
        subtitle="Sign in to your account"
        variant="client"
        user={user}
        redirectPath="/app"
        emailPlaceholder="Email address"
        passwordPlaceholder="Password"
        submitText="Sign in"
      />
    </LoginContainer>
  );
}
