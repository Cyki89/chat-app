import { Link } from "react-router-dom";

import { useApi } from "../../context/ApiContext";

const NavLink = ({ title, to }) => {
  const { apiAvailable } = useApi();
  return (
    <Link className="navbar-link" to={to} reloadDocument={!apiAvailable}>
      {title}
    </Link>
  );
};

export default NavLink;
