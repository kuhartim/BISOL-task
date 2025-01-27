import { useState } from "react";
import useLogin from "../../features/auth/hooks/useLogin/useLogin";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { loginWithUsername } = useLogin();

  const onUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let invalid = false;

    if (!username) {
      setUsernameError("Vnesi uporabniško ime");
      invalid = true;
    }

    if (!password) {
      setPasswordError("Vnesi geslo");
      invalid = true;
    }

    if (invalid) {
      return;
    }

    setUsernameError("");
    setPasswordError("");
    setLoading(true);

    loginWithUsername(username, password)
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          setUsernameError("Napačno uporabniško ime ali geslo");
          setPasswordError("Napačno uporabniško ime ali geslo");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex-grow-1 d-flex justify-content-center align-items-center">
      <form
        className="card p-4 mx-auto w-100"
        style={{ maxWidth: "400px" }}
        onSubmit={onSubmit}
        noValidate
      >
        <p className="h4 text-center mb-4">Dobrodošli pri BISOL!</p>
        <div className="form-group">
          <label htmlFor="username-input" className="mb-2">
            Uporabniško ime
          </label>
          <input
            type="text"
            className={`form-control ${usernameError ? "is-invalid" : ""}`}
            id="username-input"
            placeholder="Vnesi uporabniško ime"
            value={username}
            onChange={onUsernameChange}
          />
          <div className="invalid-feedback">{usernameError}</div>
        </div>
        <div className="form-group mt-3">
          <label htmlFor="password-input" className="mb-2">
            Geslo
          </label>
          <input
            type="password"
            className={`form-control ${passwordError ? "is-invalid" : ""}`}
            id="password-input"
            placeholder="Vnesi geslo"
            value={password}
            onChange={onPasswordChange}
          />
          <div className="invalid-feedback">{passwordError}</div>
        </div>
        <button
          type="submit"
          className="btn btn-primary text-white mt-5"
          disabled={loading}
        >
          {loading ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            "Prijava"
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;
