using aspAppAng.Server.Models;

namespace aspAppAng.Server.Services.mail
{
    public interface IMailService
    {
        bool SendMail(MailData Mail_Data);
    }
}
