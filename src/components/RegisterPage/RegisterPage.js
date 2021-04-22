import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import firebase from "../../firebase";
import md5 from "md5"; // unique value

function RegisterPage() {
  const { register, watch, errors, handleSubmit } = useForm();
  const [errorFromSubmit, setErrorFromSubmit] = useState("");
  const [loading, setLoading] = useState(false);

  const password = useRef(); // useRef는 state관리와 같다.
  // ref는 javascript의 getElementById, querySelector 같은 DOM Selector 함수와 같다.
  password.current = watch("password");

  const onSubmit = async (data) => {
    // react-hook-form에서 onSubmit을 지정할 때 파라미터에 form 정보가 담김.
    try {
      setLoading(true);
      // firbase의 auth에 접근
      let createdUser = await firebase
        .auth()
        .createUserWithEmailAndPassword(data.email, data.password);
      console.log("createdUser", createdUser);

      await createdUser.user.updateProfile({
        displayName: data.name,
        photoURL: `http://gravatar.com/avatar/${md5(
          createdUser.user.email
        )}?d=identicon`,
      });

      //Firebase 데이터베이스에 저장해주기
      await firebase.database().ref("users").child(createdUser.user.uid).set({
        // ref("경로 및 위치"), uid === unique id
        name: createdUser.user.displayName,
        image: createdUser.user.photoURL,
      });

      setLoading(false);
    } catch (error) {
      setErrorFromSubmit(error.message); // try catch문을 쓰는 이유: console에 찍히는게 아닌 client에 찍혀야되기 때문
      setLoading(false);
      setTimeout(() => {
        setErrorFromSubmit("");
      }, 5000);
    }
  };

  return (
    <div className="auth-wrapper">
      <div style={{ textAlign: "center" }}>
        <h3>Register</h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Email</label>
        <input
          name="email"
          type="email"
          ref={register({ required: true, pattern: /^\S+@\S+$/i })}
        />
        {errors.email && <p>This email field is required</p>}

        <label>Name</label>
        <input name="name" ref={register({ required: true, maxLength: 10 })} />
        {errors.name && errors.name.type === "required" && (
          <p>This name field is required</p>
        )}
        {errors.name && errors.name.type === "maxLength" && (
          <p>Your input exceed maximum length</p>
        )}

        <label>Password</label>
        <input
          name="password"
          type="password"
          ref={register({ required: true, minLength: 6 })}
        />
        {errors.password && errors.password.type === "required" && (
          <p>This password field is required</p>
        )}
        {errors.password && errors.password.type === "minLength" && (
          <p>Password must have at least 6 characters</p>
        )}

        <label>Password Confirm</label>
        <input
          name="password_confirm"
          type="password"
          ref={register({
            required: true,
            validate: (value) => value === password.current,
          })}
        />
        {errors.password_confirm &&
          errors.password_confirm.type === "required" && (
            <p>This password confirm field is required</p>
          )}
        {errors.password_confirm &&
          errors.password_confirm.type === "validate" && (
            <p>The passwords do not match</p>
          )}

        {errorFromSubmit && <p>{errorFromSubmit}</p>}

        <input type="submit" disabled={loading} />
        <Link style={{ color: "gray", textDecoration: "none" }} to="login">
          이미 아이디가 있다면...{" "}
        </Link>
      </form>
    </div>
  );
}

export default RegisterPage;
