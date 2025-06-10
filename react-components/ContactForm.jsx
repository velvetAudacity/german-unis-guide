import React , {use, useState} from 'react';

function ContactForm(){
    const[formData, setFormData] = useState({
        name: '',
        phoneNumber: '', 
        email: '', 
        message: '',
        isHuman: false,
        });

    const [status, setStatus] =useState({type: '', message: ''});
   
    const handleChange = (e) => {
        const{name, value, type, checked} =e.target;
        setFormmData((prevData) => ({
            ...prevData,
            [name]:type === 'checkbox' ?checked: value,
        }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({type: 'loading', message: 'Sending message...'});

        if(!formData.name || formData.email || formData.message){
            setStatus({type: 'error', message:' Please fill in all required fileds (name, Email, Message'});
            return;
        }
        if (!formData.isHuman) {
        setStatus({ type: 'error', message: 'Please confirm you are human.' });
        return;
    }
    // Basic email format validation
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setStatus({ type: 'error', message: 'Please enter a valid email address.' });
        return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/contact', { // <-- Flask backend URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone_number: formData.phoneNumber, // Match backend expected key
          email: formData.email,
          message: formData.message,
          is_human: formData.isHuman, // Match backend expected key
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: result.message });
        setFormData({ // Clear form after successful submission
          name: '',
          phoneNumber: '',
          email: '',
          message: '',
          isHuman: false,
        });
      } else {
        setStatus({ type: 'error', message: result.error || 'Failed to send message.' });
      }
    } catch (err) {
      console.error("Error submitting contact form:", err);
      setStatus({ type: 'error', message: 'Network error. Please try again later.' });
    }
  };

   return (
    <section id="contact" className="container page-content">
      <div className="contact-us-section">
        <p className="contact-us-heading">CONTACT US</p>
        <h2>Get in Touch</h2>

        <div className="contact-content-grid">
          {/* Left Column: Send us a message & static contact info */}
          <div className="contact-info-column">
            <h3>Send us a message <span className="envelope-icon">✉️</span></h3>
            <p>Feel free to reach out through contact form or find our contact information below. Your feedback, questions, and suggestions are important to us as we strive to provide exceptional service to our university community.</p>

            <div className="contact-details">
              <p><span className="icon">📧</span> contact@guguide.de</p>
              <p><span className="icon">📞</span> +49 1234 567 8910</p>
              <p><span className="icon">📍</span> 77 Massachusetts Ave, Cambridge <br/>MA 02139, United States</p>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="contact-form-column">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Your name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="tel" // Use type="tel" for phone numbers
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Enter your mobile number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Your Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email id"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Write your messages here</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Enter your message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5" // Adjust height
                  required
                ></textarea>
              </div>

              {/* Basic "I am human" checkbox (replace with real reCAPTCHA later if needed) */}
              <div className="form-group human-check">
                <input
                  type="checkbox"
                  id="isHuman"
                  name="isHuman"
                  checked={formData.isHuman}
                  onChange={handleChange}
                  required // Make it required for submission
                />
                <label htmlFor="isHuman">I am human</label>
                {/* Placeholder for reCAPTCHA branding */}
                <div className="recaptcha-placeholder">
                    {/* <img src="recaptcha-logo.png" alt="reCAPTCHA" /> */}
                    <p>Privacy - Terms</p>
                </div>
              </div>

              {status.type === 'loading' && <p className="form-status loading">{status.message}</p>}
              {status.type === 'success' && <p className="form-status success">{status.message}</p>}
              {status.type === 'error' && <p className="form-status error">{status.message}</p>}

              <button type="submit" className="submit-btn" disabled={status.type === 'loading'}>
                Submit now →
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );


}
export default ContactForm;