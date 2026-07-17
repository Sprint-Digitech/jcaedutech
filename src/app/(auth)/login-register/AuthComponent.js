
"use client";
/* eslint-disable react/no-unescaped-entities, @next/next/no-img-element */
import React from 'react';
import ScriptRunner from '@/app/ScriptRunner';
import { useState } from 'react';
import { supabase } from '@/utils/supabase';

export default function AuthComponent() {

  const [isRegistering, setIsRegistering] = useState(false);
  const [registerStatus, setRegisterStatus] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', email_address: '', email_address_confirm: '', password: '', password_confirm: '',
    llms_phone: '', llms_billing_address_1: '', llms_billing_address_2: '',
    llms_billing_city: '', llms_billing_state: '', llms_billing_zip: '', llms_billing_country: 'IN'
  });
  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleRegister = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRegistering(true);
    setRegisterStatus(null);
    setFormErrors({});

    const domFormData = new FormData(e.target);
    const realData = {
      first_name: domFormData.get('first_name') || '',
      last_name: domFormData.get('last_name') || '',
      email_address: domFormData.get('email_address') || '',
      email_address_confirm: domFormData.get('email_address_confirm') || '',
      password: domFormData.get('password') || '',
      password_confirm: domFormData.get('password_confirm') || '',
      llms_phone: domFormData.get('llms_phone') || '',
      llms_billing_address_1: domFormData.get('llms_billing_address_1') || '',
      llms_billing_address_2: domFormData.get('llms_billing_address_2') || '',
      llms_billing_city: domFormData.get('llms_billing_city') || '',
      llms_billing_state: domFormData.get('llms_billing_state') || '',
      llms_billing_zip: domFormData.get('llms_billing_zip') || '',
      llms_billing_country: domFormData.get('llms_billing_country') || 'IN'
    };

    let errors = {};
    let newFormData = { ...realData };

    if (!realData.first_name) { errors.first_name = "First Name is required"; }
    if (!realData.last_name) { errors.last_name = "Last Name is required"; }
    
    if (!realData.email_address) { 
      errors.email_address = "Email Address is required"; 
    } else if (realData.email_address !== realData.email_address_confirm) {
      errors.email_address = "Email Addresses do not match";
      newFormData.email_address = '';
      newFormData.email_address_confirm = '';
    }
    
    if (!realData.password) {
      errors.password = "Password is required";
    } else if (realData.password !== realData.password_confirm) {
      errors.password_confirm = "Passwords do not match";
      newFormData.password_confirm = '';
      newFormData.password = ''; 
    }

    if (!realData.llms_billing_city) { errors.llms_billing_city = "City is required"; }
    if (!realData.llms_billing_state) { errors.llms_billing_state = "State is required"; }
    if (!realData.llms_billing_address_1) { errors.llms_billing_address_1 = "Address is required"; }
    if (!realData.llms_billing_zip) { errors.llms_billing_zip = "Postal / Zip Code is required"; }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setFormData(newFormData); 
      setIsRegistering(false);
      return;
    }

    // Check for duplicate email
    try {
      const { data: existingUsers, error: checkError } = await supabase
        .from('registration_submissions')
        .select('email')
        .eq('email', realData.email_address);
      
      if (checkError) throw checkError;

      if (existingUsers && existingUsers.length > 0) {
        setFormErrors({ email_address: "This email address is already registered." });
        setFormData(newFormData);
        setIsRegistering(false);
        return;
      }
    } catch (err) {
      console.error('Error checking existing email:', err);
    }

    const data = {
      name: realData.first_name + ' ' + realData.last_name,
      email: realData.email_address,
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
  };

  return (
    <>
      <style>{`
        body {
          background-color: #f8fafc;
        }
        .llms-student-dashboard {
          max-width: 1300px;
          margin: -40px auto 100px auto;
          background: #ffffff;
          border-radius: 24px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          position: relative;
          z-index: 10;
          overflow: hidden;
          min-height: 800px;
        }

        /* The Left Image Panel - Absolute Positioned */
        .llms-student-dashboard::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          width: 42%;
          background-image: url('/images/auth-bg.png');
          background-size: cover;
          background-position: center left;
          background-repeat: no-repeat;
          z-index: 0;
        }

        /* Form Wrappers take the right 58% */
        .llms-person-login-form-wrapper,
        .llms-new-person-form-wrapper {
          width: 58%;
          background: transparent;
          border-radius: 0;
          padding: 50px 60px 20px 60px;
          box-shadow: none;
          margin-bottom: 0;
          border: none;
          position: relative;
          z-index: 1;
        }
        
        .llms-new-person-form-wrapper {
          padding-top: 20px;
          padding-bottom: 60px;
        }

        /* Headings */
        .llms-form-heading {
          font-size: 30px !important;
          font-weight: 800 !important;
          color: #0f172a !important;
          margin-bottom: 35px !important;
          position: relative;
          padding-bottom: 12px;
          font-family: 'Inter', sans-serif;
          letter-spacing: -0.5px;
        }
        .llms-form-heading::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          height: 5px;
          width: 60px;
          background: linear-gradient(135deg, #f97316, #ea580c);
          border-radius: 3px;
        }

        /* Form Fields */
        .llms-form-field {
          margin-bottom: 22px;
        }
        .llms-form-field label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #334155;
          margin-bottom: 8px;
          font-family: 'Inter', sans-serif;
        }
        
        /* Inputs */
        .llms-field-input, .llms-field-select {
          width: 100%;
          padding: 14px 18px;
          border: 1.5px solid #cbd5e1;
          border-radius: 10px;
          font-size: 15px;
          color: #1e293b;
          background-color: #f8fafc;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .llms-field-input:focus, .llms-field-select:focus {
          border-color: #f97316;
          box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.15);
          background-color: #ffffff;
          outline: none;
        }
        
        /* Submit Buttons */
        .llms-field-button {
          background: linear-gradient(135deg, #f97316, #c2410c);
          color: #ffffff;
          border: none;
          padding: 14px 28px;
          font-size: 16px;
          font-weight: 700;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(234, 88, 12, 0.25);
          display: inline-block;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        /* Make Register button wider, but keep Login button normal */
        .llms-new-person-form-wrapper .llms-field-button {
           min-width: 200px;
           padding: 16px 36px;
        }
        .llms-person-login-form-wrapper .llms-field-button {
           width: 100%;
           padding: 12px 10px;
           font-size: 14px;
        }
        
        .llms-field-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 25px rgba(234, 88, 12, 0.35);
          background: linear-gradient(135deg, #ea580c, #9a3412);
        }
        
        /* Fix the Login Footer Row (Button, Checkbox, Lost Password) */
        .llms-person-login-form-wrapper .llms-form-field.type-submit {
           margin-top: 5px;
        }
        .llms-person-login-form-wrapper .llms-form-field.type-checkbox {
           margin-top: 15px;
           display: flex;
           align-items: center;
           gap: 8px;
        }
        .llms-person-login-form-wrapper .llms-form-field.type-checkbox label {
           margin-bottom: 0;
           font-size: 14px;
        }
        .llms-person-login-form-wrapper .llms-field-checkbox {
           width: 16px;
           height: 16px;
           margin: 0;
        }
        .llms-person-login-form-wrapper .llms-form-field.type-html {
           margin-top: 15px;
           text-align: right;
        }
        .llms-person-login-form-wrapper .llms-description a {
           color: #f97316;
           font-weight: 600;
           text-decoration: none;
           font-size: 14px;
        }
        .llms-person-login-form-wrapper .llms-description a:hover {
           text-decoration: underline;
        }
        
        /* Messages */
        .llms-required {
          color: #ef4444;
          margin-left: 4px;
        }
        .llms-description {
          font-size: 13px;
          color: #64748b;
          margin-top: 8px;
          display: block;
          line-height: 1.5;
        }
        
        /* Ensure WP-Block columns inside register don't break */
        .wp-block-columns {
           display: block !important;
        }
        .wp-block-column {
           flex-basis: 100% !important;
        }
        
        /* Mobile Responsiveness */
        @media (max-width: 1024px) {
          .llms-student-dashboard::before {
            position: relative;
            width: 100%;
            height: 300px;
            min-height: 300px;
          }
          .llms-person-login-form-wrapper,
          .llms-new-person-form-wrapper {
            width: 100%;
            padding: 40px 30px;
          }
        }
      `}</style>
      <ScriptRunner>
	 
                <div className="close-button body-close"></div>
        
    
       
            <div id="page" className="site  lesspadding">
            
<nav className="menu-wrap-off nav-container nav menu-ofcn">       
<div className="inner-offcan">
    <div className="nav-link-container">  
        <a href='#' className="nav-menu-link close-button" id="close-button2">              
            <i className="fal fa-times"></i>
        </a> 
    </div> 
    <div className="sidenav offcanvas-icon">
       

            <div id="mobile_menu" className="reactheme-offcanvas-inner-left">
                                                
                                <div className="widget widget_nav_menu mobile-menus">      
                                    <div className="menu-main-menu-container"><ul id="primary-menu-single1" className="menu"><li id="menu-item-5297" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-home menu-item-5297"><a href="/index">Home</a></li>
<li id="menu-item-26" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-26"><a href="/about-us">About Us</a></li>
<li id="menu-item-5359" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-5359"><a href="/courses">Course</a></li>
<li id="menu-item-27" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-27"><a href="/contact">Contact</a></li>
</ul></div>                                </div>                                
                                        </div> 
          
                    
            <div className="reactheme-innner-offcanvas-contents"> 

                                    <div className="offcanvas_logo">
                        <a href="/index" rel="home"><img style={{"height":"50px"}} src="/wp-content/uploads/2025/05/JCA-EDUTECH-Final-Logo-white.png" alt="JCA Edutech" /></a>
                    </div>
                <section id="text-1" className="widget widget_text">			<div className="textwidget"><p>JCA Edutech is a specialized trading and investment education platform that empowers aspiring traders with the skills, mindset, and strategies needed to thrive in financial markets.</p>
</div>
		</section><section id="contact_widget-1" className="widget widget_contact_widget">  <ul className="footer-contact-ul">
    <li><i className="fas fa-phone-alt"></i><a href="tel:0989787698659">0989 7876 9865 9</a></li><li><i className="far fa-envelope"></i><a href="mailto:info@jcaedutech.com">info@jcaedutech.com</a></li><li><i className="far fa-clock"></i>Office Hour: <span className="time">8AM - 11PM</span></li><li className="address1"><i className="far fa-map-marker-alt"></i><span>New Delhi</span></li>
  </ul>

    </section>     <section id="reactheme_soical_widget-1" className="widget widget_reactheme_soical_widget">
	
		<ul className="footer_social">  
		    		        <li> 
		        <a href="#" target="_blank"><span> <i className="fab fa-facebook-f"></i> </span></a> 
		        </li>
		    		    		        <li> 
		        <a href="# " target="_blank"><span> <i className="fab fa-twitter"></i> </span></a> 
		        </li>
		    		    
		    		    		        <li> 
		        <a href="# " target="_blank"><span> <i className="fab fa-linkedin-in"></i> </span></a> 
		        </li>
		    
		    		        <li> 
		        <a href="# " target="_blank"><span> <i className="fab fa-instagram"></i> </span></a> 
		        </li>
		    		    		    		         
		</ul></section>            </div>            
                </div>
    </div>
</nav> 


<div className="responsive-menus"><nav className="nav-container mobile-menu-container">
    <ul className="sidenav">
        <li className='nav-link-container'> 
            <a href='#' className="nav-menu-link">              
                <span className="dot1"></span>
                <span className="dot2"></span>
                <span className="dot3"></span>
                <span className="dot4"></span>
                <span className="dot5"></span>
                <span className="dot6"></span>
                <span className="dot7"></span>
                <span className="dot8"></span>
                <span className="dot9"></span>
            </a> 
        </li>
        <li>
          <div id="mobile-single-menu" className="menu"><ul>
<li className="page_item page-item-13"><a href="/about-us">About Us</a></li>
<li className="page_item page-item-5369"><a href="/courses">All Courses</a></li>
<li className="page_item page-item-5372"><a href="/lp-become-a-teacher">Become A Teacher</a></li>
<li className="page_item page-item-19"><a href="/contact">Contact</a></li>
<li className="page_item page-item-5410"><a href="/dashboard">Dashboard</a></li>
<li className="page_item page-item-3441"><a href="/faqs">FAQ&#8217;s</a></li>
<li className="page_item page-item-5162"><a href="/index">Home</a></li>
<li className="page_item page-item-5658"><a href="/instructors-list">Instructors List</a></li>
<li className="page_item page-item-987"><a href="/life-insurance">Life Insurance</a></li>
<li className="page_item page-item-6214 current_page_item"><a href="/login-register" aria-current="page">Login/Register</a></li>
<li className="page_item page-item-5408"><a href="/memberships">Membership Catalog</a></li>
<li className="page_item page-item-5340"><a href="/my-account">My account</a></li>
<li className="page_item page-item-5409"><a href="/purchase">Purchase</a></li>
<li className="page_item page-item-5337"><a href="/shop">Shop</a></li>
<li className="page_item page-item-4007"><a href="/team-grid-style/">Team Grid Style</a></li>
<li className="page_item page-item-5373"><a href="/lp-term-conditions">Term Conditions</a></li>
<li className="page_item page-item-6762"><a href="/test">Test</a></li>
<li className="page_item page-item-3975"><a href="/testimonials-style">Testimonials Style</a></li>
</ul></div>
        </li>
    </ul>
</nav></div>


<header id="reactheme-header" className="header-style-1 mainsmenu      mobile-hide-cart   menugap-minus">
    
    <div className="header-inner menu-sticky">
          
        
        
         

          <div className="toolbar-area mobile-hide-topbars">
            <div className="container2 container">
              <div className="row">
                <div className="col-xl-6 col-lg-6 col-head contact">
                  <div className="toolbar-contact">
                    <ul className="reactheme-contact-info">  
                                              <li className="reactheme-contact-email">
                            <i className="fal fa-envelope"></i>                  
                            <a href="mailto:info@jcaedutech.com">info@jcaedutech.com</a>                   
                        </li>
                                              
                         
                        
                        
                  </ul>
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-head lang">
                  
                                  </div>
              </div>
            </div>
          </div>
                      
        <div className="menu-area menu_type_" >
            <div className="container">
                <div className="row pt-25">
                    <div className="col-xl-4 col-lg-3 d-none d-lg-inline-block">                        
                                <div className="logo-area">
                          <a href="/index" rel="home"><img style={{"maxHeight":"80px"}} src="/wp-content/uploads/2025/05/JCA-EDUTECH-Final-Logo-white.png" alt="JCA Edutech" /></a>
                    </div>
                    <div className="logo-area sticky-logo">
              <a href="/index" rel="home"><img style={{"maxHeight":"40px"}} src="/wp-content/uploads/2025/05/JCA-EDUTECH-Final-Logo-01-copy-2.webp" alt="JCA Edutech" /></a>
               </div>
        

                       
                    </div>
                    <div className="col-xl-8 col-lg-9">
                        <ul className="right-query mb-0">
                                                                                    <li>
                                                                    <a className="theme_btn quote-btn" href="/login-register" >Login/Register</a>
                                                             
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="menu_one">
                        <div className="row-table"> 
                        <div className="col-cell header-logo">
                                                          <a href="/index" rel="home"><img style={{"maxHeight":"45px"}} src="/wp-content/uploads/2025/05/JCA-EDUTECH-Final-Logo-01-copy-2.webp" alt="JCA Edutech" /></a>
                                                    </div>  
                                
                        <div className="col-cell menu-responsive">  
                                <nav className="nav navbar">
        <div className="navbar-menu">
            <div className="menu-main-menu-container"><ul id="primary-menu-main" className="menu"><li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-home menu-item-5297"><a href="/index">Home</a></li>
<li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-26"><a href="/about-us">About Us</a></li>
<li className="menu-item menu-item-type-custom menu-item-object-custom menu-item-5359"><a href="/courses">Course</a></li>
<li className="menu-item menu-item-type-post_type menu-item-object-page menu-item-27"><a href="/contact">Contact</a></li>
</ul></div>        </div>
    </nav>
                            </div>            

                        <div className="col-cell header-quote">                         
                            
                            
                                                          <div className="sidebarmenu-area text-right desktop">
                                                                    <ul className="offcanvas-icon">
                                        <li className="nav-link-container"> 
                                            <a href='#' className="nav-menu-link menu-button">
                                                <span className="dot1"></span>
                                                <span className="dot2"></span>
                                                <span className="dot3"></span>
                                                <span className="dot4"></span>                                          
                                            </a> 
                                        </li>
                                    </ul>
                                     
                              </div>
                            
                            
                            <div className="sidebarmenu-area text-right mobilehum">                                    
                                <ul className="offcanvas-icon">
                                    <li className="nav-link-container"> 
                                        <a href='#' className="nav-menu-link menu-button">
                                            <span className="dot1"></span>
                                            <span className="dot2"></span>
                                            <span className="dot3"></span>
                                            <span className="dot4"></span>                                          
                                        </a> 
                                    </li>
                                </ul>                                       
                            </div> 
                            

                        </div> 
                    </div>
                </div>
            </div>    
        </div>
    </div>
  


<div className="reactheme-breadcrumbs porfolio-details">
    <div className="breadcrumbs-single" style={{"backgroundImage":"url('/wp-content/uploads/2025/05/About-us-background-copy-2.webp')"}}>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="breadcrumbs-inner bread-">
                                          <div className="breadcrumbs-title"> <span property="itemListElement" ><a property="item"  title="Go to JCA Edutech." href="/index" className="home" ><span property="name">JCA Edutech</span></a><meta property="position" content="1" /></span> &gt; <span property="itemListElement" ><span property="name" className="post post-page current-item">Login/Register</span><meta property="url" content="login-register.htm" /><meta property="position" content="2" /></span></div>
                                                          <h1 className="page-title">
                  Login/Register                </h1>             
                        
            </div>
          </div>
        </div>
      </div>
    </div>
</div>
  
</header>
 
        
                        <div className="main-contain offcontents">                
                    
        <div className="container">
            <div id="content">
			<div className="row padding-">
		    <div className="col-lg-12 ">
			    <article id="post-6214" className="post-6214 page type-page status-publish hentry">
  <div className="entry-content">
    
<div className="lifterlms"><div className="llms-student-dashboard dashboard llms-sd-layout-columns" data-current="dashboard">


<div className="llms-person-login-form-wrapper">

	<form action="" className="llms-login" method="POST">

		<h2 className="llms-form-heading">Login</h2>

		<div className="llms-form-fields">

			
							<div className="llms-form-field type-email llms-cols-6 llms-is-required"><label htmlFor="llms_login">Email Address<span className="llms-required">*</span></label><input className="llms-field-input" id="llms_login" name="llms_login" required="required" type="email" /></div>							<div className="llms-form-field type-password llms-cols-6 llms-cols-last llms-is-required"><label htmlFor="llms_password">Password<span className="llms-required">*</span></label><input className="llms-field-input" id="llms_password" name="llms_password" required="required" type="password" /><div className="llms-visibility-toggle"><button type="button" className="llms-button-plain hide-if-no-js" data-toggle="1"><i className="fa fa-eye"></i> <span className="llms-visibility-toggle-state">Show Password</span></button></div></div><div className="clear"></div>							<div className="llms-form-field type-submit llms-cols-3"><button className="llms-field-button llms-button-action" id="llms_login_button" name="llms_login_button" type="submit" value="Login">Login</button></div>							<div className="llms-form-field type-checkbox llms-cols-6"><input className="llms-field-checkbox" id="llms_remember" name="llms_remember" type="checkbox" /><label htmlFor="llms_remember">Remember me</label></div>							<div className="llms-form-field type-html llms-cols-3 llms-cols-last align-right"><div className="llms-field-html" id="llms_lost_password"></div><span className="llms-description"><a href="my-account.htmlost-password/">Lost your password?</a></span></div><div className="clear"></div>			
			<input type="hidden" id="_llms_login_user_nonce" name="_llms_login_user_nonce" value="0a1347787d" /><input type="hidden" name="_wp_http_referer" value="/login-register/" />			<input type="hidden" name="redirect" value="login-register.htm" />
			<input type="hidden" name="action" value="llms_login_user" />

			
		</div>

	</form>

</div>




<div className="llms-new-person-form-wrapper">

			<h2 className="llms-form-heading">Register</h2>
	
	<form onSubmit={handleRegister} className="llms-new-person-form register" noValidate>

		

		<div className="llms-form-fields">

			
			<div className="llms-form-field type-email llms-cols-6 llms-is-required"><label htmlFor="email_address">Email Address<span className="llms-required">*</span></label><input className="llms-field-input" data-match="email_address_confirm" id="email_address" name="email_address" type="email"  value={formData.email_address} onChange={handleChange} />{formErrors.email_address && <div style={{color: "#991b1b", fontSize: "14px", marginTop: "5px"}}>{formErrors.email_address}</div>}</div>
<div className="llms-form-field type-email llms-cols-6 llms-cols-last llms-is-required"><label htmlFor="email_address_confirm">Confirm Email Address<span className="llms-required">*</span></label><input className="llms-field-input" data-match="email_address" id="email_address_confirm" name="email_address_confirm" required="required" type="email"  value={formData.email_address_confirm} onChange={handleChange} /></div><div className="clear"></div>


<div className="wp-block-columns is-layout-flex wp-container-core-columns-is-layout-9d6595d7 wp-block-columns-is-layout-flex">
<div className="wp-block-column is-layout-flow wp-block-column-is-layout-flow" style={{"flexBasis":"100%"}}><div className="llms-form-field type-password llms-cols-6 llms-is-required"><label htmlFor="password">Password<span className="llms-required">*</span></label><input className="llms-field-input" data-match="password_confirm" id="password" name="password" type="password"  value={formData.password} onChange={handleChange} />{formErrors.password && <div style={{color: "#991b1b", fontSize: "14px", marginTop: "5px"}}>{formErrors.password}</div>}</div>
<div className="llms-form-field type-password llms-cols-6 llms-cols-last llms-is-required"><label htmlFor="password_confirm">Confirm Password<span className="llms-required">*</span></label><input className="llms-field-input" data-match="password" id="password_confirm" name="password_confirm" type="password"  value={formData.password_confirm} onChange={handleChange} />{formErrors.password_confirm && <div style={{color: "#991b1b", fontSize: "14px", marginTop: "5px"}}>{formErrors.password_confirm}</div>}</div><div className="clear"></div></div>
</div>
<div className="llms-form-field type-html llms-cols-12 llms-cols-last"><div aria-live="polite" className="llms-field-html llms-password-strength-meter" id="llms-password-strength-meter"></div><span className="llms-description">A strong password is required with at least 8 characters. To make it stronger, use both upper and lower case letters, numbers, and symbols.</span></div><div className="clear"></div>

<div className="llms-form-field type-text llms-cols-6 llms-is-required"><label htmlFor="first_name">First Name<span className="llms-required">*</span></label><input className="llms-field-input" id="first_name" name="first_name" type="text"  value={formData.first_name} onChange={handleChange} />{formErrors.first_name && <div style={{color: "#991b1b", fontSize: "14px", marginTop: "5px"}}>{formErrors.first_name}</div>}</div>
<div className="llms-form-field type-text llms-cols-6 llms-cols-last llms-is-required"><label htmlFor="last_name">Last Name<span className="llms-required">*</span></label><input className="llms-field-input" id="last_name" name="last_name" type="text"  value={formData.last_name} onChange={handleChange} />{formErrors.last_name && <div style={{color: "#991b1b", fontSize: "14px", marginTop: "5px"}}>{formErrors.last_name}</div>}</div><div className="clear"></div>

<div className="llms-form-field type-tel llms-cols-12 llms-cols-last"><label htmlFor="llms_phone">Phone Number</label><input className="llms-field-input" id="llms_phone" name="llms_phone" type="tel"  value={formData.llms_phone} onChange={handleChange} /></div><div className="clear"></div>

<div className="llms-form-field type-text llms-cols-8 llms-is-required"><label htmlFor="llms_billing_address_1">Address<span className="llms-required">*</span></label><input className="llms-field-input" id="llms_billing_address_1" name="llms_billing_address_1" type="text"  value={formData.llms_billing_address_1} onChange={handleChange} />{formErrors.llms_billing_address_1 && <div style={{color: "#991b1b", fontSize: "14px", marginTop: "5px"}}>{formErrors.llms_billing_address_1}</div>}</div>
<div className="llms-form-field type-text llms-cols-4 llms-cols-last"><label htmlFor="llms_billing_address_2"></label><input className="llms-field-input" id="llms_billing_address_2" name="llms_billing_address_2" placeholder="Apartment, suite, etc..." type="text"  value={formData.llms_billing_address_2} onChange={handleChange} /></div><div className="clear"></div>
<div className="llms-form-field type-text llms-cols-12 llms-cols-last llms-is-required"><label htmlFor="llms_billing_city">City<span className="llms-required">*</span></label><input className="llms-field-input" id="llms_billing_city" name="llms_billing_city" type="text"  value={formData.llms_billing_city} onChange={handleChange} />{formErrors.llms_billing_city && <div style={{color: "#991b1b", fontSize: "14px", marginTop: "5px"}}>{formErrors.llms_billing_city}</div>}</div><div className="clear"></div>
<div className="llms-form-field type-select llms-cols-12 llms-cols-last llms-is-required llms-l10n-country-select"><label htmlFor="llms_billing_country">Country<span className="llms-required">*</span></label><select className="llms-field-select llms-select2" id="llms_billing_country" name="llms_billing_country" value={formData.llms_billing_country} onChange={handleChange}><option value="IN">India</option></select></div><div className="clear"></div>
<div className="llms-form-field type-select llms-cols-6 llms-is-required llms-l10n-state-select"><label htmlFor="llms_billing_state">State / Region<span className="llms-required">*</span></label><select className="llms-field-select llms-select2" id="llms_billing_state" name="llms_billing_state" value={formData.llms_billing_state} onChange={handleChange}><option value="">Select a State</option><option value="AP">Andhra Pradesh</option><option value="AR">Arunachal Pradesh</option><option value="AS">Assam</option><option value="BR">Bihar</option><option value="CG">Chhattisgarh</option><option value="GA">Goa</option><option value="GJ">Gujarat</option><option value="HR">Haryana</option><option value="HP">Himachal Pradesh</option><option value="JH">Jharkhand</option><option value="KA">Karnataka</option><option value="KL">Kerala</option><option value="MP">Madhya Pradesh</option><option value="MH">Maharashtra</option><option value="MN">Manipur</option><option value="ML">Meghalaya</option><option value="MZ">Mizoram</option><option value="NL">Nagaland</option><option value="OD">Odisha</option><option value="PB">Punjab</option><option value="RJ">Rajasthan</option><option value="SK">Sikkim</option><option value="TN">Tamil Nadu</option><option value="TS">Telangana</option><option value="TR">Tripura</option><option value="UP">Uttar Pradesh</option><option value="UK">Uttarakhand</option><option value="WB">West Bengal</option><option value="AN">Andaman and Nicobar Islands</option><option value="CH">Chandigarh</option><option value="DN">Dadra and Nagar Haveli and Daman and Diu</option><option value="DL">Delhi</option><option value="LD">Lakshadweep</option><option value="PY">Puducherry</option><option value="LA">Ladakh</option><option value="JK">Jammu and Kashmir</option></select>
    {formErrors.llms_billing_state && <div style={{color: "#991b1b", fontSize: "14px", marginTop: "5px"}}>{formErrors.llms_billing_state}</div>}
    </div><div className="clear"></div>
<div className="llms-form-field type-text llms-cols-6 llms-cols-last llms-is-required"><label htmlFor="llms_billing_zip">Postal / Zip Code<span className="llms-required">*</span></label><input className="llms-field-input" id="llms_billing_zip" name="llms_billing_zip" type="text"  value={formData.llms_billing_zip} onChange={handleChange} />{formErrors.llms_billing_zip && <div style={{color: "#991b1b", fontSize: "14px", marginTop: "5px"}}>{formErrors.llms_billing_zip}</div>}</div><div className="clear"></div>


<p></p>

			<div className="llms-form-field type-html llms-cols-12 llms-cols-last"><div className="llms-field-html" id="llms-privacy-policy"><p>Your personal data will be used to process your enrollment, support your experience on this website, and for other purposes described in our <a href="/?page_id=3" target="_blank">Privacy Policy</a>.</p></div></div><div className="clear"></div>
			
		</div>

		<footer className="llms-form-fields">

			
			<div className="llms-form-field type-submit llms-cols-3 llms-cols-last"><button className="llms-field-button llms-button-action" id="llms_register_person" name="llms_register_person" type="submit" value="Register">Register</button></div><div className="clear"></div>
						<input type="hidden" id="_llms_register_person_nonce" name="_llms_register_person_nonce" value="0c14e652b1" /><input type="hidden" name="_wp_http_referer" value="/login-register/" />			<input name="action" type="hidden" value="llms_register_person" />

		</footer>

		
	</form>

</div>

</div></div>
 
  </div>
  
  
  </article>
 
		    </div>
					</div>
        </div>
    </div>
</div>
        <footer id="reactheme-footer" className=" reactheme-footer footer-style-1  " >

    <div className="footer-top">

        <div className="container">
            <div className="row"> 
                                                <div className="col-lg-4 col-md-6 footer-0">

                                                <section id="text-2" className="widget widget_text"><h3 className="footer-title">About Company</h3>			<div className="textwidget"><p><span style={{"fontWeight":"400"}}>JCA Edutech is a specialized trading and investment education platform that empowers aspiring traders with the skills, mindset, and strategies needed to thrive in financial markets. With structured learning paths, expert mentorship, and real-world insights, we bridge the gap between theory and practical trading success.</span></p>
</div>
		</section><section id="reactheme_soical_widget-2" className="widget widget_reactheme_soical_widget">
	
		<ul className="footer_social">  
		    		        <li> 
		        <a href="https://www.facebook.com/profile.php?id=61575831581011" target="_blank"><span> <i className="fab fa-facebook-f"></i> </span></a> 
		        </li>
		    		    		    
		    		        <li> 
		        <a href="https://in.pinterest.com/jcaedutech/ " target="_blank"><span> <i className="fab fa-pinterest-p"></i> </span></a> 
		        </li>
		    		    
		    		        <li> 
		        <a href="https://www.instagram.com/jcaedutech/ " target="_blank"><span> <i className="fab fa-instagram"></i> </span></a> 
		        </li>
		    		    		    		    		        <li> 
		        <a href="https://www.youtube.com/@JCAEdutech " target="_blank"><span> <i className="fab fa-youtube"></i> </span></a> 
		        </li>
		         
		</ul></section>                    </div>
                                                                <div className="col-lg-4 col-md-6 footer-1">

                                                <section id="nav_menu-1" className="widget widget_nav_menu"><h3 className="footer-title">Quick Links</h3><div className="menu-footer-menu-container"><ul id="menu-footer-menu" className="menu"><li id="menu-item-6461" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-home menu-item-6461"><a href="/index">Home</a></li>
<li id="menu-item-6462" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-6462"><a href="/about-us">About Us</a></li>
<li id="menu-item-6881" className="menu-item menu-item-type-custom menu-item-object-custom menu-item-6881"><a href="/courses">Courses</a></li>
<li id="menu-item-6463" className="menu-item menu-item-type-post_type menu-item-object-page menu-item-6463"><a href="/contact">Contact</a></li>
</ul></div></section>                    </div>
                                                                <div className="col-lg-4 col-md-6 footer-2">

                                                <section id="contact_widget-2" className="widget widget_contact_widget"><h3 className="footer-title">Get In Touch</h3>  <ul className="footer-contact-ul">
    <li><i className="far fa-envelope"></i><a href="mailto:info@jcaedutech.com">info@jcaedutech.com</a></li><li className="address1"><i className="far fa-map-marker-alt"></i><span>New Delhi </span></li>
  </ul>

    </section>                         </div>
                                                                    </div>
        </div>
    </div>
                <div className="footer-bottom" >
            <div className="container">
                <div className="copyright_border">
                    
                    <div className="copyright text-center"  style={{"padding":"0px"}}  >
                                                <p>Copyright &amp; 2025 JCA Edutech <a href="https://sprintdigitech.com/"> Designed By Sprint Digitech.</a>
</p>
                                            </div>
                      
                </div>
            </div>
        </div>



</footer>
</div>
 
<div id="top-to-bottom">
    <i className="fa fa-angle-double-up"></i>
</div>   
		<style dangerouslySetInnerHTML={{__html: "\n\t\t\t:root {\n\t\t\t\t-webkit-user-select: none;\n\t\t\t\t-webkit-touch-callout: none;\n\t\t\t\t-ms-user-select: none;\n\t\t\t\t-moz-user-select: none;\n\t\t\t\tuser-select: none;\n\t\t\t}\n\t\t" }} />
		<script type="text/javascript" dangerouslySetInnerHTML={{__html: "\n\t\t\t/*<![CDATA[*/\n\t\t\tdocument.oncontextmenu = function(event) {\n\t\t\t\tif (event.target.tagName != 'INPUT' && event.target.tagName != 'TEXTAREA') {\n\t\t\t\t\tevent.preventDefault();\n\t\t\t\t}\n\t\t\t};\n\t\t\tdocument.ondragstart = function() {\n\t\t\t\tif (event.target.tagName != 'INPUT' && event.target.tagName != 'TEXTAREA') {\n\t\t\t\t\tevent.preventDefault();\n\t\t\t\t}\n\t\t\t};\n\t\t\t/*]]>*/\n\t\t" }} />
					<script dangerouslySetInnerHTML={{__html: "\n\t\t\t\tconst lazyloadRunObserver = () => {\n\t\t\t\t\tconst lazyloadBackgrounds = document.querySelectorAll( `.e-con.e-parent:not(.e-lazyloaded)` );\n\t\t\t\t\tconst lazyloadBackgroundObserver = new IntersectionObserver( ( entries ) => {\n\t\t\t\t\t\tentries.forEach( ( entry ) => {\n\t\t\t\t\t\t\tif ( entry.isIntersecting ) {\n\t\t\t\t\t\t\t\tlet lazyloadBackground = entry.target;\n\t\t\t\t\t\t\t\tif( lazyloadBackground ) {\n\t\t\t\t\t\t\t\t\tlazyloadBackground.classList.add( 'e-lazyloaded' );\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\tlazyloadBackgroundObserver.unobserve( entry.target );\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t});\n\t\t\t\t\t}, { rootMargin: '200px 0px 200px 0px' } );\n\t\t\t\t\tlazyloadBackgrounds.forEach( ( lazyloadBackground ) => {\n\t\t\t\t\t\tlazyloadBackgroundObserver.observe( lazyloadBackground );\n\t\t\t\t\t} );\n\t\t\t\t};\n\t\t\t\tconst events = [\n\t\t\t\t\t'DOMContentLoaded',\n\t\t\t\t\t'elementor/lazyload/observe',\n\t\t\t\t];\n\t\t\t\tevents.forEach( ( event ) => {\n\t\t\t\t\tdocument.addEventListener( event, lazyloadRunObserver );\n\t\t\t\t} );\n\t\t\t" }} />
				<script type='text/javascript' dangerouslySetInnerHTML={{__html: "\n\t\t(function () {\n\t\t\tvar c = document.body.className;\n\t\t\tc = c.replace(/woocommerce-no-js/, 'woocommerce-js');\n\t\t\tdocument.body.className = c;\n\t\t})();\n\t" }} />
	<script id="llms-inline-footer-scripts" type="text/javascript" dangerouslySetInnerHTML={{__html: "window.llms = window.llms || {};window.llms.ajaxurl = \"/wp-admin/admin-ajax.php\";window.llms.ajax_nonce = \"6a086c844e\";window.llms.tracking = '{\"nonce\":\"6af5f84c12\",\"events\":[],\"saving_frequency\":\"minimum\"}';window.LLMS = window.LLMS || {};window.LLMS.l10n = window.LLMS.l10n || {}; window.LLMS.l10n.strings = {\"This is a %2$s %1$s String\":\"This is a %2$s %1$s String\",\"You do not have permission to access this content\":\"You do not have permission to access this content\",\"There is an issue with your chosen password.\":\"There is an issue with your chosen password.\",\"Too Short\":\"Too Short\",\"Very Weak\":\"Very Weak\",\"Weak\":\"Weak\",\"Medium\":\"Medium\",\"Strong\":\"Strong\",\"Mismatch\":\"Mismatch\",\"Members Only Pricing\":\"Members Only Pricing\",\"Are you sure you want to cancel your subscription?\":\"Are you sure you want to cancel your subscription?\",\"New Lesson\":\"New Lesson\",\"lessons\":\"lessons\",\"lesson\":\"lesson\",\"Section %1$d: %2$s\":\"Section %1$d: %2$s\",\"Lesson %1$d: %2$s\":\"Lesson %1$d: %2$s\",\"%1$s Quiz\":\"%1$s Quiz\",\"questions\":\"questions\",\"question\":\"question\",\"New Quiz\":\"New Quiz\",\"quizzes\":\"quizzes\",\"quiz\":\"quiz\",\"New Section\":\"New Section\",\"sections\":\"sections\",\"section\":\"section\",\"General Settings\":\"General Settings\",\"Video Embed URL\":\"Video Embed URL\",\"Audio Embed URL\":\"Audio Embed URL\",\"Free Lesson\":\"Free Lesson\",\"Free lessons can be accessed without enrollment.\":\"Free lessons can be accessed without enrollment.\",\"Require Passing Grade on Quiz\":\"Require Passing Grade on Quiz\",\"When enabled, students must pass this quiz before the lesson can be completed.\":\"When enabled, students must pass this quiz before the lesson can be completed.\",\"Require Passing Grade on Assignment\":\"Require Passing Grade on Assignment\",\"When enabled, students must pass this assignment before the lesson can be completed.\":\"When enabled, students must pass this assignment before the lesson can be completed.\",\"Lesson Weight\":\"Lesson Weight\",\"POINTS\":\"POINTS\",\"Determines the weight of the lesson when calculating the overall grade of the course.\":\"Determines the weight of the lesson when calculating the overall grade of the course.\",\"Prerequisite\":\"Prerequisite\",\"Course Drip Method\":\"Course Drip Method\",\"Drip settings are currently set at the course level, under the Restrictions settings tab. Disable to allow lesson level drip settings.\":\"Drip settings are currently set at the course level, under the Restrictions settings tab. Disable to allow lesson level drip settings.\",\"Edit Course\":\"Edit Course\",\"Drip settings can be set at the course level to release course content at a specified interval, in the Restrictions settings tab.\":\"Drip settings can be set at the course level to release course content at a specified interval, in the Restrictions settings tab.\",\"Drip Method\":\"Drip Method\",\"None\":\"None\",\"On a specific date\":\"On a specific date\",\"# of days after course enrollment\":\"# of days after course enrollment\",\"# of days after course start date\":\"# of days after course start date\",\"# of days after prerequisite lesson completion\":\"# of days after prerequisite lesson completion\",\"# of days\":\"# of days\",\"Date\":\"Date\",\"Time\":\"Time\",\"Description\":\"Description\",\"Passing Percentage\":\"Passing Percentage\",\"Minimum percentage of total points required to pass the quiz\":\"Minimum percentage of total points required to pass the quiz\",\"Limit Attempts\":\"Limit Attempts\",\"Limit the maximum number of times a student can take this quiz\":\"Limit the maximum number of times a student can take this quiz\",\"Time Limit\":\"Time Limit\",\"Enforce a maximum number of minutes a student can spend on each attempt\":\"Enforce a maximum number of minutes a student can spend on each attempt\",\"Can be resumed\":\"Can be resumed\",\"Allow a new attempt on this quiz to be resumed\":\"Allow a new attempt on this quiz to be resumed\",\"Show Correct Answers\":\"Show Correct Answers\",\"When enabled, students will be shown the correct answer to any question they answered incorrectly.\":\"When enabled, students will be shown the correct answer to any question they answered incorrectly.\",\"Randomize Question Order\":\"Randomize Question Order\",\"Display questions in a random order for each attempt. Content questions are locked into their defined positions.\":\"Display questions in a random order for each attempt. Content questions are locked into their defined positions.\",\"Disable Retake\":\"Disable Retake\",\"Prevent quiz retake after student passed the quiz.\":\"Prevent quiz retake after student passed the quiz.\",\"Question Bank\":\"Question Bank\",\"A question bank helps prevent cheating and reinforces learning by allowing instructors to create assessments with randomized questions pulled from a bank of questions. (Available in Advanced Quizzes addon)\":\"A question bank helps prevent cheating and reinforces learning by allowing instructors to create assessments with randomized questions pulled from a bank of questions. (Available in Advanced Quizzes addon)\",\"Get LifterLMS Advanced Quizzes\":\"Get LifterLMS Advanced Quizzes\",\"Are you sure you want to detach this %s?\":\"Are you sure you want to detach this %s?\",\"Select an image\":\"Select an image\",\"Use this image\":\"Use this image\",\"Are you sure you want to move this %s to the trash?\":\"Are you sure you want to move this %s to the trash?\",\"%1$s Assignment\":\"%1$s Assignment\",\"Add Existing Assignment\":\"Add Existing Assignment\",\"Search for existing assignments...\":\"Search for existing assignments...\",\"Get Your Students Taking Action\":\"Get Your Students Taking Action\",\"Get Assignments Now!\":\"Get Assignments Now!\",\"Unlock LifterLMS Assignments\":\"Unlock LifterLMS Assignments\",\"Close\":\"Close\",\"Add Existing Lesson\":\"Add Existing Lesson\",\"Search for existing lessons...\":\"Search for existing lessons...\",\"Searching...\":\"Searching...\",\"Attach\":\"Attach\",\"Clone\":\"Clone\",\"ID\":\"ID\",\"Are you sure you want to delete this question?\":\"Are you sure you want to delete this question?\",\"Add Existing Question\":\"Add Existing Question\",\"Search for existing questions...\":\"Search for existing questions...\",\"An error occurred while trying to load the questions. Please refresh the page and try again.\":\"An error occurred while trying to load the questions. Please refresh the page and try again.\",\"Add Existing Quiz\":\"Add Existing Quiz\",\"Search for existing quizzes...\":\"Search for existing quizzes...\",\"Add a Question\":\"Add a Question\",\"Use SoundCloud or Spotify audio URLS.\":\"Use SoundCloud or Spotify audio URLS.\",\"Permalink\":\"Permalink\",\"Use YouTube, Vimeo, or Wistia video URLS.\":\"Use YouTube, Vimeo, or Wistia video URLS.\",\"Select an Image\":\"Select an Image\",\"Select Image\":\"Select Image\",\"An error was encountered generating the export\":\"An error was encountered generating the export\",\"Select a Course\\/Membership\":\"Select a Course\\/Membership\",\"Select a student\":\"Select a student\",\"Error: %s\":\"Error: %s\",\"Filter by Student(s)\":\"Filter by Student(s)\",\"Error\":\"Error\",\"Request timed out\":\"Request timed out\",\"Retry\":\"Retry\",\"Unknown response\":\"Unknown response\",\"Launch Course Builder\":\"Launch Course Builder\",\"There was an error loading the necessary resources. Please try again.\":\"There was an error loading the necessary resources. Please try again.\",\"Restrictions\":\"Restrictions\",\"Free\":\"Free\",\"Monthly\":\"Monthly\",\"Annual\":\"Annual\",\"One Time\":\"One Time\",\"Lifetime\":\"Lifetime\",\"Paid Trial\":\"Paid Trial\",\"Free Trial\":\"Free Trial\",\"Hidden Access\":\"Hidden Access\",\"Sale\":\"Sale\",\"Pre-sale\":\"Pre-sale\",\"After deleting this access plan, any students subscribed to this plan will still have access and will continue to make recurring payments according to the access plan's settings. If you wish to terminate their plans you must do so manually. This action cannot be reversed.\":\"After deleting this access plan, any students subscribed to this plan will still have access and will continue to make recurring payments according to the access plan&#039;s settings. If you wish to terminate their plans you must do so manually. This action cannot be reversed.\",\"An error was encountered during the save attempt. Please try again.\":\"An error was encountered during the save attempt. Please try again.\",\"Please select a student to enroll\":\"Please select a student to enroll\",\"Are you sure you want to delete this row? This cannot be undone.\":\"Are you sure you want to delete this row? This cannot be undone.\",\"Click okay to enroll all active members into the selected course. Enrollment will take place in the background and you may leave your site after confirmation. This action cannot be undone!\":\"Click okay to enroll all active members into the selected course. Enrollment will take place in the background and you may leave your site after confirmation. This action cannot be undone!\",\"\\\"%s\\\" is already in the course list.\":\"&quot;%s&quot; is already in the course list.\",\"Remove course\":\"Remove course\",\"Enroll All Members\":\"Enroll All Members\",\"Cancel\":\"Cancel\",\"Refund\":\"Refund\",\"Record a Manual Payment\":\"Record a Manual Payment\",\"Copy this code and paste it into the desired area\":\"Copy this code and paste it into the desired area\",\"Edit\":\"Edit\",\"View\":\"View\",\"Remarks to Student\":\"Remarks to Student\",\"points\":\"points\",\"Are you sure you wish to quit this quiz attempt?\":\"Are you sure you wish to quit this quiz attempt?\",\"Grading Quiz...\":\"Grading Quiz...\",\"Loading Question...\":\"Loading Question...\",\"An unknown error occurred. Please try again.\":\"An unknown error occurred. Please try again.\",\"Loading Quiz...\":\"Loading Quiz...\",\"Save & Exit Quiz\":\"Save &amp; Exit Quiz\",\"Time Remaining\":\"Time Remaining\",\"Next Question\":\"Next Question\",\"Complete Quiz\":\"Complete Quiz\",\"Previous Question\":\"Previous Question\",\"Loading...\":\"Loading...\",\"%1$s hours, %2$s minutes remaining\":\"%1$s hours, %2$s minutes remaining\",\"1 hour, %2$s minutes remaining\":\"1 hour, %2$s minutes remaining\",\"%1$s minutes remaining\":\"%1$s minutes remaining\",\"%1$s minute remaining\":\"%1$s minute remaining\",\"%1$s seconds remaining\":\"%1$s seconds remaining\",\"You must select an answer to continue.\":\"You must select an answer to continue.\"};window.LLMS.PasswordStrength = window.LLMS.PasswordStrength || {};window.LLMS.PasswordStrength.get_settings = function() { return JSON.parse( '{\"blocklist\":[],\"min_strength\":\"medium\",\"min_length\":6}' ); };" }} /><link rel='stylesheet' id='wc-blocks-style-css' href='/wp-content/plugins/woocommerce/assets/client/blocks/wc-blocks.css?ver=wc-10.5.3' type='text/css' media='all' />
<style id='core-block-supports-inline-css' type='text/css' dangerouslySetInnerHTML={{__html: "\n.wp-container-core-columns-is-layout-9d6595d7{flex-wrap:nowrap;}\n/*# sourceURL=core-block-supports-inline-css */\n" }} />
<script type="text/javascript" id="wp-i18n-js-after" dangerouslySetInnerHTML={{__html: "\n/* <![CDATA[ */\nwp.i18n.setLocaleData( { 'text direction\\u0004ltr': [ 'ltr' ] } );\n//# sourceURL=wp-i18n-js-after\n/* ]]> */\n" }} />
<script type="text/javascript" id="jquery-ui-datepicker-js-after" dangerouslySetInnerHTML={{__html: "\n/* <![CDATA[ */\njQuery(function(jQuery){jQuery.datepicker.setDefaults({\"closeText\":\"Close\",\"currentText\":\"Today\",\"monthNames\":[\"January\",\"February\",\"March\",\"April\",\"May\",\"June\",\"July\",\"August\",\"September\",\"October\",\"November\",\"December\"],\"monthNamesShort\":[\"Jan\",\"Feb\",\"Mar\",\"Apr\",\"May\",\"Jun\",\"Jul\",\"Aug\",\"Sep\",\"Oct\",\"Nov\",\"Dec\"],\"nextText\":\"Next\",\"prevText\":\"Previous\",\"dayNames\":[\"Sunday\",\"Monday\",\"Tuesday\",\"Wednesday\",\"Thursday\",\"Friday\",\"Saturday\"],\"dayNamesShort\":[\"Sun\",\"Mon\",\"Tue\",\"Wed\",\"Thu\",\"Fri\",\"Sat\"],\"dayNamesMin\":[\"S\",\"M\",\"T\",\"W\",\"T\",\"F\",\"S\"],\"dateFormat\":\"MM d, yy\",\"firstDay\":1,\"isRTL\":false});});\n//# sourceURL=jquery-ui-datepicker-js-after\n/* ]]> */\n" }} />
<script type="text/javascript" id="wc-order-attribution-js-extra" dangerouslySetInnerHTML={{__html: "\n/* <![CDATA[ */\nvar wc_order_attribution = {\"params\":{\"lifetime\":1.0e-5,\"session\":30,\"base64\":false,\"ajaxurl\":\"/wp-admin/admin-ajax.php\",\"prefix\":\"wc_order_attribution_\",\"allowTracking\":true},\"fields\":{\"source_type\":\"current.typ\",\"referrer\":\"current_add.rf\",\"utm_campaign\":\"current.cmp\",\"utm_source\":\"current.src\",\"utm_medium\":\"current.mdm\",\"utm_content\":\"current.cnt\",\"utm_id\":\"current.id\",\"utm_term\":\"current.trm\",\"utm_source_platform\":\"current.plt\",\"utm_creative_format\":\"current.fmt\",\"utm_marketing_tactic\":\"current.tct\",\"session_entry\":\"current_add.ep\",\"session_start_time\":\"current_add.fd\",\"session_pages\":\"session.pgs\",\"session_count\":\"udata.vst\",\"user_agent\":\"udata.uag\"}};\n//# sourceURL=wc-order-attribution-js-extra\n/* ]]> */\n" }} />
<script type="text/javascript" id="upk-site-js-extra" dangerouslySetInnerHTML={{__html: "\n/* <![CDATA[ */\nvar UltimatePostKitConfig = {\"ajaxurl\":\"/wp-admin/admin-ajax.php\",\"nonce\":\"ebf77c4342\",\"mailchimp\":{\"subscribing\":\"Subscribing you please wait...\"},\"elements_data\":{\"sections\":[],\"columns\":[],\"widgets\":[]}};\n//# sourceURL=upk-site-js-extra\n/* ]]> */\n" }} />
<script type="text/javascript" id="zxcvbn-async-js-extra" dangerouslySetInnerHTML={{__html: "\n/* <![CDATA[ */\nvar _zxcvbnSettings = {\"src\":\"/wp-includes/js/zxcvbn.min.js\"};\n//# sourceURL=zxcvbn-async-js-extra\n/* ]]> */\n" }} />
<script type="text/javascript" id="password-strength-meter-js-extra" dangerouslySetInnerHTML={{__html: "\n/* <![CDATA[ */\nvar pwsL10n = {\"unknown\":\"Password strength unknown\",\"short\":\"Very weak\",\"bad\":\"Weak\",\"good\":\"Medium\",\"strong\":\"Strong\",\"mismatch\":\"Mismatch\"};\n//# sourceURL=password-strength-meter-js-extra\n/* ]]> */\n" }} />
<script type="text/javascript" src="/wp-admin/js/password-strength-meter.min.js?ver=1c9b44ab47bebc7e9d0572c680e9418d" id="password-strength-meter-js"></script>
<script id="wp-emoji-settings" type="application/json" dangerouslySetInnerHTML={{__html: "\n{\"baseUrl\":\"https://s.w.org/images/core/emoji/17.0.2/72x72/\",\"ext\":\".png\",\"svgUrl\":\"https://s.w.org/images/core/emoji/17.0.2/svg/\",\"svgExt\":\".svg\",\"source\":{\"concatemoji\":\"/wp-includes/js/wp-emoji-release.min.js?ver=1c9b44ab47bebc7e9d0572c680e9418d\"}}\n" }} />
<script type="module" dangerouslySetInnerHTML={{__html: "\n/* <![CDATA[ */\n/*! This file is auto-generated */\nconst a=JSON.parse(document.getElementById(\"wp-emoji-settings\").textContent),o=(window._wpemojiSettings=a,\"wpEmojiSettingsSupports\"),s=[\"flag\",\"emoji\"];function i(e){try{var t={supportTests:e,timestamp:(new Date).valueOf()};sessionStorage.setItem(o,JSON.stringify(t))}catch(e){}}function c(e,t,n){e.clearRect(0,0,e.canvas.width,e.canvas.height),e.fillText(t,0,0);t=new Uint32Array(e.getImageData(0,0,e.canvas.width,e.canvas.height).data);e.clearRect(0,0,e.canvas.width,e.canvas.height),e.fillText(n,0,0);const a=new Uint32Array(e.getImageData(0,0,e.canvas.width,e.canvas.height).data);return t.every((e,t)=>e===a[t])}function p(e,t){e.clearRect(0,0,e.canvas.width,e.canvas.height),e.fillText(t,0,0);var n=e.getImageData(16,16,1,1);for(let e=0;e<n.data.length;e++)if(0!==n.data[e])return!1;return!0}function u(e,t,n,a){switch(t){case\"flag\":return n(e,\"\\ud83c\\udff3\\ufe0f\\u200d\\u26a7\\ufe0f\",\"\\ud83c\\udff3\\ufe0f\\u200b\\u26a7\\ufe0f\")?!1:!n(e,\"\\ud83c\\udde8\\ud83c\\uddf6\",\"\\ud83c\\udde8\\u200b\\ud83c\\uddf6\")&&!n(e,\"\\ud83c\\udff4\\udb40\\udc67\\udb40\\udc62\\udb40\\udc65\\udb40\\udc6e\\udb40\\udc67\\udb40\\udc7f\",\"\\ud83c\\udff4\\u200b\\udb40\\udc67\\u200b\\udb40\\udc62\\u200b\\udb40\\udc65\\u200b\\udb40\\udc6e\\u200b\\udb40\\udc67\\u200b\\udb40\\udc7f\");case\"emoji\":return!a(e,\"\\ud83e\\u1fac8\")}return!1}function f(e,t,n,a){let r;const o=(r=\"undefined\"!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope?new OffscreenCanvas(300,150):document.createElement(\"canvas\")).getContext(\"2d\",{willReadFrequently:!0}),s=(o.textBaseline=\"top\",o.font=\"600 32px Arial\",{});return e.forEach(e=>{s[e]=t(o,e,n,a)}),s}function r(e){var t=document.createElement(\"script\");t.src=e,t.defer=!0,document.head.appendChild(t)}a.supports={everything:!0,everythingExceptFlag:!0},new Promise(t=>{let n=function(){try{var e=JSON.parse(sessionStorage.getItem(o));if(\"object\"==typeof e&&\"number\"==typeof e.timestamp&&(new Date).valueOf()<e.timestamp+604800&&\"object\"==typeof e.supportTests)return e.supportTests}catch(e){}return null}();if(!n){if(\"undefined\"!=typeof Worker&&\"undefined\"!=typeof OffscreenCanvas&&\"undefined\"!=typeof URL&&URL.createObjectURL&&\"undefined\"!=typeof Blob)try{var e=\"postMessage(\"+f.toString()+\"(\"+[JSON.stringify(s),u.toString(),c.toString(),p.toString()].join(\",\")+\"));\",a=new Blob([e],{type:\"text/javascript\"});const r=new Worker(URL.createObjectURL(a),{name:\"wpTestEmojiSupports\"});return void(r.onmessage=e=>{i(n=e.data),r.terminate(),t(n)})}catch(e){}i(n=f(s,u,c,p))}t(n)}).then(e=>{for(const n in e)a.supports[n]=e[n],a.supports.everything=a.supports.everything&&a.supports[n],\"flag\"!==n&&(a.supports.everythingExceptFlag=a.supports.everythingExceptFlag&&a.supports[n]);var t;a.supports.everythingExceptFlag=a.supports.everythingExceptFlag&&!a.supports.flag,a.supports.everything||((t=a.source||{}).concatemoji?r(t.concatemoji):t.wpemoji&&t.twemoji&&(r(t.twemoji),r(t.wpemoji)))});\n//# sourceURL=/wp-includes/js/wp-emoji-loader.min.js\n/* ]]> */\n" }} />
  
    </ScriptRunner>
    </>
  );
}
