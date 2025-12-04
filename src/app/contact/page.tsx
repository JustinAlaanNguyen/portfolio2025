"use client";
import "./contact.css";

export default function ContactPage() {
  return (
    <>
      {/* TOP SECTION — hills background */}
      <div className="contact-bg-top">
        <div className="contact-wrapper">
          <h1 className="contact-title">CONTACT ME</h1>

          <p className="contact-subtitle">
            If you&apos;d like to get in touch, <br /> I&apos;d love to hear
            from you!
          </p>
        </div>
      </div>

      {/* BOTTOM SECTION — background under the card */}
      <div className="contact-bg-bottom">
        <div className="contact-card">
          <form className="contact-form">
            <div className="input-group">
              <label>Name</label>
              <input type="text" placeholder="Your name" />
            </div>

            <div className="input-group">
              <label>Email</label>
              <input type="email" placeholder="Your email" />
            </div>

            <div className="input-group">
              <label>Message</label>
              <textarea placeholder="Write your message here..."></textarea>
            </div>

            <button type="button" className="send-btn">
              SEND
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
