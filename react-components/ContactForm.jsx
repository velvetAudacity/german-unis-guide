import React , {use, useState} from 'react';

function ContactForm(){
    const[formData, setFromData] = useState({
        name: '',
        phoneNumber: '', 
        email: '', 
        message: '',
        isHuman: false,
        });

    const [status, setStatus] =useState({type: '', message: ''});

}