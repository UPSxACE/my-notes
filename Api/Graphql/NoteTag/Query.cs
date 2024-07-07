
using Database;
using Dependencies;
using HotChocolate.Authorization;

namespace Graphql;

[ExtendObjectType(typeof(Query))]
public class NoteTagQueries
{
    [Authorize(Policy = "user")]
    public async Task<List<NoteTag>> OwnNoteTags([Service] Services services, [Service] UserContext userContext)
    {
        var userId = userContext.GetUserId() ?? throw new GraphQLException("Invalid authentication");
        var noteTags = await services.ExistingNoteTags(x => x.UserId == userId);

        return noteTags.Select(x => x.ToDto()).ToList();
    }
}