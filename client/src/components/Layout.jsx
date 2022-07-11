import { motion, AnimatePresence } from "framer-motion";
import { useContext } from "react";

import { Link, useLocation, useHistory,useParams } from "react-router-dom";

import { UserContext } from "../UserContext";
import OAuth2Login from 'react-simple-oauth2-login';
import Logo from "../assets/img/healthify.png";
import axios from 'axios';


export default function Layout(props) {
  const { address, contract } = useContext(UserContext);
  const onSuccess = response => console.log(response);
const onFailure = response => console.error(response);
  const location = useLocation();
  var history = useHistory();
  const rd = async () => {
    console.log("clicked");
    const {data} = await axios.get(`http://localhost:3000/token/${address}`);
    console.log(data);
    console.log(data.id);
    var sub = data.id;
    const t = await contract.methods.Identify2(sub).call();
    console.log(t);
    switch (t) {
      case "0":
        history.push("/register");
        break;
      case "1":
        history.push("/patient");
        break;
      case "2":
        history.push("/doctor");
        break;
      default:
        history.push("/");
        break;
    }
  };

  function Header() {
    return (
      <motion.div
        initial={{ opacity: 0.9, y: -500 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div
          style={{
            marginTop: "-30px",
            paddingTop: "60px",
            paddingBottom: "30px",
          }}
          className={`fixed-top shadow px-md-4 px-3 d-flex justify-content-between  align-items-center pl-md-5 pl-4 ${
            location.pathname === "/register" ? "bg-dark" : "bg-black"
          } `}
        >
          <div className="d-flex col-12 align-items-center justify-content-between">
            <Link
              to="/"
              style={{ fontSize: "2em" }}
              className="navbar-brand fw-bold text-primary me-md-5  me-3"
            >
              <img height="50px" src={Logo} alt="" srcset="" />
              <span style={{ marginLeft: "15px" }}>healthify</span>
            </Link>
            {location.pathname === "/" && (

              <div>
                 <div
                onClick={() => rd()}
                className="p-3 btn btn-outline-primary fw-bold btn-lg "
              >
              
              Get Started
              </div>
                  <OAuth2Login
                  className="p-3 btn btn-outline-primary fw-bold btn-lg "
                  authorizationUrl={`http://localhost:3000/auth/${address}`}
                  responseType="token"
                  // clientId="hackathon-participant"
                  redirectUri="http://localhost:3000/oauth-callback"
                  isCrossOrigin= "true"
                  extraParams={{ client_secret: 'q4_GkveX47i3M9wYXSkU5CKn3h',
                  token_endpoint_auth_method: 'client_secret_post'
                }}
                  buttonText="Scan Face"
                  onSuccess={onSuccess}
                  onFailure={onFailure}/>
              </div>
              
             
            )}
          </div>

          
        </div>
      </motion.div>
    );
  }

  return (
    <div>
      <Header />
      <AnimatePresence>
        <motion.div
          id="page-content"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 20 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 2.5 }}
          style={{ paddingTop: "6vh" }}
          className={
            props.contained ? "container overflow-hidden" : "overflow-hidden"
          }
        >
          {props.children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
