namespace Graphql;

[ExtendObjectType(typeof(Query))]
public class BookResolver
{
    public Book GetBook1()
    {
        Console.WriteLine("Test1 Function");
        var book = new Book { AuthorId = 1, Id = 1, Title = "Moooo" };
        return book;
    }

    public Book GetBook2()
    {
        Console.WriteLine("Test1 Function");
        var book = new Book { AuthorId = 1, Id = 1, Title = "Moooo" };
        return book;
    }
}