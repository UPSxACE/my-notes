using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Passwords;
using UuidExtensions;

namespace Database;

// NOTE: If needed split this file in Partials
public class Services(Db db)
{
    readonly Db db = db;

    public async Task SaveChanges()
    {
        await db.SaveChangesAsync();
    }
    public DateTime TimeNow()
    {
        return db.Database.SqlQuery<DateTime>($"SELECT now()").AsEnumerable().First();
    }

    public async Task<UserModel?> ExistingUser(System.Linq.Expressions.Expression<Func<UserModel, bool>> predicate)
    {
        return await db.Users.Where(predicate).FirstOrDefaultAsync();
    }

    public async Task<UserModel?> CreateUser(string username, string email, string password, string fullName)
    {
        // Check conflicts
        var existingUser = await ExistingUser(x => x.Email.Equals(email) || x.Username.Equals(username));

        if (existingUser != null) return null;

        // Create new user
        var hashedPassword = Password.Hash(password);
        var user = new UserModel
        {
            Username = username,
            Email = email,
            Password = hashedPassword,
            FullName = fullName
        };

        await db.Users.AddAsync(user);
        await db.SaveChangesAsync();

        return user;
    }
    public async Task<ConfirmationMailModel?> ExistingConfirmationMail(System.Linq.Expressions.Expression<Func<ConfirmationMailModel, bool>> predicate, bool mail = false, bool user = false)
    {
        IQueryable<ConfirmationMailModel> x = db.ConfirmationMails;
        if (mail) x = x.Include(x => x.Mail);
        if (user) x = x.Include(x => x.User);
        return await x.Where(predicate).FirstOrDefaultAsync();
    }

    public async Task<FolderModel?> ExistingFolder(System.Linq.Expressions.Expression<Func<FolderModel, bool>> predicate)
    {
        return await db.Folders.Where(predicate).FirstOrDefaultAsync();
    }

    public async Task<List<FolderModel>> ExistingFolders(System.Linq.Expressions.Expression<Func<FolderModel, bool>> predicate)
    {
        return await db.Folders.Where(predicate).ToListAsync();
    }

    public async Task<FolderModel?> CreateFolder(int userId, string path, int priority)
    {
        // Check conflicts
        var existingFolder = await ExistingFolder(x => x.UserId == userId && x.Path == path);
        if (existingFolder != null) return null;
        // Get user
        var user = await ExistingUser(x => x.ID == userId);
        if (user == null) return null;

        // Create new folder
        var uid = Uuid7.Id25();

        var newFolder = new FolderModel
        {
            Id = uid,
            Path = path,
            Priority = priority,
            User = user,
        };

        await db.Folders.AddAsync(newFolder);
        await db.SaveChangesAsync();

        return newFolder;
    }

    public async Task<List<string>> FoldersInPath(int userId, string path)
    {
        // TODO: Reddis cache this in the future?
        var allFolders = await ExistingFolders(x => x.UserId == userId);

        HashSet<string> possiblePaths = [];
        allFolders.ForEach(folder =>
        {
            // example: if folder.Path is "/abc/def" it will add "/" then "/abc", and after the loop "/abc/def"
            List<int> slashPositions = [];
            int range = 0;
            foreach (char c in folder.Path)
            {
                // range cannot be 0, otherwise the path is just '/'
                if (c == '/' && range != 0) possiblePaths.Add(folder.Path[..range]);
                range++;
            }
            possiblePaths.Add(folder.Path);
        });

        return possiblePaths.Where(x =>
        {
            // skip "/"
            if (x == "/") return false;
            // if it starts with PATH with a / after
            // and does not have any / after that one
            // it means that its inside the PATH directory, but not nested into another directory
            // (which is what we want to return)
            var pathWithTrailingSlash = path == "/" ? "/" : path + "/";
            return x.StartsWith(pathWithTrailingSlash) && !x.Skip(pathWithTrailingSlash.Length).Contains('/');
        }).ToList();
    }

    public async Task<NoteModel?> ExistingNote(System.Linq.Expressions.Expression<Func<NoteModel, bool>> predicate)
    {
        return await db.Notes.Where(predicate).FirstOrDefaultAsync();
    }

    public async Task<NoteModel?> CreateNote(int userId, string folderPath, List<string> tags, string title, string content, string contentText, int priority)
    {
        var user = await ExistingUser(x => x.ID == userId);
        if (user == null) return null;
        // If folder with corresponding folderPath does not exist, then try setting the note in the default root folder
        var folder = await ExistingFolder(x => x.UserId == user.ID && x.Path == folderPath);
        if (folder == null) folder = await ExistingFolder(x => x.UserId == user.ID && x.Path == "/");
        if (folder == null) return null;

        var uid = Uuid7.Id25();

        var newNote = new NoteModel
        {
            Id = uid,
            Title = title,
            Content = content,
            ContentText = contentText,
            Priority = priority,
            User = user,
            Folder = folder
        };

        await db.Notes.AddAsync(newNote);
        await db.SaveChangesAsync();

        foreach (var tag in tags)
        {
            var tagModel = await ExistingOrCreateNoteTag(userId, tag);
            if (tagModel == null) continue;
            var noteNoteTag = new NoteNoteTagModel { Note = newNote, NoteTag = tagModel };
            await db.NoteNoteTags.AddAsync(noteNoteTag);
            await db.SaveChangesAsync();
        }

        return newNote;
    }

    public async Task<NoteTagModel?> ExistingOrCreateNoteTag(int userId, string name)
    {
        var user = await ExistingUser(x => x.ID == userId);
        if (user == null) return null;
        var tag = await db.NoteTags.Where(x => x.UserId == userId && x.Name == name).FirstOrDefaultAsync();
        if (tag != null) return tag;

        var uid = Uuid7.Id25();
        var newTag = new NoteTagModel
        {
            Id = uid,
            Name = name,
            User = user,
        };

        await db.NoteTags.AddAsync(newTag);
        await db.SaveChangesAsync();

        return newTag;
    }

    public async Task<List<NoteNoteTagModel>?> ExistingNoteNoteTags(System.Linq.Expressions.Expression<Func<NoteNoteTagModel, bool>> predicate)
    {
        return await db.NoteNoteTags.Include(x => x.Note).Include(x => x.NoteTag).Where(predicate).ToListAsync();
    }

}