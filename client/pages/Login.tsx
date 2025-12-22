import { useAuth } from '../contexts/AuthContext';
import { LoginForm, LoginContainer } from '@shared/components/auth';

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
        emailPlaceholder="Email address"
        passwordPlaceholder="Password"
        submitText="Sign in"
      />
    </LoginContainer>
  );
}
