# Version: python:3.8
#
# Name: email_interface.py
#
# Description: Interface used for sending emails to users
#
# Author: Jasper Na

from email.message import EmailMessage
import os
from dotenv import load_dotenv, find_dotenv
import ssl
import smtplib
from email.message import EmailMessage
from data_class.booking import Booking
from data_class.user import User
from data_class.listing import Listing
from datetime import date
import codecs

CONFIRMATION_EMAIL_HTML = "utility/email_templates/confirmation.html"
WELCOME_EMAIL_HTML = "utility/email_templates/welcome.html"


class EmailInterface:

    EMAIL_LOGIN = "my.spaces.team@gmail.com"

    FIELD_NAME = "FIELD_NAME"
    FIELD_ADDRESS_SHORT = "FIELD_ADDRESS_SHORT"
    FIELD_ADDRESS_FULL = "FIELD_ADDRESS_FULL"
    FIELD_DATE = "FIELD_DATE"
    FIELD_START = "FIELD_START"
    FIELD_END = "FIELD_END"
    FIELD_TOTAL = "FIELD_TOTAL"

    @staticmethod
    # returns the unformated content of the given email HTML templates
    def get_raw_html(html_path: str):
        with codecs.open(html_path, "r") as file:
            return file.read()

    @staticmethod
    # Function sends a welcome email to a newly signed up user
    def send_welcome_email(user: User):
        formated_html = EmailInterface.get_welcome_email_html(user)
        msg = EmailMessage()
        msg["Subject"] = f"Welcome to MySpaces {user.FirstName}!"
        msg["From"] = EmailInterface.EMAIL_LOGIN
        # msg['To'] = user.Email
        msg["To"] = "stevejohnisasong@gmail.com"
        msg.add_alternative(formated_html, subtype="html")
        EmailInterface.send_email(msg, user.Email)

    @staticmethod
    # Confirmation email is sent upon a new booking being made
    def send_confirmation_email(booking: Booking):
        booked_by: User = User.get_user(booking.BookedBy)
        formated_html = EmailInterface.get_confirmation_email_html(booking)
        msg = EmailMessage()
        msg["Subject"] = f"{booked_by.FirstName}, Your Booking was Successful!"
        msg["From"] = EmailInterface.EMAIL_LOGIN
        # msg['To'] = booked_by.Email
        msg["To"] = "stevejohnisasong@gmail.com"
        msg.add_alternative(formated_html, subtype="html")
        EmailInterface.send_email(msg, booked_by.Email)

    # -------------------------------------
    #   EMAIL HTML FORMATTING
    # -------------------------------------

    @staticmethod
    # Formats the Confirmation Email HTML with new booking information
    def get_confirmation_email_html(booking: Booking):
        booked_space: Listing = Listing.get_listing(booking.BookedSpace)
        booked_by: User = User.get_user(booking.BookedBy)
        raw_html = EmailInterface.get_raw_html(CONFIRMATION_EMAIL_HTML)
        raw_html = raw_html.replace(EmailInterface.FIELD_NAME, booked_by.FirstName)
        raw_html = raw_html.replace(
            EmailInterface.FIELD_ADDRESS_FULL, booked_space.address(full_address=True)
        )
        raw_html = raw_html.replace(
            EmailInterface.FIELD_ADDRESS_SHORT, booked_space.address(street_only=True)
        )
        raw_html = raw_html.replace(EmailInterface.FIELD_DATE, str(date.today()))
        raw_html = raw_html.replace(EmailInterface.FIELD_START, booking.StartDate)
        raw_html = raw_html.replace(EmailInterface.FIELD_END, booking.EndDate)
        raw_html = raw_html.replace(
            EmailInterface.FIELD_TOTAL, "${:,.2f} AUD".format(booking.TotalCost)
        )
        return raw_html

    @staticmethod
    # Formats the Welcome Email HTML with new user account information
    def get_welcome_email_html(user: User):
        raw_html = EmailInterface.get_raw_html(WELCOME_EMAIL_HTML)
        raw_html = raw_html.replace(EmailInterface.FIELD_NAME, user.FirstName)
        raw_html = raw_html.replace(EmailInterface.FIELD_DATE, str(date.today()))
        return raw_html

    # -------------------------------------
    #   SENDING EMAILS
    # -------------------------------------

    @staticmethod
    # Function response for sending emails (Formatted in a EmailMessage object) using Google mail server
    def send_email(msg: EmailMessage):
        try:
            # Load the email login credentials (git-ignored)
            load_dotenv(find_dotenv(".secret.env"))
            EMAIL_PASSWORD = os.environ.get("EMAIL_PASSWORD")

            context = ssl.create_default_context()

            with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as smtp:
                smtp.login(user=EmailInterface.EMAIL_LOGIN, password=EMAIL_PASSWORD)
                smtp.send_message(msg)

        except Exception as e:
            print(f"[ERR] Error occured trying to send an email! {e}")
