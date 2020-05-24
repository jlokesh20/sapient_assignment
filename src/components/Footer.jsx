import React  from 'react'
import './footer.css';


function Footer(props) {
    return (
        <div className="footer-container">
            <span className="footer_username">Created by : Lokesh Jain</span>
            <span className="footer_linkedin">LinkedIn profile : <a href="https://www.linkedin.com/in/lokeshjain91/">LokeshJain</a></span>
            <span className="footer_copyright">Copyright {props.companyName}</span>
        </div>
    )
}

export default Footer;