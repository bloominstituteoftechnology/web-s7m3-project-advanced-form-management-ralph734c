// ❗ The ✨ TASKS inside this component are NOT IN ORDER.
// ❗ Check the README for the appropriate sequence to follow.
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as Yup from "yup";

const e = { // This is a dictionary of validation error messages.
  // username
  usernameRequired: 'username is required',
  usernameMin: 'username must be at least 3 characters',
  usernameMax: 'username cannot exceed 20 characters',
  // favLanguage
  favLanguageRequired: 'favLanguage is required',
  favLanguageOptions: 'favLanguage must be either javascript or rust',
  // favFood
  favFoodRequired: 'favFood is required',
  favFoodOptions: 'favFood must be either broccoli, spaghetti or pizza',
  // agreement
  agreementRequired: 'agreement is required',
  agreementOptions: 'agreement must be accepted',
}

const initialFormValues = {
  username: "",
  favLanguage: "",
  favFood: "",
  agreement: false
}

const initialFormErrors = {
  username: "",
  favLanguage: "",
  favFood: "",
  agreement: ""
}

const regURL = "https://webapis.bloomtechdev.com/registration";

// ✨ TASK: BUILD YOUR FORM SCHEMA HERE
// The schema should use the error messages contained in the object above.
const formSchema = Yup.object().shape({
  username: Yup
    .string()
    .min(3, e.usernameMin)
    .max(20, e.usernameMax)
    .required(e.usernameRequired),
  favLanguage: Yup
    .string()
    .oneOf(["javascript", "rust"], e.favLanguageOptions)
    .required(e.favLanguageRequired),
  favFood: Yup
    .string()
    .oneOf(["broccoli", "spaghetti", "pizza"], e.favFoodOptions)
    .required(e.favFoodRequired),
  agreement: Yup
    .boolean()
    .oneOf([true], e.agreementOptions)
    .required([true], e.agreementRequired)
})

export default function App() {
  // ✨ TASK: BUILD YOUR STATES HERE
  // You will need states to track (1) the form, (2) the validation errors,
  // (3) whether submit is disabled, (4) the success message from the server,
  // and (5) the failure message from the server.
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState(initialFormErrors);
  const [submitEnabled, setSubmitEnabled] = useState(false);
  const [serverSuccess, setServerSuccess] = useState("");
  const [serverFailure, setServerFailure] = useState("");

  // ✨ TASK: BUILD YOUR EFFECT HERE
  // Whenever the state of the form changes, validate it against the schema
  // and update the state that tracks whether the form is submittable.
  useEffect(() => {
    formSchema.isValid(formValues).then((isValid) => {
      setSubmitEnabled(isValid)
    });
  }, [formValues])

  const onChange = evt => {
    // ✨ TASK: IMPLEMENT YOUR INPUT CHANGE HANDLER
    // The logic is a bit different for the checkbox, but you can check
    // whether the type of event target is "checkbox" and act accordingly.
    // At every change, you should validate the updated value and send the validation
    // error to the state where we track frontend validation errors.
    let { type, checked, name, value } = evt.target;
    if (type === "checkbox") value = checked;
    setFormValues({ ...formValues, [name]: value});

    Yup
      .reach(formSchema, name)
      .validate(value)
      .then(() => {
        setErrors({ ...errors, [name]: "" });
      })
      .catch((err) => {
        setErrors({ ...errors, [name]: err.errors[0] })
      })
  }

  const onSubmit = evt => {
    // ✨ TASK: IMPLEMENT YOUR SUBMIT HANDLER
    // Lots to do here! Prevent default behavior, disable the form to avoid
    // double submits, and POST the form data to the endpoint. On success, reset
    // the form. You must put the success and failure messages from the server
    // in the states you have reserved for them, and the form
    // should be re-enabled.
    evt.preventDefault();
    axios
      .post(regURL, formValues)
      .then((res) => {
        setServerSuccess(res.data.message);
        setServerFailure("");
        setFormValues(initialFormValues);
      })
      .catch((err) => {
        setServerFailure(err.response);
        setServerSuccess("");
      })
  }

  return (
    <div> {/* TASK: COMPLETE THE JSX */}
      <h2>Create an Account</h2>
      <form onSubmit={onSubmit}>
        {serverSuccess && <h4 className="success">{serverSuccess}</h4>}
        {serverFailure && <h4 className="error">{serverFailure}</h4>}

        <div className="inputGroup">
          <label htmlFor="username">Username:</label>
          <input 
            id="username" 
            name="username" 
            type="text" 
            placeholder="Type Username" 
            onChange={onChange}
            value={formValues.username}
            />
          {errors.username && <div className="validation">{errors.username}</div>}
        </div>

        <div className="inputGroup">
          <fieldset>
            <legend>Favorite Language:</legend>
            <label>
              <input 
                type="radio" 
                name="favLanguage" 
                value="javascript" 
                onChange={onChange} 
                checked={formValues.favLanguage == "javascript"} 
                />
              JavaScript
            </label>
            <label>
              <input 
                type="radio" 
                name="favLanguage" 
                value="rust" 
                onChange={onChange} 
                checked={formValues.favLanguage == "rust"}
                />
              Rust
            </label>
          </fieldset>
          {errors.favLanguage && <div className="validation">{errors.favLanguage}</div>}
        </div>

        <div className="inputGroup">
          <label htmlFor="favFood">Favorite Food:</label>
          <select value={formValues.favFood} id="favFood" name="favFood" onChange={onChange} >
            <option value="">-- Select Favorite Food --</option>
            <option value="pizza">Pizza</option>
            <option value="spaghetti">Spaghetti</option>
            <option value="broccoli">Broccoli</option>
          </select>
          {errors.favFood && <div className="validation">{errors.favFood}</div>}
        </div>

        <div className="inputGroup">
          <label>
            <input 
              id="agreement" 
              type="checkbox" 
              name="agreement" 
              onChange={onChange} 
              checked={formValues.agreement}
              />
            Agree to our terms
          </label>
          {errors.agreement && <div className="validation">{errors.agreement}</div>}
        </div>

        <div>
          <input type="submit" disabled={!submitEnabled} />
        </div>
      </form>
    </div>
  )
}
