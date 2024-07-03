using System.Security.Claims;
using Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore.Storage;

namespace SignalRChat.Hubs
{
    public class TestHub : Hub
    {
        private readonly Db db;
        public TestHub(Db db)
        {
            this.db = db;
        }
        private string? GetUserId()
        {
            return Context.User?.FindFirst("userId")?.Value;
        }

        [Authorize("user")]
        public async Task NewMessage(string username, string message)
        {
            Console.WriteLine(db.Users.ToList()[0].Username);
            Console.WriteLine("User: " + GetUserId());
            await Clients.All.SendAsync("messageReceived", username, message);
        }
    }
}