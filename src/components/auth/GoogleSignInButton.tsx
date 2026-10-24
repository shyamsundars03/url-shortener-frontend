import { redirectToGoogleOAuth } from '../../services/auth.service';

export function GoogleSignInButton() {
  return (
    <button type="button" className="btn btn-google btn-block" onClick={redirectToGoogleOAuth}>
      Continue with Google
    </button>
  );
}
