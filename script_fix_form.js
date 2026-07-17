const fs = require('fs');
const file = 'd:/Jcaedutech/jcaedutech-next/src/app/(auth)/login-register/AuthComponent.js';
let content = fs.readFileSync(file, 'utf8');

// 1. Add formErrors state
content = content.replace(
  'const [isRegistering, setIsRegistering] = useState(false);',
  'const [isRegistering, setIsRegistering] = useState(false);\n  const [formErrors, setFormErrors] = useState({});'
);

// 2. Replace handleRegister
const startMarker = 'const handleRegister = async (e) => {';
const endMarker = '  };';
const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker, startIndex) + endMarker.length;

if (startIndex !== -1 && endIndex !== -1) {
  const newHandleRegister = `const handleRegister = async (e) => {
    e.preventDefault();
    setIsRegistering(true);
    setRegisterStatus(null);
    setFormErrors({});

    const formData = new FormData(e.target);
    const password = formData.get('password');
    const passwordConfirm = formData.get('password_confirm');
    
    let errors = {};
    if (!formData.get('first_name')) errors.first_name = "First Name is required";
    if (!formData.get('last_name')) errors.last_name = "Last Name is required";
    if (!formData.get('email_address')) errors.email_address = "Email Address is required";
    if (!password) errors.password = "Password is required";
    if (password !== passwordConfirm) errors.password_confirm = "Passwords do not match";
    if (!formData.get('llms_billing_city')) errors.llms_billing_city = "City is required";
    if (!formData.get('llms_billing_state')) errors.llms_billing_state = "State is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsRegistering(false);
      return;
    }

    const data = {
      name: formData.get('first_name') + ' ' + formData.get('last_name'),
      email: formData.get('email_address'),
      course: 'General Registration',
      status: 'Pending'
    };

    try {
      const { error } = await supabase
        .from('registration_submissions')
        .insert([data]);

      if (error) throw error;
      setRegisterStatus('success');
      e.target.reset();
    } catch (err) {
      console.error('Registration error:', err);
      setRegisterStatus('error');
    } finally {
      setIsRegistering(false);
    }
  };`;
  content = content.substring(0, startIndex) + newHandleRegister + content.substring(endIndex);
}

// 3. Change success message
content = content.replace(
  'Thank you for registering! We will contact you soon.',
  'Registration successfully completed.'
);

// 4. Form noValidate
content = content.replace(
  '<form onSubmit={handleRegister} className="llms-new-person-form register">',
  '<form onSubmit={handleRegister} className="llms-new-person-form register" noValidate>'
);

// 5. Add error messages to fields
content = content.replace(
  'id="email_address" name="email_address" required="required" type="email" /></div>',
  'id="email_address" name="email_address" type="email" />{formErrors.email_address && <div style={{color: "#991b1b", fontSize: "14px", marginTop: "5px"}}>{formErrors.email_address}</div>}</div>'
);

content = content.replace(
  'id="password" minLength="6" name="password" required="required" type="password" /></div>',
  'id="password" name="password" type="password" />{formErrors.password && <div style={{color: "#991b1b", fontSize: "14px", marginTop: "5px"}}>{formErrors.password}</div>}</div>'
);

content = content.replace(
  'id="password_confirm" minLength="8" name="password_confirm" required="required" type="password" /></div>',
  'id="password_confirm" name="password_confirm" type="password" />{formErrors.password_confirm && <div style={{color: "#991b1b", fontSize: "14px", marginTop: "5px"}}>{formErrors.password_confirm}</div>}</div>'
);

content = content.replace(
  'id="first_name" name="first_name" required="required" type="text" /></div>',
  'id="first_name" name="first_name" type="text" />{formErrors.first_name && <div style={{color: "#991b1b", fontSize: "14px", marginTop: "5px"}}>{formErrors.first_name}</div>}</div>'
);

content = content.replace(
  'id="last_name" name="last_name" required="required" type="text" /></div>',
  'id="last_name" name="last_name" type="text" />{formErrors.last_name && <div style={{color: "#991b1b", fontSize: "14px", marginTop: "5px"}}>{formErrors.last_name}</div>}</div>'
);

content = content.replace(
  'id="llms_billing_city" name="llms_billing_city" required="required" type="text" /></div>',
  'id="llms_billing_city" name="llms_billing_city" type="text" />{formErrors.llms_billing_city && <div style={{color: "#991b1b", fontSize: "14px", marginTop: "5px"}}>{formErrors.llms_billing_city}</div>}</div>'
);

// 6. Fix Country and State
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('id="llms_billing_country"')) {
    lines[i] = '<div className="llms-form-field type-select llms-cols-12 llms-cols-last llms-is-required llms-l10n-country-select"><label htmlFor="llms_billing_country">Country<span className="llms-required">*</span></label><select className="llms-field-select llms-select2" id="llms_billing_country" name="llms_billing_country" defaultValue="IN"><option value="IN">India</option></select></div><div className="clear"></div>';
  }
  if (lines[i].includes('id="llms_billing_state"')) {
    lines[i] = `<div className="llms-form-field type-select llms-cols-6 llms-is-required llms-l10n-state-select"><label htmlFor="llms_billing_state">State / Region<span className="llms-required">*</span></label><select className="llms-field-select llms-select2" id="llms_billing_state" name="llms_billing_state"><option value="">Select a State</option><option value="AP">Andhra Pradesh</option><option value="AR">Arunachal Pradesh</option><option value="AS">Assam</option><option value="BR">Bihar</option><option value="CG">Chhattisgarh</option><option value="GA">Goa</option><option value="GJ">Gujarat</option><option value="HR">Haryana</option><option value="HP">Himachal Pradesh</option><option value="JH">Jharkhand</option><option value="KA">Karnataka</option><option value="KL">Kerala</option><option value="MP">Madhya Pradesh</option><option value="MH">Maharashtra</option><option value="MN">Manipur</option><option value="ML">Meghalaya</option><option value="MZ">Mizoram</option><option value="NL">Nagaland</option><option value="OD">Odisha</option><option value="PB">Punjab</option><option value="RJ">Rajasthan</option><option value="SK">Sikkim</option><option value="TN">Tamil Nadu</option><option value="TS">Telangana</option><option value="TR">Tripura</option><option value="UP">Uttar Pradesh</option><option value="UK">Uttarakhand</option><option value="WB">West Bengal</option><option value="AN">Andaman and Nicobar Islands</option><option value="CH">Chandigarh</option><option value="DN">Dadra and Nagar Haveli and Daman and Diu</option><option value="DL">Delhi</option><option value="LD">Lakshadweep</option><option value="PY">Puducherry</option><option value="LA">Ladakh</option><option value="JK">Jammu and Kashmir</option></select>
    {formErrors.llms_billing_state && <div style={{color: "#991b1b", fontSize: "14px", marginTop: "5px"}}>{formErrors.llms_billing_state}</div>}
    </div><div className="clear"></div>`;
  }
}
content = lines.join('\n');

// 7. Remove old password error block
content = content.replace(
  /{registerStatus === 'error_password' && \([\s\S]*?\}\)/,
  ''
);

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully updated AuthComponent.js');
