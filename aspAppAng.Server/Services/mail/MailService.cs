using aspAppAng.Server.Models;
using Microsoft.Extensions.Options;
using MimeKit;
using System.Net;
using System.Net.Mail;

namespace aspAppAng.Server.Services.mail
{
    public class MailService : IMailService
    {
        MailSettings Mail_Settings = null;

        public MailService(IOptions<MailSettings> options)
        {
            Mail_Settings = options.Value;
        }

        public bool SendMail(MailData Mail_Data)
        {
            try
            {
                var MailClient = new SmtpClient(Mail_Settings.Host, Mail_Settings.Port)
                {
                    EnableSsl = Mail_Settings.UseSSL,
                    Credentials = new NetworkCredential("api", Mail_Settings.Api)
                };

                MailClient.Send(Mail_Settings.FromEmail, Mail_Data.ToEmail, Mail_Data.EmailSubject, Mail_Data.EmailBody);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

    }
}
