import Logo from "./components/Logo/Logo";
import LogoutButton from "./components/LogoutButton/LogoutButton";

const Header = () => {
  return (
    <div className="navbar py-3">
      <Logo height={40} />
      <LogoutButton />
    </div>
  );
};

export default Header;
