using System.Text.Json;
using System.Text.Json.Serialization;

namespace Utils;

public static class SearchCursorPagedEncoder
{

    public static string JsonToBase64(string json)
    {
        return Encode64.EncodeToBase64(json);
    }
    public static string? Base64ToJson(string base64string)
    {
        return Safe.SafeLambda(() =>
        {
            return Encode64.DecodeFromBase64(base64string);
        });
    }

    public static string? EncodeCursor<T, Y>(T cursor1, Y cursor2, int page)
    {
        var cursor = new DecodedSearchCursorPaged<T, Y>(cursor1, cursor2, page);
        var cursorJson = JsonSerializer.Serialize(cursor);

        return JsonToBase64(cursorJson);
    }

    public static DecodedSearchCursorPaged<T, Y>? DecodeCursor<T, Y>(string? base64string)
    {
        if (base64string == null) return null;

        var cursorJson = Base64ToJson(base64string);
        if (cursorJson == null) return null;

        return Safe.SafeLambda(() =>
        {
            return JsonSerializer.Deserialize<DecodedSearchCursorPaged<T, Y>>(cursorJson);
        });
    }
}

public record DecodedSearchCursorPaged<T, Y>(T Cursor1, Y Cursor2, int Page);