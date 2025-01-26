const Login = () => {
  return (
    <div className="flex-grow-1 d-flex justify-content-center align-items-center">
      <form className="card p-4 mx-auto w-100" style={{ maxWidth: "400px" }}>
        <p className="h4 text-center mb-4">Dobrodošli pri BISOL!</p>
        <div className="form-group">
          <label htmlFor="email-input" className="mb-2">
            E-poštni naslov
          </label>
          <input
            type="email"
            className="form-control"
            id="email-input"
            placeholder="Enter email"
          />
        </div>
        <div className="form-group mt-3">
          <label htmlFor="password-input" className="mb-2">
            Geslo
          </label>
          <input
            type="password"
            className="form-control"
            id="password-input"
            placeholder="Password"
          />
        </div>
        <button type="submit" className="btn btn-primary text-white mt-5">
          Prijava
        </button>
      </form>
    </div>
  );
};

export default Login;
