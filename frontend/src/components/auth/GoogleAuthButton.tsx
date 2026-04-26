'use client';

import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { googleAuth, clearError } from '@store/slices/authSlice';

interface Props {
  mode?: 'login' | 'register';
}

export default function GoogleAuthButton({ mode = 'login' }: Props) {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error('Google credential olinmadi');
      return;
    }
    dispatch(clearError());
    const result = await (dispatch as any)(
      googleAuth({ credential: credentialResponse.credential })
    );
    if (googleAuth.fulfilled.match(result)) {
      const payload: any = result.payload;
      if (payload?.requires2FA) {
        router.push('/auth/2fa-verify');
        return;
      }
      if (payload?.requiresEmailVerification) {
        const email = encodeURIComponent(payload.email || '');
        router.push(`/auth/verify-email?email=${email}`);
        return;
      }
      toast.success(
        mode === 'register'
          ? "Google orqali ro'yxatdan o'tdingiz!"
          : 'Google orqali muvaffaqiyatli kirdingiz!'
      );
      router.push('/');
    }
  };

  return (
    <div className="w-full flex justify-center [&>div]:w-full [&>div>div]:w-full [&_iframe]:w-full">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => toast.error('Google orqali kirish amalga oshmadi')}
        theme="filled_black"
        size="large"
        shape="rectangular"
        width="380"
        text={mode === 'register' ? 'signup_with' : 'continue_with'}
        useOneTap={false}
      />
    </div>
  );
}
