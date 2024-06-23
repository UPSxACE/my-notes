

namespace Database;
public class MailModel
{
    public int ID { get; set; }
    public required string Reason { get; set; }
    public bool? Sent { get; set; }
    public DateTime? SentAt { get; set; }
    public DateTime? LastAttempt { get; set; }

}