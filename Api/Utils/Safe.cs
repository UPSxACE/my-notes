namespace Utils;

public static class Safe
{
    public static T? SafeLambda<T>(Func<T> function)
    {
        try
        {
            T? result = function();
            return result;
        }
        catch
        {
            return default;
        }
    }
}