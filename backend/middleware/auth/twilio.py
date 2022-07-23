from twilio.rest import Client
from backend.settings import settings


class Twilio:
    def __init__(self):
        self.client = Client(settings.TwilioAccountSid, settings.TwilioAuthToken)


    def send_verification_token(self, number):
        verification = self.client.verify \
                                  .v2 \
                                  .services(settings.TwilioServiceSid) \
                                  .verifications \
                                  .create(to=f'+1{number}', channel='sms')

        return verification.sid


    def check_verification_token(self, number, code):
        try:
            verification_check = self.client.verify \
                                            .services(settings.TwilioServiceSid) \
                                            .verification_checks \
                                            .create(to=f'+1{number}', code=code)

            return verification_check.status == "approved"
        except Exception as e: return False
