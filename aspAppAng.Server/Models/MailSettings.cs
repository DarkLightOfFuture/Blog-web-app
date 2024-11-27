namespace aspAppAng.Server.Models
{
    public class MailSettings
    {
        public string FromEmail { get; set; }
        public string Api { get; set; }
        public string Host { get; set; }
        public int Port { get; set; }
        public bool UseSSL { get; set; }
    }
}
