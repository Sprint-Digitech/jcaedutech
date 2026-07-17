const fs = require('fs');
const file = 'd:/Jcaedutech/jcaedutech-next/src/app/(auth)/login-register/AuthComponent.js';
let content = fs.readFileSync(file, 'utf8');

// 1. Add formData state
content = content.replace(
  'const [formErrors, setFormErrors] = useState({});',
  `const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', email_address: '', email_address_confirm: '', password: '', password_confirm: '',
    llms_phone: '', llms_billing_address_1: '', llms_billing_address_2: '',
    llms_billing_city: '', llms_billing_state: '', llms_billing_zip: '', llms_billing_country: 'IN'
  });
  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));`
);

// 2. Modify handleRegister
const startMarker = 'const handleRegister = async (e) => {';
const endMarker = '  };';
const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker, startIndex) + endMarker.length;

if (startIndex !== -1 && endIndex !== -1) {
  const newHandleRegister = `const handleRegister = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRegistering(true);
    setRegisterStatus(null);
    setFormErrors({});

    let errors = {};
    let newFormData = { ...formData };

    if (!formData.first_name) { errors.first_name = "First Name is required"; newFormData.first_name = ''; }
    if (!formData.last_name) { errors.last_name = "Last Name is required"; newFormData.last_name = ''; }
    
    if (!formData.email_address) { 
      errors.email_address = "Email Address is required"; 
      newFormData.email_address = ''; 
    } else if (formData.email_address !== formData.email_address_confirm) {
      errors.email_address = "Email Addresses do not match";
      newFormData.email_address = '';
      newFormData.email_address_confirm = '';
    }
    
    if (!formData.password) {
      errors.password = "Password is required";
      newFormData.password = '';
    } else if (formData.password !== formData.password_confirm) {
      errors.password_confirm = "Passwords do not match";
      newFormData.password_confirm = '';
      newFormData.password = ''; 
    }

    if (!formData.llms_billing_city) { errors.llms_billing_city = "City is required"; newFormData.llms_billing_city = ''; }
    if (!formData.llms_billing_state) { errors.llms_billing_state = "State is required"; newFormData.llms_billing_state = ''; }
    if (!formData.llms_billing_address_1) { errors.llms_billing_address_1 = "Address is required"; newFormData.llms_billing_address_1 = ''; }
    if (!formData.llms_billing_zip) { errors.llms_billing_zip = "Postal / Zip Code is required"; newFormData.llms_billing_zip = ''; }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setFormData(newFormData); 
      setIsRegistering(false);
      return;
    }

    const data = {
      name: formData.first_name + ' ' + formData.last_name,
      email: formData.email_address,
      course: 'General Registration',
      status: 'Pending'
    };

    try {
      const { error } = await supabase
        .from('registration_submissions')
        .insert([data]);

      if (error) throw error;
      setRegisterStatus('success');
      setFormData({
        first_name: '', last_name: '', email_address: '', email_address_confirm: '', password: '', password_confirm: '',
        llms_phone: '', llms_billing_address_1: '', llms_billing_address_2: '',
        llms_billing_city: '', llms_billing_state: '', llms_billing_zip: '', llms_billing_country: 'IN'
      });
    } catch (err) {
      console.error('Registration error:', err);
      setRegisterStatus('error');
    } finally {
      setIsRegistering(false);
    }
  };`;
  content = content.substring(0, startIndex) + newHandleRegister + content.substring(endIndex);
}

// 3. Inject value and onChange to inputs
const fields = [
  'email_address', 'email_address_confirm', 'password', 'password_confirm',
  'first_name', 'last_name', 'llms_phone', 'llms_billing_address_1',
  'llms_billing_address_2', 'llms_billing_city', 'llms_billing_zip'
];

fields.forEach(field => {
  const regex = new RegExp('(id="' + field + '"\\s+name="' + field + '"[^>]*?)(/?>)', 'g');
  content = content.replace(regex, (match, p1, p2) => {
    return p1 + ' value={formData.' + field + '} onChange={handleChange} ' + p2;
  });
});

// Select fields need value and onChange specifically
content = content.replace(
  'id="llms_billing_country" name="llms_billing_country" defaultValue="IN"',
  'id="llms_billing_country" name="llms_billing_country" value={formData.llms_billing_country} onChange={handleChange}'
);
content = content.replace(
  'id="llms_billing_state" name="llms_billing_state"',
  'id="llms_billing_state" name="llms_billing_state" value={formData.llms_billing_state} onChange={handleChange}'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Made form inputs controlled and added auto-clear logic for invalid fields');
