import React from 'react';
import ReactDOM from 'react-dom/client';
import ContactForm from '../react-components/ContactForm';

const contactFormRootElement = document.getElementById('contact-form-root');

if (contactFormRootElement) {
  const root = ReactDOM.createRoot(contactFormRootElement);
  root.render(
    <React.StrictMode>
      <ContactForm />
    </React.StrictMode>
  );
} else {
  console.warn("Element with ID 'contact-form-root' not found. Contact Form React app not mounted.");
}