import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../context/useStore.js'

const pageCopy = {
  login: {
    title: 'Sign in',
    submit: 'Continue',
    subtitle: 'Sign in or create an account',
  },
  register: {
    title: 'Create an account',
    submit: 'Create account',
    subtitle: 'Join VASTRAA for a more personal shopping experience.',
  },
  forgot: {
    title: 'Reset your password',
    submit: 'Send reset link',
    subtitle: 'Enter your email to see the next step.',
  },
  reset: {
    title: 'Choose a new password',
    submit: 'Save password',
    subtitle: 'Update the password for your demo account.',
  },
}

function AuthPage({ mode }) {
  const navigate = useNavigate()
  const { register, signIn, user } = useStore()
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')
  const [email, setEmail] = useState('')
  const copy = pageCopy[mode] || pageCopy.login

  const showMessage = (text, type = 'success') => {
    setMessage(text)
    setMessageType(type)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    if (mode === 'login') {
      const signedInUser = signIn({ email })
      navigate('/account', { state: { welcomeName: signedInUser.name } })
      return
    }

    if (mode === 'register') {
      const password = formData.get('password')
      const confirmation = formData.get('confirmPassword')

      if (password !== confirmation) {
        showMessage('Your passwords do not match.', 'error')
        return
      }

      register({
        name: formData.get('name'),
        email: formData.get('email'),
      })
      navigate('/account')
      return
    }

    if (mode === 'forgot') {
      showMessage('Password reset is not connected in this demo.')
      return
    }

    if (mode === 'reset') {
      const password = formData.get('password')
      const confirmation = formData.get('confirmPassword')

      if (password !== confirmation) {
        showMessage('Your passwords do not match.', 'error')
        return
      }

      showMessage('Password updates are not connected in this demo.')
    }
  }

  return (
    <section className={`auth-page auth-page--${mode}`}>
      <div className="auth-page__frame">
        <header className="auth-page__header">
          <Link className="auth-page__brand" to="/" aria-label="VASTRAA home">
            <span>VASTRAA</span>
            <small>MADE TO BE WORN</small>
          </Link>
        </header>

        <div className="auth-page__main">
          <form className="auth-form" onSubmit={handleSubmit}>
            <h1>{copy.title}</h1>
            <p className="auth-form__subtitle">{copy.subtitle}</p>
            <p className="auth-form__demo">
              A VASTRAA demo experience. Account details stay in this browser.
            </p>

            {mode === 'login' && (
              <>
                {user?.email && (
                  <button
                    className="auth-form__saved-account"
                    type="button"
                    onClick={() => {
                      signIn({ name: user.name, email: user.email })
                      navigate('/account')
                    }}
                  >
                    <span className="auth-form__avatar" aria-hidden="true">
                      {(user.name || 'V').charAt(0).toUpperCase()}
                    </span>
                    <span className="auth-form__saved-copy">
                      <strong>Continue with saved account</strong>
                      <small>{user.email}</small>
                    </span>
                    <span className="auth-form__saved-mark" aria-hidden="true">
                      V.
                    </span>
                  </button>
                )}

                <div className="auth-form__quick-actions">
                  <Link className="auth-form__quick-action" to="/shop">
                    Continue as guest
                  </Link>
                  <Link className="auth-form__quick-action" to="/register">
                    Create an account
                  </Link>
                </div>
                <div className="auth-form__divider"><span>or</span></div>
              </>
            )}

            {mode === 'login' ? (
              <div className="auth-form__email-field">
                <label htmlFor="auth-email">Email</label>
                <div className="auth-form__email-control">
                  <input
                    autoComplete="email"
                    id="auth-email"
                    name="email"
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter your email"
                    required
                    type="email"
                    value={email}
                  />
                  <button aria-label="Continue with email" type="submit">
                    <span aria-hidden="true">→</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {mode === 'register' && (
                  <label className="auth-form__field">
                    <span>Full name</span>
                    <input autoComplete="name" name="name" required />
                  </label>
                )}

                {(mode === 'register' || mode === 'forgot') && (
                  <label className="auth-form__field">
                    <span>Email</span>
                    <input
                      autoComplete="email"
                      name="email"
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      type="email"
                      value={email}
                    />
                  </label>
                )}

                {(mode === 'register' || mode === 'reset') && (
                  <>
                    <label className="auth-form__field">
                      <span>Password</span>
                      <input
                        autoComplete="new-password"
                        minLength="6"
                        name="password"
                        required
                        type="password"
                      />
                    </label>
                    <label className="auth-form__field">
                      <span>Confirm password</span>
                      <input
                        autoComplete="new-password"
                        minLength="6"
                        name="confirmPassword"
                        required
                        type="password"
                      />
                    </label>
                  </>
                )}

                <button className="button auth-form__submit" type="submit">
                  {copy.submit}
                </button>
              </>
            )}

            {(mode === 'login' || mode === 'register') && (
              <label className="auth-form__marketing">
                <input defaultChecked type="checkbox" />
                <span>Keep me updated on new collections and VASTRAA news.</span>
              </label>
            )}

            {message && (
              <p
                className={`form-message${messageType === 'error' ? ' form-message--error' : ''}`}
                role={messageType === 'error' ? 'alert' : 'status'}
              >
                {message}
              </p>
            )}

            <div className="auth-form__terms">
              By continuing, you agree to our <Link to="/terms">Terms of service</Link> and{' '}
              <Link to="/privacy-policy">Privacy policy</Link>.
            </div>

            <nav className="auth-form__links" aria-label="Account options">
              {mode === 'login' && (
                <Link to="/forgot-password">Forgot your password?</Link>
              )}
              {mode === 'register' && (
                <span>
                  Already have an account? <Link to="/login">Sign in</Link>
                </span>
              )}
              {mode === 'forgot' && <Link to="/login">Return to sign in</Link>}
              {mode === 'reset' && <Link to="/login">Return to sign in</Link>}
            </nav>
          </form>
        </div>

        <footer className="auth-page__footer">
          <Link to="/privacy-policy">Privacy policy</Link>
        </footer>
      </div>
    </section>
  )
}

export default AuthPage
