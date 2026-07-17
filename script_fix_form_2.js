const fs = require('fs');
const file = 'd:/Jcaedutech/jcaedutech-next/src/app/(auth)/login-register/AuthComponent.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'if (!formData.get(\'llms_billing_state\')) errors.llms_billing_state = "State is required";',
  'if (!formData.get(\'llms_billing_state\')) errors.llms_billing_state = "State is required";\n    if (!formData.get(\'llms_billing_address_1\')) errors.llms_billing_address_1 = "Address is required";\n    if (!formData.get(\'llms_billing_zip\')) errors.llms_billing_zip = "Postal / Zip Code is required";'
);

content = content.replace(
  'id="llms_billing_address_1" name="llms_billing_address_1" required="required" type="text" /></div>',
  'id="llms_billing_address_1" name="llms_billing_address_1" type="text" />{formErrors.llms_billing_address_1 && <div style={{color: "#991b1b", fontSize: "14px", marginTop: "5px"}}>{formErrors.llms_billing_address_1}</div>}</div>'
);

content = content.replace(
  'id="llms_billing_zip" name="llms_billing_zip" required="required" type="text" /></div>',
  'id="llms_billing_zip" name="llms_billing_zip" type="text" />{formErrors.llms_billing_zip && <div style={{color: "#991b1b", fontSize: "14px", marginTop: "5px"}}>{formErrors.llms_billing_zip}</div>}</div>'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully updated AuthComponent.js address and zip validation');
