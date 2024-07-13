import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import logo from "../../Images/talentlogo.png";
import InputControl from "../InputControl/InputControl";
import { auth } from "../../firebase";
import styles from "./Signup.module.css";
import sideImage from "../../Images/sideImage.png"; // Add your side image here

function Signup() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    pass: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  const handleSubmission = () => {
    if (!values.name || !values.email || !values.pass) {
      setErrorMsg("Fill all fields");
      return;
    }


    setErrorMsg("");
    setSubmitButtonDisabled(true);

    createUserWithEmailAndPassword(auth, values.email, values.pass)
      .then(async (res) => {
        const user = res.user;
        await updateProfile(user, {
          displayName: values.name,
        });
        await sendEmailVerification(user);
        setSubmitButtonDisabled(false);
        setErrorMsg("Verification Email Is Sent, Please Verify Your Email.");
      })
      .catch((err) => {
        setSubmitButtonDisabled(false);
        setErrorMsg(err.message);
      });
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.container}>
      <div className={styles.rightSection}>
        <div className={styles.innerBox}>
          <div className={styles.logo}>
            <img src={logo} alt="Talent Logo" />
            <h6>
              <b>
                Welcome to Talent Corner - India’s Fastest Growing Recruitment Franchise Network
              </b>
            </h6>
          </div>
          <h1 className={styles.heading}>Sign up</h1>

          <InputControl
            label="Name"
            placeholder="Enter your name"
            onChange={(event) =>
              setValues((prev) => ({ ...prev, name: event.target.value }))
            }
          />
          <InputControl
            label="Email"
            placeholder="Enter email address"
            onChange={(event) =>
              setValues((prev) => ({ ...prev, email: event.target.value }))
            }
          />
          <div style={{ position: "relative" }}>
            <InputControl
              label="Password"
              type={showPassword ? "text" : "password"}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, pass: event.target.value }))
              }
              placeholder="Enter Password"
            />
          </div>
          <div style={{ position: "relative" }}>
            <input
              type="checkbox"
              checked={showPassword}
              onChange={handleTogglePassword}
              id="showPassword"
              style={{ right: "10px", top: "50%" }}
            />
            <label
              htmlFor="showPassword"
              style={{ marginLeft: "5px", color: "#675080" }}
            >
              Show Password
            </label>
          </div>

          <div className={styles.footer}>
            <b className={`${styles.error} ${errorMsg === "Verification Email Is Sent, Please Verify Your Email." ? styles.blinkingMessage : ""}`}>{errorMsg}</b>
            <button onClick={handleSubmission} disabled={submitButtonDisabled}>
              Signup
            </button>
            <p>
              Already have an account?{" "}
              <span>
                <Link to="/">Login</Link>
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className={styles.leftSection}>
        <img src={sideImage} alt="Side visual" />
      </div>
    </div>
  );
}

export default Signup;
