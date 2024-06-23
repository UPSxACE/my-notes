namespace Database;
public class RecoveryMailModel {
    public int ID {get;set;}
    public required string Uid {get;set;}
    public int UserID {get;set;}
    public int MailID {get;set;}
    public DateTime? CreatedAt { get; set; }
    public DateTime? UsedAt { get; set; }
    // Fks
    public virtual required UserModel User {get;set;}
    public virtual required MailModel Mail {get;set;}
}