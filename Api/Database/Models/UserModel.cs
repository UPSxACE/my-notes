namespace Database;
public class UserModel {
    public int ID {get;set;}
    public required string Username {get;set;}
    public required string FullName {get;set;}
    public required string Email {get;set;}
    public string? Password {get;set;}
    public bool? Verified {get;set;}
    public bool? Deleted {get;set;}
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
    public DateTime? BannedUntil { get; set; }
}